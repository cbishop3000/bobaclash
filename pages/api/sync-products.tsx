import type { NextApiRequest, NextApiResponse } from 'next';
import syncStripeProducts from '@/pages/api/syncProducts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Calling Stripe sync function...');
    await syncStripeProducts(); // This will fetch and log products
    return res.status(200).json({ message: 'Products fetched from Stripe' });
  } catch (error) {
    console.error('❌ Error syncing products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}
