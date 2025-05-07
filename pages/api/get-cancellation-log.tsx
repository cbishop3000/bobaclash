// pages/api/get-cancellation-log.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the structure of the cancellation log
interface CancellationLog {
  id: string;
  userId: string;
  cancellationStatus: string;
  cancellationDate: string;
  reason?: string;
  errorMessage?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extract the user ID from the request body
      const { userId }: { userId?: string } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Fetch cancellation log data from the database using Prisma
      const cancellationLog = await getCancellationLogFromDatabase(userId);

      // If no cancellation log exists, send back a default response
      if (!cancellationLog) {
        return res.status(404).json({ error: 'No cancellation log found for this user' });
      }

      // Send the cancellation log data
      return res.status(200).json({ cancellationLog });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Function to fetch the cancellation log from the database using Prisma
async function getCancellationLogFromDatabase(userId: string): Promise<CancellationLog | null> {
  try {
    const cancellationLog = await prisma.cancellationLog.findFirst({
      where: {
        userId: userId,
      },
    });

    // Return the cancellation log if found
    if (cancellationLog) {
      return {
        id: cancellationLog.id,
        userId: cancellationLog.userId,
        cancellationStatus: cancellationLog.cancellationStatus,
        cancellationDate: cancellationLog.cancellationDate.toISOString(),
      };
    }

    return null; // No log found for the user
  } catch (error) {
    console.error('Error fetching cancellation log:', error);
    return null;
  }
}
