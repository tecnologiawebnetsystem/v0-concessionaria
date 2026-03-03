import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const { status, notes } = await req.json()

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const [updated] = await sql`
      UPDATE test_drives SET
        status    = COALESCE(${status ?? null}, status),
        notes     = COALESCE(${notes ?? null}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ testDrive: updated })
  } catch (error) {
    console.error("[test-drives/[id]] PATCH Error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const [row] = await sql`
      SELECT td.*, v.name as vehicle_name, v.year as vehicle_year, b.name as brand_name
      FROM test_drives td
      LEFT JOIN vehicles v ON td.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE td.id = ${id}
    `
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ testDrive: row })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
