import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === 'GET') {
    // Validate that email is provided
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing email' });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { profile: true },
      });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Fetch associated data using user_id
      const profile = await prisma.profile.findUnique({
        where: { user_id: user.id },
      });

      // Fetch lists of preferences, age ranges, relationships, and genders
      const preferences = await prisma.preferences.findMany();
      const ageRanges = await prisma.age_range.findMany();
      const relationships = await prisma.relationship.findMany();
      const genders = await prisma.gender.findMany();

      return res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          profile: profile || {}, // Ensure profile exists
        },
        preferences,
        ageRanges,
        relationships,
        genders,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
