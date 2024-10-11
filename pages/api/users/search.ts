import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { preferences, relationships, ageRanges } = req.body;

    try {
      // Budowanie dynamicznej tablicy warunków
      const conditions = [];

      // Dodaj warunek dla preferencji, jeśli są wybrane
      if (preferences && preferences.length > 0) {
        conditions.push({ preferences: { in: preferences } });
      }

      // Dodaj warunek dla relacji, jeśli jest wybrana
      if (relationships && relationships.length > 0) {
        conditions.push({ relationship: { in: relationships } });
      }

      // Dodaj warunek dla zakresu wieku, jeśli jest wybrany
      if (ageRanges && ageRanges.length > 0) {
        conditions.push({ age_range: { in: ageRanges } });
      }

      // Użyj `AND` zbudowanej tablicy warunków, jeśli są jakieś warunki do zastosowania
      const users = await prisma.profile.findMany({
        where: conditions.length > 0 ? { AND: conditions } : {}, // Jeżeli nie ma warunków, zwróć pusty obiekt
        include: {
          user: true, // Łączenie z tabelą User, by mieć dostęp do nazw użytkowników
        },
      });

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
