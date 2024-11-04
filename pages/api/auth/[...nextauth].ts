import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("signIn callback triggered");

      try {
        const { email, name, id: googleId } = user;
        if (!email) {
          throw new Error("Email is required");
        }

        // Check if a user exists by email
        let existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        if (existingUser) {
          console.log("User exists, updating Google ID if necessary.");
          // Update google_id if it’s missing or has changed
          if (existingUser.google_id !== googleId) {
            await prisma.user.update({
              where: { email: email },
              data: { google_id: googleId },
            });
          }
        } else {
          console.log("User does not exist, creating a new user.");
          existingUser = await prisma.user.create({
            data: {
              google_id: googleId,
              username: name || "default_username",
              email: email,
              created_at: new Date(),
            },
          });
        }

        // Profile handling
        const profile = await prisma.profile.findUnique({
          where: { user_id: existingUser.id },
        });

        if (!profile) {
          console.log("Profile not found, creating a new profile.");
          await prisma.profile.create({
            data: {
              user_id: existingUser.id,
              bio: "Describe yourself",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      } finally {
        await prisma.$disconnect();
        console.log("Database connection released");
      }
    },
  },
});
