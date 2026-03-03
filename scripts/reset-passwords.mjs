// Script para gerar hash bcrypt correto e atualizar no banco
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function resetPasswords() {
  const adminHash = await bcrypt.hash("admin123", 10)
  const senha123Hash = await bcrypt.hash("senha123", 10)

  console.log("[v0] adminHash:", adminHash)
  console.log("[v0] senha123Hash:", senha123Hash)

  // Atualizar admin
  await sql`UPDATE users SET password_hash = ${adminHash} WHERE role IN ('admin', 'super_admin')`
  console.log("[v0] Admin password updated")

  // Atualizar sellers e clientes
  await sql`UPDATE users SET password_hash = ${senha123Hash} WHERE role IN ('seller', 'user')`
  console.log("[v0] Seller/user passwords updated")

  // Verificar
  const users = await sql`SELECT email, role FROM users ORDER BY role`
  console.log("[v0] Users in DB:", users)
}

resetPasswords().catch(console.error)
