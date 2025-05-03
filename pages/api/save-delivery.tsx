import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // adjust if path differs

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, items, shippedAt } = req.body;

    try {
      // 1. Create the delivery log
      const deliveryLog = await prisma.deliveryLog.create({
        data: {
          userId,
          items,
          shippedAt: new Date(shippedAt),
        },
      });

      // 2. Update user with new last delivery date
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastDeliveryDate: new Date(shippedAt),
        },
      });

      return res.status(200).json({ success: true, deliveryLog });
    } catch (error) {
      console.error('Failed to save delivery:', error);
      return res.status(500).json({ error: 'Server error saving delivery' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
