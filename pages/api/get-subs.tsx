import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        where: {
          stripeCustomerId: {
            not: null,
          },
        },
        include: {
          deliveries: true, // Include delivery logs for each user
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
