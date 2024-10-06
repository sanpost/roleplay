import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/app/libs/mysql";

// Initialize NextAuth
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
            const db = await pool.getConnection();
            try {
                const { email, name } = user;
                console.log("User details:", { email, name });

                const [rows]: [any[], any] = await db.execute(
                    "SELECT * FROM users WHERE email = ?",
                    [email]
                );
                console.log("Database query result:", rows);

                if (rows.length > 0) {
                    // Użytkownik już istnieje, aktualizujemy dane
                    console.log("User exists, updating data");
                    await db.execute("UPDATE users SET google_id = ? WHERE email = ?", [
                        user.id,
                        email,
                    ]);
                } else {
                    // Użytkownik nie istnieje, dodajemy nowego
                    console.log("User does not exist, inserting new user");
                    await db.execute(
                        "INSERT INTO users (google_id, username, email, created_at) VALUES (?, ?, ?, ?)",
                        [user.id, name, email, new Date()]
                    );
                }
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            } finally {
                db.release();
                console.log("Database connection released");
            }
        },
    },
});
