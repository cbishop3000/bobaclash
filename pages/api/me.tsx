import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to get the cookie value by name
const getCookie = (cookieHeader: string | undefined, name: string): string | null => {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return decodeURIComponent(value || '');
  }
  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get the token from cookies
    const token = getCookie(req.headers.cookie, 'authToken');
    if (!token) {
      console.log('Token not found in cookies');
      return res.status(401).json({ error: 'Authentication token missing' });
    }

    // Verify the token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    // Fetch user from database using the userId from the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // Handle case where user is not found
    if (!user) {
      console.log('User not found with the given token');
      return res.status(401).json({ error: 'User not found' });
    }

    // Respond with user data, including role
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,  // Make sure to include the 'role' field in your database schema
        stripeCustomerId: user.stripeCustomerId
      },
    });

  } catch (err: unknown) {
    console.error('Error verifying token:', err);

    // Type assertion to ensure `err` is treated as an `Error`
    if (err instanceof Error) {
      return res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    }

    // If error is not an instance of Error, return a generic error
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
