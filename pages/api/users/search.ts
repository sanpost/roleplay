import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { preferences, relationships, ageRanges, currentUserId } = req.body;

    console.log("Incoming request data:", { preferences, relationships, ageRanges, currentUserId });

    try {
      const conditions: any[] = [];

      // Condition to exclude the current user
      if (currentUserId) {
        conditions.push({
          userId: { not: currentUserId }, // Exclude current user
        });
        console.log("Exclusion condition for current user added.");
      }

      if (preferences && preferences.length > 0) {
        conditions.push({
          preferences: {
            some: {
              preference_id: { in: preferences },
            },
          },
        });
        console.log("Preferences condition added.");
      }

      if (relationships && relationships.length > 0) {
        conditions.push({
          relationships: {
            some: {
              relationship_id: { in: relationships },
            },
          },
        });
        console.log("Relationships condition added.");
      }

      if (ageRanges && ageRanges.length > 0) {
        conditions.push({
          ageRanges: {
            some: {
              age_range_id: { in: ageRanges },
            },
          },
        });
        console.log("Age ranges condition added.");
      }

      console.log("Final conditions for query:", conditions);

      const profiles = await prisma.profile.findMany({
        where: conditions.length > 0 ? { AND: conditions } : {},
        include: {
          user: true,
          preferences: { include: { preference: true } },
          relationships: { include: { relationship: true } },
          ageRanges: { include: { ageRange: true } },
          contactMethods: { include: { contactMethod: true } },
        },
      });

      // Transformacja wyników dla komponentu `UserList`
      const users = profiles.map((profile) => ({
        id: profile.id,
        user: {
          username: profile.user.username,
        },
        bio: profile.bio,
        age: profile.age,
        gender: profile.gender,
        preferences: profile.preferences.map((pref) => pref.preference.name),
        relationships: profile.relationships.map((rel) => rel.relationship.name),
        ageRanges: profile.ageRanges.map((range) => range.ageRange.name),
        contact_methods: profile.contactMethods.map((method) => method.contactMethod.name),
      }));

      console.log("Transformed users data:", JSON.stringify(users, null, 2));

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
