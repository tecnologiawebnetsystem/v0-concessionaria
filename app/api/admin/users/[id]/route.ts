import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, role, is_active, password } = body

    let passwordHash: string | null = null
    if (password) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    const [user] = await sql`
      UPDATE users SET
        name = COALESCE(${name ?? null}, name),
        email = COALESCE(${email ?? null}, email),
        phone = COALESCE(${phone ?? null}, phone),
        role = COALESCE(${role ?? null}, role),
        is_active = COALESCE(${is_active ?? null}, is_active),
        password_hash = CASE WHEN ${passwordHash} IS NOT NULL THEN ${passwordHash} ELSE password_hash END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, email, phone, role, is_active, created_at
    `

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await sql`DELETE FROM users WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 })
  }
}
