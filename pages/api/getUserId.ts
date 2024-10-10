// pages/api/getUserId.ts

import { NextApiRequest, NextApiResponse } from "next";
import db from "@/libs/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    try {
      const [rows]: any = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const user_id = rows[0].user_id;
      console.log("User ID:", user_id);
      return res.status(200).json({ user_id });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
