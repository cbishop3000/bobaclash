import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ensure the response from Stripe is typed correctly
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();

    // Map over the products and ensure proper typing
    const productDetails = products.data.map((product) => {
      // Type guard for the product
      if ('name' in product) {
        return { name: product.name, id: product.id }; // Access 'name' and 'id' safely
      }
      return { name: 'Unknown Product', id: 'Unknown ID' }; // Fallback if not a Product
    });

    return res.status(200).json({ products: productDetails, prices: prices.data });
  } catch (error) {
    console.error('Error fetching products or prices:', error);
    return res.status(500).json({ error: 'Failed to fetch products or prices' });
  }
}
