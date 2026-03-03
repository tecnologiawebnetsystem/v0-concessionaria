import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const { name, email, phone, role, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [user] = await sql`
      INSERT INTO users (name, email, phone, role, password_hash, is_active)
      VALUES (${name}, ${email}, ${phone || null}, ${role || 'user'}, ${passwordHash}, true)
      RETURNING id, name, email, phone, role, is_active, created_at
    `

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
