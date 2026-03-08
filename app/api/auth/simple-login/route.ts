import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function POST(request: Request) {
  console.log("[v0] simple-login API chamada")
  try {
    const { email, password } = await request.json()
    console.log("[v0] Email recebido:", email)

    if (!email || !password) {
      console.log("[v0] Email ou senha faltando")
      return NextResponse.json(
        { error: "Email e senha sao obrigatorios" },
        { status: 400 }
      )
    }

    // Buscar usuario
    console.log("[v0] Buscando usuario no banco...")
    const users = await sql`
      SELECT id, email, name, role, password_hash 
      FROM users 
      WHERE email = ${email} AND is_active = true 
      LIMIT 1
    `
    console.log("[v0] Usuarios encontrados:", users.length)

    if (users.length === 0) {
      console.log("[v0] Usuario nao encontrado")
      return NextResponse.json(
        { error: "Usuario nao encontrado" },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log("[v0] Usuario encontrado:", user.email, "role:", user.role)

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash)
    console.log("[v0] Senha valida:", isValid)
    if (!isValid) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      )
    }

    // Criar token JWT
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(SECRET_KEY)

    // Determinar redirect baseado no role
    let redirectTo = "/minha-conta"
    if (user.role === "admin" || user.role === "super_admin") {
      redirectTo = "/admin"
    } else if (user.role === "seller") {
      redirectTo = "/seller"
    }

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Setar cookie de sessao
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
