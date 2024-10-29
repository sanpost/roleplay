import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { googleId } = req.query;

  if (req.method === 'GET') {
    try {
      // Znajdź użytkownika po google_id
      const user = await prisma.user.findUnique({
        where: { google_id: Array.isArray(googleId) ? googleId[0] : googleId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user.profile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching profile' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
