import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, vehicle_id, type } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    await sql`
      INSERT INTO inquiries (name, email, phone, message, vehicle_id, type, status)
      VALUES (${name}, ${email}, ${phone || null}, ${message}, ${vehicle_id || null}, ${type || "general"}, 'new')
    `

    // Increment inquiries count for vehicle
    if (vehicle_id) {
      await sql`UPDATE vehicles SET inquiries_count = inquiries_count + 1 WHERE id = ${vehicle_id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Create inquiry error:", error)
    return NextResponse.json({ error: "Erro ao enviar contato" }, { status: 500 })
  }
}
