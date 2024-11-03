import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCurrentUserProfileId(req: NextApiRequest): Promise<number | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/current-user`, {
      headers: {
        Cookie: req.headers.cookie || "", // Przekazanie ciasteczek dla autentykacji
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const currentUserProfileId = await getCurrentUserProfileId(req);

      // Pobieramy wszystkie profile z bazy danych, wykluczając bieżącego użytkownika
      const profiles = await prisma.profile.findMany({
        where: {
          id: currentUserProfileId !== null ? { not: currentUserProfileId } : undefined,
        },
        include: {
          user: true,
          preferences: { include: { preference: true } },
          relationships: { include: { relationship: true } },
          ageRanges: { include: { ageRange: true } },
          contactMethods: {
            include: {
              contactMethod: true,
            },
          },
        },
      });

      // Sprawdzamy, czy znaleziono profile
      if (profiles.length === 0) {
        return res.status(404).json({ message: "No profiles found" });
      }

      // Losowo wybieramy profil
      const randomIndex = Math.floor(Math.random() * profiles.length);
      const selectedProfile = profiles[randomIndex];

      // Przekształcamy wybrany profil do odpowiedniego formatu
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
          : [],
        relationships: selectedProfile.relationships
          ? selectedProfile.relationships.map((rel) => rel.relationship.name)
          : [],
        ageRanges: selectedProfile.ageRanges
          ? selectedProfile.ageRanges.map((range) => range.ageRange.name)
          : [],
        contact_methods: selectedProfile.contactMethods
          ? selectedProfile.contactMethods.map((method) => ({
              name: method.contactMethod.name,
              link: method.contactLink,
            }))
          : [],
      };

      // Wysyłamy odpowiedź z danymi użytkownika
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
