import { sql } from "@/lib/db"
import { UsersClient } from "./users-client"

async function getUsers() {
  const users = await sql`
    SELECT id, name, email, phone, role, is_active, created_at
    FROM users
    ORDER BY created_at DESC
  `
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active,
      COUNT(*) FILTER (WHERE role IN ('admin','super_admin')) as admins,
      COUNT(*) FILTER (WHERE role = 'seller') as sellers,
      COUNT(*) FILTER (WHERE role = 'user') as customers
    FROM users
  `
  return { users, stats }
}

export default async function UsersPage() {
  const { users, stats } = await getUsers()
  return <UsersClient initialUsers={users} stats={stats} />
}
