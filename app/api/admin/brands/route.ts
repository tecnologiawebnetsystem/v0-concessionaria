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

    const brands = await sql`
      SELECT * FROM brands 
      ORDER BY display_order ASC, name ASC
    `

    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar marcas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, logo_url, description, is_active, display_order } = body

    const result = await sql`
      INSERT INTO brands (name, slug, logo_url, description, is_active, display_order)
      VALUES (${name}, ${slug}, ${logo_url}, ${description}, ${is_active}, ${display_order})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar marca" }, { status: 500 })
  }
}
