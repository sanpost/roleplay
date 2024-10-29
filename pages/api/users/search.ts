import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCurrentUserProfileId(req: NextApiRequest): Promise<number | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/current-user`, {
      headers: {
        Cookie: req.headers.cookie || "", // Pass cookies for authentication
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch current user profile_id");
      return null;
    }

    const data = await response.json();
    return data.profile_id;
  } catch (error) {
    console.error("Error fetching current user profile_id:", error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { preferences, relationships, ageRanges } = req.body;

    console.log("Incoming request data:", { preferences, relationships, ageRanges });

    try {
      const conditions: any[] = [];

      // Get the current user's profile_id
      const currentUserProfileId = await getCurrentUserProfileId(req);

      if (currentUserProfileId) {
        conditions.push({
          id: { not: currentUserProfileId }, // Exclude the logged-in user's profile
        });
        console.log("Exclusion condition for current user profile_id added.");
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

      // Transform the results for the `UserList`
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
