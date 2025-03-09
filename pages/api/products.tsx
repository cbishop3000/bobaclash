// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch products from the database using Prisma
      const products = await prisma.product.findMany();
      console.log('Fetched products:', products); // Log the products to check
      return res.status(200).json(products); // Return the products as an array
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return res.status(500).json({ message: 'Error fetching products' });
    }
  } else {
    // Respond with a 405 error if the method is not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
