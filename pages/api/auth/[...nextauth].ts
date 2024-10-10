import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/libs/mysql";

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
                const { email, name } = user;  // Include `name` to handle username
                console.log("User details:", { email, name });

                const [rows]: [any[], any] = await db.execute(
                    "SELECT * FROM users WHERE email = ?",
                    [email]
                );
                console.log("Database query result:", rows);

                let username = name; // Start with the user's Google name
                let usernameExists = true;
                let attempt = 1;

                // Check for username uniqueness
                while (usernameExists) {
                    const [usernameCheck]: [any[], any] = await db.execute(
                        "SELECT * FROM users WHERE username = ?",
                        [username]
                    );

                    if (usernameCheck.length === 0) {
                        usernameExists = false;  // Found a unique username
                    } else {
                        // Username already exists, modify it
                        username = `${name}_${attempt}`;
                        attempt++;
                    }
                }

                if (rows.length > 0) {
                    // User already exists, update their Google ID
                    console.log("User exists, updating data");
                    await db.execute("UPDATE users SET google_id = ?, username = ? WHERE email = ?", [
                        user.id,
                        username,
                        email,
                    ]);
                } else {
                    // User does not exist, insert new user
                    console.log("User does not exist, inserting new user");
                    await db.execute(
                        "INSERT INTO users (google_id, username, email, created_at) VALUES (?, ?, ?, ?)",
                        [user.id, username, email, new Date()]
                    );
                }

                const [profiles]: [any[], any] = await db.execute(
                    "SELECT * FROM profiles WHERE user_id = ?",
                    [user.id]
                );

                if (profiles.length > 0) {
                    
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
