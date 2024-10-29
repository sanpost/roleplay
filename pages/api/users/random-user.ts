import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Fetch all profiles from the database
      const profiles = await prisma.profile.findMany({
        include: {
          user: true,
          preferences: { include: { preference: true } },
          relationships: { include: { relationship: true } },
          ageRanges: { include: { ageRange: true } },
          contactMethods: { include: { contactMethod: true } },
        },
      });

      // Check if profiles are found
      if (profiles.length === 0) {
        return res.status(404).json({ message: "No profiles found" });
      }

      // Randomly select a profile
      const randomIndex = Math.floor(Math.random() * profiles.length);
      const selectedProfile = profiles[randomIndex];

      // Transform the selected profile for the response
      const userResponse = {
        id: selectedProfile.id,
        user: {
          username: selectedProfile.user.username,
        },
        bio: selectedProfile.bio || null,
        age: selectedProfile.age || null,
        gender: selectedProfile.gender || null,
        preferences: selectedProfile.preferences
          ? selectedProfile.preferences.map((pref) => pref.preference.name)
          : null,
        relationships: selectedProfile.relationships
          ? selectedProfile.relationships.map((rel) => rel.relationship.name)
          : null,
        ageRanges: selectedProfile.ageRanges
          ? selectedProfile.ageRanges.map((range) => range.ageRange.name)
          : null,
        contact_methods: selectedProfile.contactMethods
          ? selectedProfile.contactMethods.map((method) => method.contactMethod.name)
          : null,
      };

      // Respond with the selected user's data
      res.status(200).json(userResponse);
    } catch (error) {
      console.error("Error fetching random user:", error);
      res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
