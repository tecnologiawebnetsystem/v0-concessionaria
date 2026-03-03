import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const user = await sql`SELECT email, name, phone FROM users WHERE id = ${session.userId} LIMIT 1`
    if (!user[0]) return NextResponse.json({ alerts: [] })

    const alerts = await sql`
      SELECT * FROM vehicle_alerts
      WHERE customer_email = ${user[0].email}
      ORDER BY created_at DESC
    `
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Erro ao buscar alertas:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const user = await sql`SELECT email, name, phone FROM users WHERE id = ${session.userId} LIMIT 1`
    if (!user[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    const body = await request.json()
    const { brand, model, minPrice, maxPrice, minYear, maxYear, category, fuelType, transmission } = body

    if (!brand) return NextResponse.json({ error: "Marca é obrigatória" }, { status: 400 })

    const result = await sql`
      INSERT INTO vehicle_alerts (
        customer_email, customer_name, customer_phone,
        brand, model, category, min_year, max_year,
        min_price, max_price, fuel_type, transmission,
        is_active, created_at
      ) VALUES (
        ${user[0].email}, ${user[0].name}, ${user[0].phone},
        ${brand}, ${model || null}, ${category || null},
        ${minYear ? Number(minYear) : null}, ${maxYear ? Number(maxYear) : null},
        ${minPrice ? Number(minPrice) : null}, ${maxPrice ? Number(maxPrice) : null},
        ${fuelType || null}, ${transmission || null},
        true, NOW()
      )
      RETURNING *
    `
    return NextResponse.json({ alert: result[0] })
  } catch (error) {
    console.error("Erro ao criar alerta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const user = await sql`SELECT email FROM users WHERE id = ${session.userId} LIMIT 1`
    if (!user[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    const { alertId } = await request.json()
    if (!alertId) return NextResponse.json({ error: "alertId obrigatório" }, { status: 400 })

    await sql`
      DELETE FROM vehicle_alerts
      WHERE id = ${alertId} AND customer_email = ${user[0].email}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover alerta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
