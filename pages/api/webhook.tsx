import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '@/lib/prisma'; // Adjust path if needed

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle raw Stripe webhook
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Ensure you're using the correct Stripe API version
});

// Define SubscriptionTier enum as per Prisma schema (with uppercase values)
type SubscriptionTier = 'CLASHAHOLIC' | 'I_NEED_COFFEE' | 'I_LOVE_COFFEE' | 'I_LIKE_COFFEE';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!;
    const buf = await buffer(req);

    const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set!');
      return res.status(500).send('Webhook secret not found');
    }

    let event: Stripe.Event;

    try {
      // Construct the event using the raw body (buf) and signature
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`❌ Webhook Error: ${(err as Error).message}`);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    console.log('Received event:', event.type); // Log the event type for debugging

    // Only handle the "checkout.session.completed" event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract necessary details from the session
      const customerEmail = session.customer_email ?? 'unknown@example.com'; // Safely handle missing email
      const stripeCustomerId = session.customer as string;

      // Get subscription ID from session
      const subscriptionId = session.subscription as string;

      try {
        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        // Map Stripe price ID to internal subscription tier (ensure keys match the Prisma Enum)
        const tierMap: { [key: string]: SubscriptionTier } = {
          'price_1RFjlBHyP3FLprp1stDcSwmc': 'CLASHAHOLIC',
          'price_1RFjkhHyP3FLprp1dzlAwJCp': 'I_NEED_COFFEE',
          'price_1RFjjOHyP3FLprp1t7p5AOwM': 'I_LOVE_COFFEE',
          'price_1RFjiLHyP3FLprp1YhkDlNA3': 'I_LIKE_COFFEE',
        };

        // Determine the subscription tier based on priceId
        const subscriptionTier = tierMap[priceId];

        if (!subscriptionTier) {
          console.error(`❌ Unknown priceId: ${priceId}`);
          return res.status(400).send('Unknown subscription tier.');
        }

        // Update the user record in your Prisma database
        await prisma.user.update({
          where: { email: customerEmail },
          data: {
            stripeCustomerId,
            subscriptionTier, // Now type-safe and consistent with Prisma schema
            isNewSubscriber: false, // Mark as not new after first subscription
          },
        });

        console.log(`✅ Updated user ${customerEmail} with tier: ${subscriptionTier}`);
      } catch (updateErr) {
        console.error(`❌ Failed to update user for email ${customerEmail}:`, updateErr);
        return res.status(500).send('Database update failed.');
      }
    }

    // Respond with a success message after processing
    res.status(200).json({ received: true });
  } else {
    // If the method is not POST, return a Method Not Allowed error
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
