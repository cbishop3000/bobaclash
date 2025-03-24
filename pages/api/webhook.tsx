import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ error: 'Webhook Error' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const stripeSubscriptionId = session.subscription as string;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId,
            stripeSubscriptionStatus: 'active',
          },
        });

        await prisma.subscription.create({
          data: {
            userId,
            stripeSubscriptionId,
            status: 'active',
            tier: 'BASIC', // Adjust if needed
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const stripeSubscriptionId = subscription.id;
      const status = subscription.status;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: { status },
      });

      await prisma.user.updateMany({
        where: { stripeSubscriptionId },
        data: { stripeSubscriptionStatus: status },
      });
      break;
    }
  }

  res.json({ received: true });
}
