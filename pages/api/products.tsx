// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Import Prisma client

// This handler will be called when the `/api/products` endpoint is requested.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch products from the Prisma database
    const products = await prisma.product.findMany(); // You can customize this query if needed

    // Return the fetched products as a JSON response
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}
