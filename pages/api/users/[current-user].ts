import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get the session to retrieve the logged-in user's email
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userEmail = session.user.email;

    // Find the user by email and include the profile relation
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { profile: true },
    });

    // Check if the user and profile exist
    if (!user || !user.profile) {
      return res.status(404).json({ message: 'User or profile not found' });
    }

    // Return only the profile ID
    return res.status(200).json({
      profile_id: user.profile.id,
    });

  } catch (error) {
    console.error('Error fetching current user profile_id:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
