import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Gerar hash real com bcrypt para admin123
    const adminHash = await bcrypt.hash("admin123", 10)
    console.log("[v0] Admin hash generated:", adminHash)
    
    // Gerar hash real com bcrypt para cliente123
    const clientHash = await bcrypt.hash("cliente123", 10)
    console.log("[v0] Client hash generated:", clientHash)
    
    // Atualizar todos os admins (incluindo super_admin)
    const adminResult = await sql`
      UPDATE users 
      SET password_hash = ${adminHash}
      WHERE role IN ('admin', 'super_admin')
      RETURNING email, role
    `
    
    // Atualizar todos os clientes
    const clientResult = await sql`
      UPDATE users 
      SET password_hash = ${clientHash}
      WHERE role = 'user'
      RETURNING email, role
    `
    
    // Verificar se o hash funciona
    const testVerify = await bcrypt.compare("admin123", adminHash)
    console.log("[v0] Hash verification test:", testVerify)
    
    return NextResponse.json({
      success: true,
      message: "Senhas atualizadas com sucesso!",
      adminsUpdated: adminResult.length,
      clientsUpdated: clientResult.length,
      adminEmails: adminResult.map((u: any) => u.email),
      hashVerificationTest: testVerify
    })
  } catch (error) {
    console.error("[v0] Error fixing passwords:", error)
    return NextResponse.json({ 
      error: "Erro ao atualizar senhas", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
