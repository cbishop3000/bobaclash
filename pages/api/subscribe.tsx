import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import prisma from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Utility function to map priceId → subscriptionTier (enum)
const getTierFromPriceId = (priceId: string): 'CLASHAHOLIC' | 'I_NEED_COFFEE' | 'I_LOVE_COFFEE' | 'I_LIKE_COFFEE' => {
  const mapping: { [key: string]: 'CLASHAHOLIC' | 'I_NEED_COFFEE' | 'I_LOVE_COFFEE' | 'I_LIKE_COFFEE' } = {
    'price_like': 'I_LIKE_COFFEE',
    'price_love': 'I_LOVE_COFFEE',
    'price_need': 'I_NEED_COFFEE',
    'price_clashaholic': 'CLASHAHOLIC',
  };

  return mapping[priceId] ?? 'I_LIKE_COFFEE'; // default fallback if priceId doesn't match
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, priceId } = req.body;

  if (!email || !priceId) {
    return res.status(400).json({ error: 'Email and priceId are required' });
  }

  try {
    // Check if the user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    // Create user if they don’t exist
    if (!user) {
      const hashedPassword = await bcrypt.hash('default_password', 10); // you could also generate a random one

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          stripeCustomerId: '', // we’ll update after Stripe customer is created
          subscriptionTier: getTierFromPriceId(priceId), // use enum value here
        },
      });
    }

    // If the user doesn't yet have a Stripe customer ID
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
