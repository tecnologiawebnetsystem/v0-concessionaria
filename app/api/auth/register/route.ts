import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { setSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Check if email already exists
    const { sql } = await import("@/lib/db")
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    const user = await createUser(email, password, name, "user")

    // Update phone if provided
    if (phone) {
      await sql`UPDATE users SET phone = ${phone} WHERE id = ${user.id}`
    }

    // Set session
    await setSession(user)

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 })
  }
}
