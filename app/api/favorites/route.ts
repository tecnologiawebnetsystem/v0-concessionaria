import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const favorites = await sql`
      SELECT 
        f.id as favorite_id,
        f.created_at as favorited_at,
        v.id,
        v.name,
        v.slug,
        v.price,
        v.year,
        v.mileage,
        v.fuel_type,
        v.transmission,
        b.name as brand_name,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as main_image
      FROM favorites f
      JOIN vehicles v ON f.vehicle_id = v.id
      JOIN brands b ON v.brand_id = b.id
      WHERE f.user_id = ${session.userId}
      ORDER BY f.created_at DESC
    `

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { vehicleId } = await request.json()
    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId obrigatório" }, { status: 400 })
    }

    await sql`
      INSERT INTO favorites (user_id, vehicle_id)
      VALUES (${session.userId}, ${vehicleId})
      ON CONFLICT (user_id, vehicle_id) DO NOTHING
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { vehicleId } = await request.json()
    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId obrigatório" }, { status: 400 })
    }

    await sql`
      DELETE FROM favorites
      WHERE user_id = ${session.userId} AND vehicle_id = ${vehicleId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
