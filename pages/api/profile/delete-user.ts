import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Start a transaction to delete related data and the user atomically
      await prisma.$transaction(async (prisma) => {
        // Delete related data in related tables
        const profile = await prisma.profile.findUnique({
          where: { user_id: user.id },
        });

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

          // Delete the profile
          await prisma.profile.delete({
            where: { user_id: user.id },
          });
        }

        // Finally, delete the user
        await prisma.user.delete({
          where: { id: user.id },
        });
      });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
