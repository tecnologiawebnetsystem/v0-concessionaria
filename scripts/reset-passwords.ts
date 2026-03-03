import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function resetPasswords() {
  const adminHash = await bcrypt.hash("admin123", 10)
  const senha123Hash = await bcrypt.hash("senha123", 10)

  console.log("[v0] adminHash:", adminHash)
  console.log("[v0] senha123Hash:", senha123Hash)

  await sql`UPDATE users SET password_hash = ${adminHash} WHERE role IN ('admin', 'super_admin')`
  console.log("[v0] Admin password updated to admin123")

  await sql`UPDATE users SET password_hash = ${senha123Hash} WHERE role IN ('seller', 'user')`
  console.log("[v0] Seller/user passwords updated to senha123")

  const users = await sql`SELECT email, role, is_active FROM users ORDER BY role`
  console.log("[v0] Users in DB:", JSON.stringify(users, null, 2))
}

resetPasswords().catch(console.error)
