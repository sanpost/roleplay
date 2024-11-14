import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === "GET") {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Invalid or missing email" });
    }

    try {
      // Fetch user and profile data
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { profile: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const profile = await prisma.profile.findUnique({
        where: { user_id: user.id },
      });

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

      const preferences = await prisma.preference.findMany();
      const ageRanges = await prisma.ageRange.findMany();
      const relationships = await prisma.relationship.findMany();
      const genders = await prisma.gender.findMany();
      const contactMethods = await prisma.contactMethod.findMany();

      const preferenceIds = userPreferences.map((up) => up.preference_id);
      const ageRangeIds = userAgeRanges.map((uar) => uar.age_range_id);
      const relationshipIds = userRelationships.map((ur) => ur.relationship_id);

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
      console.error("Error fetching profile data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    // Obsługa metody PUT
    const {
      email,
      username,
      bio,
      age,
      preferences,
      age_range,
      relationship,
      gender,
      contact_methods,
    } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await prisma.$transaction(async (prisma) => {
        const updatedProfile = await prisma.profile.update({
          where: { user_id: user.id },
          data: {
            bio,
            age: age ? parseInt(age, 10) : null,
            gender,
          },
        });

        await prisma.userPreference.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userAgeRange.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userRelationship.deleteMany({ where: { profile_id: updatedProfile.id } });
        await prisma.userContactMethod.deleteMany({ where: { profile_id: updatedProfile.id } });

        if (preferences) {
          await prisma.userPreference.createMany({
            data: preferences.map((preferenceId: number) => ({
              profile_id: updatedProfile.id,
              preference_id: preferenceId,
            })),
          });
        }

        if (age_range) {
          await prisma.userAgeRange.createMany({
            data: age_range.map((ageRangeId: number) => ({
              profile_id: updatedProfile.id,
              age_range_id: ageRangeId,
            })),
          });
        }

        if (relationship) {
          await prisma.userRelationship.createMany({
            data: relationship.map((relationshipId: number) => ({
              profile_id: updatedProfile.id,
              relationship_id: relationshipId,
            })),
          });
        }

        if (contact_methods) {
          const validContactMethods = contact_methods.filter(
            (cm: { id: number; link: string }) => cm.id && cm.link
          );

          if (validContactMethods.length > 0) {
            await prisma.userContactMethod.createMany({
              data: validContactMethods.map((cm: { id: any; link: any; }) => ({
                profile_id: updatedProfile.id,
                contact_method_id: cm.id,
                contactLink: cm.link,
              })),
            });
          }
        }
      });

      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
