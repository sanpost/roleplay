// pages/api/profile/edit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { email, username, bio, age, preferences, ageRange, relationship, gender, contactMethod } = req.body;

    // Validate the incoming data
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const ageAsInt = age ? parseInt(age, 10) : null;

      // Update the user's profile
      const updatedProfile = await prisma.profile.update({
        where: { user_id: user.id }, // Assuming user_id is the relation key
        data: {
          bio,
          age: ageAsInt,  
          preferences,
          age_range: ageRange,
          relationship,
          gender,
          contact_methods: contactMethod,
        },
      });

      return res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
