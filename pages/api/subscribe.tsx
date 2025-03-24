// pages/api/subscribe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, priceId } = req.body; // We only need email and priceId here (no username, password)

  // Make sure all required fields are provided
  if (!email || !priceId) {
    return res.status(400).json({ error: 'Email and priceId are required' });
  }

  try {
    // Check if the user already exists in the database by their email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If the user doesn't exist, create them automatically (set a default password or similar)
    if (!user) {
      // This is where you can set a default password for new users, you can handle it as you like
      user = await prisma.user.create({
        data: {
          email, // Required
          username: email.split('@')[0],  // Use email prefix as a default username
          password: 'default_password',  // A default password (you should hash it for production)
        },
      });
    }

    // Now, handle Stripe subscription
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });

      // Update user with Stripe Customer ID
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
