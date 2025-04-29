// /pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear the authentication cookie by setting it to expire immediately
    res.setHeader('Set-Cookie', [
      `authToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict; Secure`,  // Expiring the token immediately
    ]);

    return res.status(200).json({ message: 'Logged out successfully' });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
