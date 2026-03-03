import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const rows = await sql`
    SELECT
      v.id,
      v.name,
      v.year,
      v.price,
      v.mileage,
      v.slug,
      b.name AS brand,
      vv.viewed_at,
      (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) AS image
    FROM vehicle_views vv
    JOIN vehicles v ON vv.vehicle_id = v.id
    JOIN brands b ON v.brand_id = b.id
    WHERE vv.user_id = ${session.userId}
    ORDER BY vv.viewed_at DESC
    LIMIT 50
  `
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { vehicle_id } = await req.json()
  if (!vehicle_id) return NextResponse.json({ error: "vehicle_id obrigatório" }, { status: 400 })

  await sql`
    INSERT INTO vehicle_views (user_id, vehicle_id, viewed_at)
    VALUES (${session.userId}, ${vehicle_id}, NOW())
    ON CONFLICT (user_id, vehicle_id) DO UPDATE SET viewed_at = NOW()
  `
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const session = await getSession()
  if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  await sql`DELETE FROM vehicle_views WHERE user_id = ${session.userId}`
  return NextResponse.json({ ok: true })
}
