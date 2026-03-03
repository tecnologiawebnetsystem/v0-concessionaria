import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const result = await sql`
      SELECT id, name, email, phone, avatar_url, created_at
      FROM users WHERE id = ${session.userId} LIMIT 1
    `
    if (!result[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const body = await request.json()
    const { action, name, phone } = body

    if (action === "update_password") {
      const { currentPassword, newPassword } = body
      if (!currentPassword || !newPassword)
        return NextResponse.json({ error: "Senhas obrigatórias" }, { status: 400 })
      if (newPassword.length < 6)
        return NextResponse.json({ error: "A nova senha deve ter pelo menos 6 caracteres" }, { status: 400 })

      const userResult = await sql`SELECT password_hash FROM users WHERE id = ${session.userId} LIMIT 1`
      if (!userResult[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

      const valid = await bcrypt.compare(currentPassword, userResult[0].password_hash)
      if (!valid) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })

      const newHash = await bcrypt.hash(newPassword, 10)
      await sql`UPDATE users SET password_hash = ${newHash}, updated_at = NOW() WHERE id = ${session.userId}`
      return NextResponse.json({ success: true, message: "Senha alterada com sucesso" })
    }

    // Update profile fields
    if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })

    await sql`
      UPDATE users SET
        name = ${name},
        phone = ${phone || null},
        updated_at = NOW()
      WHERE id = ${session.userId}
    `
    return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
