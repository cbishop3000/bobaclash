import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import prisma from '../../lib/prisma'; // Adjust this import to your project structure
import { SubscriptionTier } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia', // or latest stable
});

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful Checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const customerEmail = session.customer_email;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      const priceId = lineItems.data[0]?.price?.id;

      if (!customerEmail || !priceId) {
        console.warn('Missing customerEmail or priceId from session.');
        return res.status(400).json({ error: 'Incomplete session data' });
      }

      const subscriptionTier = getSubscriptionTier(priceId);
      if (!subscriptionTier) {
        console.warn('Unknown subscription tier for priceId:', priceId);
        return res.status(400).json({ error: 'Invalid subscription tier' });
      }

      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          subscriptionTier: { set: subscriptionTier },
        },
      });

      console.log(`Updated subscription tier for ${customerEmail} to ${subscriptionTier}`);
    } catch (err) {
      console.error('Error handling session completion:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(200).json({ received: true });
}

// Map Stripe priceId to your Prisma enum
function getSubscriptionTier(priceId: string): SubscriptionTier | null {
  const tiers: Record<string, SubscriptionTier> = {
    'price_1RFjlBHyP3FLprp1stDcSwmc': 'CLASHOHOLIC',
    'price_1RFjkhHyP3FLprp1dzlAwJCp': 'NEED',
    'price_1RFjjOHyP3FLprp1t7p5AOwM': 'LOVE',
    'price_1RFjiLHyP3FLprp1YhkDlNA3': 'LIKE',
  };

  return tiers[priceId] ?? null;
}
