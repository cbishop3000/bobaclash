import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure this endpoint only accepts POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Incoming request body:', req.body); // Log the incoming request body

    const { cart } = req.body;  // Destructure 'cart' from the request body (ensure frontend sends it as 'cart')
    const cartItemsArray = Object.values(cart);
    // Validate that 'cart' is an array and not empty
    if (!cartItemsArray || cartItemsArray.length === 0) {
      throw new Error('Invalid or empty cart items array');
    }

    // Construct Stripe line items from the cart items
    const dbProducts = await prisma.product.findMany({where: {id: {
      in: Object.keys(cart)
    }}})

    const dbProductsByStripeId = Object.fromEntries(dbProducts.map(p => [p.stripeId, p]))

    const lineItems = Object.values(cart).map((item: any) => {
      if (!item.quantity || !item.stripeId ) {
        throw new Error('Missing item properties: quantity, stripeId');
      }

      const dbProduct = dbProductsByStripeId[item.stripeId]

      // Ensure price is in cents (Stripe expects unit_amount in cents)
      const unitAmount = Math.round(dbProduct.price * 100); // Convert price to cents

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: dbProduct.name,
            description: dbProduct.description || 'No description provided', // Default description if none exists
            images: [dbProduct.imageUrl], // Include the image URL
          },
          unit_amount: unitAmount, // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    console.log('Stripe line items:', lineItems); // Log the formatted Stripe line items

    // Create the Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Only accept card payments
      line_items: lineItems,
      mode: 'payment',  // One-time payment mode
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect on success
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`, // Redirect on cancel
    });

    console.log('Stripe session created:', session); // Log session creation response

    // Send the session ID back to the frontend
    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error); // Log any errors
    return res.status(500).json({ error: (error as Error).message });
  }
}
