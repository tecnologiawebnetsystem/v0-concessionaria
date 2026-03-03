import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId || session.role !== "admin") {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const { name, email, phone, cpf, commission_rate } = await request.json()
    if (!name || !email || !cpf) {
      return NextResponse.json({ error: "Campos obrigatorios faltando" }, { status: 400 })
    }

    const tempPassword = await bcrypt.hash("Trocar@123", 10)

    const [user] = await sql`
      INSERT INTO users (name, email, phone, role, password_hash, is_active)
      VALUES (${name}, ${email}, ${phone}, 'seller', ${tempPassword}, true)
      RETURNING id
    `

    await sql`
      INSERT INTO sellers (user_id, cpf, commission_rate, base_salary, hire_date, is_active)
      VALUES (${user.id}, ${cpf}, ${commission_rate || 2.0}, 3500.00, NOW(), true)
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao criar vendedor:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
