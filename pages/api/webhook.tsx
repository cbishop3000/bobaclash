import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false, // Required for Stripe to verify the signature
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

type SubscriptionTier = 'CLASHAHOLIC' | 'I_NEED_COFFEE' | 'I_LOVE_COFFEE' | 'I_LIKE_COFFEE';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!;
    const buf = await buffer(req);

    const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
    if (!webhookSecret) {
      console.error('❌ STRIPE_ENDPOINT_SECRET not set');
      return res.status(500).send('Missing Stripe webhook secret');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`❌ Webhook Error: ${(err as Error).message}`);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }    

    console.log(`🔔 Received event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeCustomerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      let customerEmail = session.customer_email;

      // Fallback to customer object if email is missing
      if (!customerEmail && stripeCustomerId) {
        try {
          const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
          customerEmail = customer.email ?? 'unknown@example.com';
        } catch (err) {
          console.error('❌ Failed to retrieve Stripe customer:', err);
          return res.status(500).send('Failed to retrieve customer');
        }
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        const tierMap: { [key: string]: SubscriptionTier } = {
          'price_1RFjlBHyP3FLprp1stDcSwmc': 'CLASHAHOLIC',
          'price_1RFjkhHyP3FLprp1dzlAwJCp': 'I_NEED_COFFEE',
          'price_1RFjjOHyP3FLprp1t7p5AOwM': 'I_LOVE_COFFEE',
          'price_1RFjiLHyP3FLprp1YhkDlNA3': 'I_LIKE_COFFEE',
        };

        const subscriptionTier = tierMap[priceId];

        if (!subscriptionTier) {
          console.error(`❌ Unknown priceId: ${priceId}`);
          return res.status(400).send('Unknown subscription tier.');
        }

        const safeEmail = customerEmail ?? undefined;

        await prisma.user.update({
          where: { email: safeEmail },
          data: {
            stripeCustomerId,
            subscriptionTier,
            isNewSubscriber: false,
          },
        });

        console.log(`✅ Updated user ${customerEmail} with tier ${subscriptionTier}`);
      } catch (err) {
        console.error(`❌ Failed to update user ${customerEmail}:`, err);
        return res.status(500).send('Database update failed.');
      }
    }

    return res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
}
