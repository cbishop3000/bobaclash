import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const token = getCookie(req.headers.cookie, 'authToken');

    if (!token) {
      console.log('Token not found in cookies');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'User not found' });
    }

    // Return the user along with the role (e.g., 'USER' or 'ADMIN')
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,  // Make sure to include the role in your database schema
      },
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
