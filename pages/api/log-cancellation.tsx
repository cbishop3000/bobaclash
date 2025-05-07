import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Import prisma client

type Data = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, cancellationStatus, reason, errorMessage } = req.body;

  if (!userId || !cancellationStatus) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create the cancellation log in the database
    const log = await prisma.cancellationLog.create({
      data: {
        userId,
        cancellationStatus,
        reason: reason || null,
        errorMessage: errorMessage || null,
      },
    });

    // Respond with success
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Error logging cancellation:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
