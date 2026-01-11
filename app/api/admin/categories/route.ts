import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const categories = await sql`
      SELECT 
        id,
        name,
        slug,
        description,
        icon,
        display_order,
        is_active,
        created_at
      FROM vehicle_categories
      ORDER BY display_order ASC, name ASC
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)

    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug, description, icon, display_order, is_active } = body

    const [category] = await sql`
      INSERT INTO vehicle_categories (
        name, slug, description, icon, display_order, is_active
      ) VALUES (
        ${name}, ${slug}, ${description}, ${icon || null}, 
        ${display_order || 0}, ${is_active !== false}
      )
      RETURNING *
    `

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
