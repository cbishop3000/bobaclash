import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';  // Import Prisma client
import bcrypt from 'bcryptjs';  // For hashing the password

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      email,
      password,
      username,
      addressStreet,
      addressUnit,
      addressCity,
      addressState,
      addressPostalCode,
      addressCountry,
      addressFormatted,
    } = req.body;  // Include all address fields

    // Validate required fields
    if (!email || !password || !username || !addressStreet || !addressCity || !addressState || !addressCountry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          addressStreet,
          addressUnit,
          addressCity,
          addressState,
          addressPostalCode,
          addressCountry,
          addressFormatted,
        },
      });
    
      return res.status(200).json({
        message: 'User created successfully!',
        user: newUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
      }
    }
    
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
