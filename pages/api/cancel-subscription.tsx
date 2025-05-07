import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Ensure this is the correct Stripe API version
});

type Data = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract priceId and customerId from the request body
  const { priceId, customerId } = req.body as { priceId: string; customerId: string };

  // Check if the necessary data is provided
  if (!priceId || !customerId) {
    return res.status(400).json({ error: 'Missing priceId or customerId' });
  }

  try {
    // Fetch all active subscriptions for the given customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    // Find the subscription that matches the given priceId
    const activeSub = subscriptions.data.find(
      (sub) => sub.items.data[0].price.id === priceId
    );

    // If no active subscription is found, return an error
    if (!activeSub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update the subscription to cancel at the end of the current billing period
    await stripe.subscriptions.update(activeSub.id, {
      cancel_at_period_end: true,
    });

    // Respond with success
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Stripe cancel error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
