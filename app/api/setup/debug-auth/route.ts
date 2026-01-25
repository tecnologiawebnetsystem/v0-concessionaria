import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // 1. Gerar hashes REAIS para as senhas
    const adminPassword = "admin123"
    const clientePassword = "cliente123"
    
    const adminHash = await bcrypt.hash(adminPassword, 10)
    const clienteHash = await bcrypt.hash(clientePassword, 10)
    
    // 2. Atualizar no banco
    const adminResult = await sql`
      UPDATE users 
      SET password_hash = ${adminHash}
      WHERE role IN ('admin', 'super_admin')
      RETURNING email, role
    `
    
    const clienteResult = await sql`
      UPDATE users 
      SET password_hash = ${clienteHash}
      WHERE role = 'user'
      RETURNING email, role
    `
    
    // 3. Verificar se funciona
    const testUser = await sql`
      SELECT email, password_hash FROM users WHERE email = 'admin@nacionalveiculos.com.br' LIMIT 1
    `
    
    let testResult = false
    if (testUser[0]) {
      testResult = await bcrypt.compare(adminPassword, testUser[0].password_hash as string)
    }
    
    return NextResponse.json({
      success: true,
      message: "Senhas atualizadas com sucesso!",
      adminsAtualizados: adminResult.length,
      clientesAtualizados: clienteResult.length,
      testeLogin: testResult ? "PASSOU - bcrypt.compare funcionou!" : "FALHOU",
      hashGerado: adminHash.substring(0, 30) + "...",
      instrucoes: {
        admin: "admin@nacionalveiculos.com.br / admin123",
        cliente: "carlos.silva@email.com / cliente123"
      }
    })
  } catch (error) {
    console.error("[v0] Debug auth error:", error)
    return NextResponse.json({ 
      error: "Erro ao atualizar senhas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 })
  }
}
