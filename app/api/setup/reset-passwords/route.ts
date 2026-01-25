import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Gerar hash para admin123
    const adminHash = await bcrypt.hash("admin123", 10)
    
    // Gerar hash para cliente123
    const clienteHash = await bcrypt.hash("cliente123", 10)
    
    // Atualizar senha do admin
    await sql`
      UPDATE users 
      SET password_hash = ${adminHash}
      WHERE role = 'admin'
    `
    
    // Atualizar senha dos clientes
    await sql`
      UPDATE users 
      SET password_hash = ${clienteHash}
      WHERE role = 'user'
    `
    
    return NextResponse.json({ 
      success: true, 
      message: "Senhas atualizadas com sucesso!",
      adminPassword: "admin123",
      clientePassword: "cliente123"
    })
  } catch (error) {
    console.error("Erro ao resetar senhas:", error)
    return NextResponse.json({ error: "Erro ao resetar senhas" }, { status: 500 })
  }
}
