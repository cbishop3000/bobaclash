// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import prisma from '../../lib/prisma';        // ← adjust if your prisma client is elsewhere
import { SubscriptionTier } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,                       // ← disable built-in parser so we can verify Stripe’s signature
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  // 1) Read raw body
  let buf: Buffer;
  try {
    buf = await buffer(req);
  } catch (err) {
    console.error('Error reading raw body:', err);
    return res.status(500).end('Server Error');
  }

  // 2) Verify Stripe signature
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 3) Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_email;
    if (!customerEmail) {
      console.warn('No customer email on session—skipping.');
      return res.status(400).json({ error: 'Missing customer email' });
    }

    // Pull the single line item
    let priceId: string | undefined;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      priceId = lineItems.data[0]?.price?.id;
    } catch (err) {
      console.error('Error fetching line items:', err);
      return res.status(500).end('Server Error');
    }

    if (!priceId) {
      console.warn('No priceId on line item—skipping.');
      return res.status(400).json({ error: 'Missing price ID' });
    }

    // Map to your enum
    const subscriptionTier = getSubscriptionTier(priceId);
    if (!subscriptionTier) {
      console.warn('Unrecognized priceId:', priceId);
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    // Update the user record
    try {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          subscriptionTier: { set: subscriptionTier },
          stripeCustomerId: session.customer as string, // 🟢 Save customer ID here
        },
      });
      console.log(`✅ Updated ${customerEmail} with ${subscriptionTier} and customer ID.`);
    } catch (err) {
      console.error('Database update failed:', err);
      return res.status(500).end('Server Error');
    }
  }

  // Acknowledge receipt
  res.status(200).json({ received: true });
}

// Helper: map Stripe price IDs → your Prisma enum
function getSubscriptionTier(priceId: string): SubscriptionTier | null {
  const map: Record<string, SubscriptionTier> = {
    'price_1RFjlBHyP3FLprp1stDcSwmc': 'CLASHOHOLIC',
    'price_1RFjkhHyP3FLprp1dzlAwJCp': 'NEED',
    'price_1RFjjOHyP3FLprp1t7p5AOwM': 'LOVE',
    'price_1RFjiLHyP3FLprp1YhkDlNA3': 'LIKE',
  };
  return map[priceId] ?? null;
}
