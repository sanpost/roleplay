import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { preferences, relationships, ageRanges } = req.body;

    console.log("Incoming request data:", { preferences, relationships, ageRanges });

    try {
      const conditions: any[] = [];

      // Zagnieżdżone warunki dla każdego z filtrów:
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

      // Log final conditions for query
      console.log("Final conditions for query:", conditions);

      // Wyszukiwanie profili z dopasowanymi warunkami
      const users = await prisma.profile.findMany({
        where: conditions.length > 0 ? { AND: conditions } : {},
        include: {
          user: true, // Dołącz dane użytkownika
          preferences: {
            include: {
              preference: true,
            },
          },
          relationships: {
            include: {
              relationship: true,
            },
          },
          ageRanges: {
            include: {
              ageRange: true,
            },
          },
          contactMethods: {
            include: {
              contactMethod: true,
            },
          },
        },
      });

      console.log("Users retrieved from database:", users);

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
