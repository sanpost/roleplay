import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === 'GET') {
    // Walidacja adresu email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing email' });
    }

    try {
      // Znajdź użytkownika na podstawie email
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { profile: true },
      });

      // Sprawdź, czy użytkownik istnieje
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Pobierz dane profilu użytkownika
      const profile = await prisma.profile.findUnique({
        where: { user_id: user.id },
      });

      // Pobierz preferencje, przedziały wiekowe, relacje i metody kontaktu użytkownika
      const userPreferences = await prisma.userPreference.findMany({
        where: { profile_id: profile?.id },
        select: { preference_id: true },
      });

      const userAgeRanges = await prisma.userAgeRange.findMany({
        where: { profile_id: profile?.id },
        select: { age_range_id: true },
      });

      const userRelationships = await prisma.userRelationship.findMany({
        where: { profile_id: profile?.id },
        select: { relationship_id: true },
      });

      const userContactMethods = await prisma.userContactMethod.findMany({
        where: { profile_id: profile?.id },
        select: {
          contact_method_id: true,
          contactLink: true,
        },
      });

      // Pobierz listy preferencji, przedziałów wiekowych, relacji, płci i metod kontaktu
      const preferences = await prisma.preference.findMany();
      const ageRanges = await prisma.ageRange.findMany();
      const relationships = await prisma.relationship.findMany();
      const genders = await prisma.gender.findMany();
      const contactMethods = await prisma.contactMethod.findMany();

      // Wyciągnij identyfikatory z tabel użytkownika
      const preferenceIds = userPreferences.map((up) => up.preference_id);
      const ageRangeIds = userAgeRanges.map((uar) => uar.age_range_id);
      const relationshipIds = userRelationships.map((ur) => ur.relationship_id);

      // Dla metod kontaktu pobierz zarówno id, jak i link
      const contactMethodsData = userContactMethods.map((ucm) => ({
        id: ucm.contact_method_id,
        link: ucm.contactLink || "",
      }));

      return res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          profile: {
            bio: profile?.bio || "",
            age: profile?.age,
            gender: profile?.gender,
            preferences: preferenceIds,
            age_range: ageRangeIds,
            relationship: relationshipIds,
            contact_methods: contactMethodsData,
          },
        },
        preferences,
        ageRanges,
        relationships,
        genders,
        contactMethods,
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
