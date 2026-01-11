import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyAuth } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const banners = await sql`
      SELECT * FROM banners 
      ORDER BY display_order ASC, created_at DESC
    `

    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 })
  }
}
