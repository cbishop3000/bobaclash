// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';  // Import Prisma client
import bcrypt from 'bcryptjs';  // For hashing the password

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database using Prisma
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,  // Store the hashed password
        },
      });

      // Send a response with the created user data
      return res.status(200).json({
        message: 'User created successfully!',
        user: newUser
      });
    } catch (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
