import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Make sure to adjust the import according to your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Fetch user with subscriptionTier info
    const user = await prisma.user.findUnique({
      where: { email },
      select: { subscriptionTier: true },
    });

    console.log(user)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the subscriptionTier is present, return it
    return res.status(200).json({ subscriptionTier: user.subscriptionTier });
  } catch (error) {
    console.error("ERROR in /api/get-subs:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
