import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    const db = await pool.getConnection();

    // const identification = `
    // SELECT user_id FROM users WHERE email = ?;
    // `
    // const [id] = await db.execute(identification, [slug]);

    // Pobierz wszystkie informacje o profilu użytkownika, w tym powiązane dane z tabel: age_range, relationships, gender
    const query = `
            SELECT p.profile_id, p.user_id, p.bio, p.age, p.avatar, p.gender, age_range, relationships, preferences
            FROM profiles p
            WHERE p.user_id = ?;
        `;

    const [rows] = await db.execute(query, [slug]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
