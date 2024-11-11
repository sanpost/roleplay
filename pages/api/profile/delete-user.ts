import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Sprawdzamy, czy metoda to DELETE
  if (req.method === "DELETE") {
    const { email } = req.body;

    // Walidacja wymaganych pól
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Szukamy użytkownika po emailu
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Jeśli użytkownik nie istnieje, zwracamy błąd 404
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Rozpoczynamy transakcję, aby usunąć dane użytkownika atomowo
      await prisma.$transaction(async (prisma) => {
        // Szukamy profilu użytkownika
        const profile = await prisma.profile.findUnique({
          where: { user_id: user.id },
        });

        // Jeśli profil istnieje, usuwamy powiązane dane
        if (profile) {
          await prisma.userPreference.deleteMany({
            where: { profile_id: profile.id },
          });

          await prisma.userAgeRange.deleteMany({
            where: { profile_id: profile.id },
          });

          await prisma.userRelationship.deleteMany({
            where: { profile_id: profile.id },
          });

          await prisma.userContactMethod.deleteMany({
            where: { profile_id: profile.id },
          });

          // Usuwamy profil
          await prisma.profile.delete({
            where: { user_id: user.id },
          });
        }

        // Usuwamy użytkownika
        await prisma.user.delete({
          where: { id: user.id },
        });
      });

      // Zwracamy sukces
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  } else {
    // Zwracamy błąd, jeśli metoda HTTP nie jest obsługiwana
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
