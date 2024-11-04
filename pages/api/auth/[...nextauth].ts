import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// Inicjalizacja Prisma Client
const prisma = new PrismaClient();

// Inicjalizacja NextAuth
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
        const { email, name } = user; // Include `name` to handle username
        console.log("User details:", { email, name });

        // Sprawdzenie, czy użytkownik już istnieje
        if (!email) {
          throw new Error("Email is required");
        }

        let existingUser = await prisma.user.findUnique({
          where: { email: email },
        });

        // Zaczynamy od nazwy użytkownika z Google
        const username = name; // Zmieniamy let na const
        // let usernameExists = false; // Możesz usunąć tę zmienną, jeśli nie jest używana

        if (existingUser) {
          // Użytkownik już istnieje, aktualizujemy jego Google ID
          console.log("User exists, updating data");
          await prisma.user.update({
            where: { email: email },
            data: {
              google_id: user.id,
              // Nie aktualizujemy nazwy użytkownika, gdyż nie musi być unikalna
            },
          });
        } else {
          // Użytkownik nie istnieje, wstawiamy nowego użytkownika
          console.log("User does not exist, inserting new user");
          existingUser = await prisma.user.create({
            data: {
              google_id: user.id,
              username: username || "default_username",
              email: email,
              created_at: new Date(),
            },
          });
        }

        // Sprawdzenie profilu użytkownika
        const profile = await prisma.profile.findUnique({
          where: { user_id: existingUser.id },
        });

        if (!profile) {
          console.log("Profile not found, creating a new profile.");
          // Utwórz nowy profil, jeśli to konieczne
          await prisma.profile.create({
            data: {
              user_id: existingUser.id,
              bio: "Describe yourself", // Możesz ustawić domyślne wartości dla profilu
              // Dodaj inne domyślne wartości profilu, jeśli są potrzebne
            },
          });
          console.log("New profile created for user:", existingUser.id);
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      } finally {
        await prisma.$disconnect(); // Zamknij połączenie z bazą danych
        console.log("Database connection released");
      }
    },
  },
});
