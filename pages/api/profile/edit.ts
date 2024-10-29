import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { email, username, bio, age, preferences, age_range, relationship, gender, contact_methods } = req.body;

    // Validate required fields
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    // Sanitize bio to prevent SQL Injection and other harmful scripts
    const bioRegex = /[<>\/\\\[\]{}();]/; // Simple regex to find dangerous characters
    if (bioRegex.test(bio)) {
      return res.status(400).json({ message: 'Bio contains invalid characters!' });
    }

    // Optional fields
    const ageAsInt = age ? parseInt(age, 10) : null;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Use a transaction to ensure all changes are applied atomically
      await prisma.$transaction(async (prisma) => {
        // Update user profile information
        const updatedProfile = await prisma.profile.update({
          where: { user_id: user.id },
          data: {
            bio,
            age: ageAsInt,
            gender,
          },
        });

        // Delete existing relationships
        await prisma.userPreference.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userAgeRange.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userRelationship.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userContactMethod.deleteMany({ where: { profile_id: updatedProfile.id } });

        // Map preferences and save
        if (preferences) {
          await prisma.userPreference.createMany({
            data: preferences.map((preferenceId: number) => ({
              profile_id: updatedProfile.id,
              preference_id: preferenceId,
            })),
          });
        }

        // Map age ranges and save
        if (age_range) {
          await prisma.userAgeRange.createMany({
            data: age_range.map((ageRangeId: number) => ({
              profile_id: updatedProfile.id,
              age_range_id: ageRangeId,
            })),
          });
        }

        // Map relationships and save
        if (relationship) {
          await prisma.userRelationship.createMany({
            data: relationship.map((relationshipId: number) => ({
              profile_id: updatedProfile.id,
              relationship_id: relationshipId,
            })),
          });
        }

        // Map contact methods and save
        if (contact_methods) {
          await prisma.userContactMethod.createMany({
            data: contact_methods.map((contactMethodId: number) => ({
              profile_id: updatedProfile.id,
              contact_method_id: contactMethodId,
            })),
          });
        }
      });

      return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
