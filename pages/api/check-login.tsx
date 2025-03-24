// /pages/api/auth/check-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Function to verify JWT token
const verifyToken = (token: string) => {
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        reject(new Error('Invalid token'));
      } else {
        resolve(decoded as JwtPayload);  // Cast to JwtPayload type
      }
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Get the JWT token from the cookies
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    try {
      // Verify the token
      const decoded = await verifyToken(token as string);
      
      // If the token is valid, return the user data or loggedIn status
      return res.status(200).json({ loggedIn: true, userId: decoded.userId });
    } catch (error) {
      return res.status(401).json({ loggedIn: false });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default handler;
