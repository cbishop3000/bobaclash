// pages/api/get-subscribed-users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Assuming you have a Prisma Client instance set up

// Define the return type for the API response
interface SubscriptionUser {
  id: string;
  email: string;
  subscriptionTier: string | null;
  isNewSubscriber: boolean;
  role: string;
  deliveries: {
    id: string;
    userId: string;
    shippedAt: Date;
    items: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch all users who have a subscription tier (i.e., are subscribed)
    const subscribedUsers: SubscriptionUser[] = await prisma.user.findMany({
      where: {
        subscriptionTier: {
          not: null, // Ensures the user has a subscription tier (i.e., they are subscribed)
        },
      },
      include: {
        deliveries: true,  // Include deliveries if you want them as well
      },
    });

    res.status(200).json(subscribedUsers);
  } catch (error) {
    console.error('Error fetching subscribed users:', error);
    res.status(500).json({ error: 'Failed to fetch subscribed users' });
  }
}
