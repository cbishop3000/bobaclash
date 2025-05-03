import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

interface CreateCheckoutSessionBody {
  priceId: string;
  email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { priceId, email }: CreateCheckoutSessionBody = req.body;

      if (!priceId || !email) {
        console.error('Missing priceId or email');
        return res.status(400).json({ error: 'Missing priceId or email' });
      }

      const baseUrl =
        process.env.NODE_ENV === 'development'
          ? req.headers.origin
          : process.env.NEXT_PUBLIC_URL;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: email,
        success_url: `${baseUrl}/subscribe`,
        cancel_url: `${baseUrl}/cancel`,
      });

      console.log('✅ Checkout session created:', session.id);
      res.status(200).json({ id: session.id });
    } catch (error: any) {
      console.error('❌ Error creating checkout session:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
