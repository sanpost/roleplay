import { NextRequest, NextResponse } from "next/server";
import pool from "@/libs/mysql";


export async function GET(
    request:  NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug 
    
    try {
        const db = await pool.getConnection()        
        
        const query = 'select * from users where user_id = ?'
        const [rows] = await db.execute(query,[slug])
        db.release()
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
} 