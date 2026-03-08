import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Gerar hashes corretos
    const adminHash = await bcrypt.hash("admin123", 10)
    const userHash = await bcrypt.hash("senha123", 10)

    // Atualizar admin
    await sql`
      UPDATE users SET password_hash = ${adminHash}
      WHERE email = 'admin@nacionalveiculos.com.br'
    `

    // Atualizar vendedor e cliente
    await sql`
      UPDATE users SET password_hash = ${userHash}
      WHERE email IN ('marcos.vendedor@nacionalveiculos.com.br', 'lucas.mendes@email.com')
    `

    return NextResponse.json({ 
      success: true, 
      message: "Senhas demo atualizadas com sucesso" 
    })
  } catch (error) {
    console.error("Erro ao setup demo:", error)
    return NextResponse.json({ error: "Erro ao configurar demo" }, { status: 500 })
  }
}
