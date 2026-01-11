import bcrypt from "bcryptjs"
import { sql } from "./db"
import type { User } from "./db"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "user" | "admin" = "user",
): Promise<User> {
  const passwordHash = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (${email}, ${passwordHash}, ${name}, ${role})
    RETURNING *
  `

  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1
  `

  return result[0] ? (result[0] as User) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id} AND is_active = true LIMIT 1
  `

  return result[0] ? (result[0] as User) : null
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1
  `

  if (!result[0]) return null

  const user = result[0] as User & { password_hash: string }
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) return null

  // Remove password_hash from returned user
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export async function verifyAuth(request: NextRequest): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value || request.cookies.get("auth_token")?.value

    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")
    const { payload } = await jwtVerify(token, secret)

    if (!payload.userId || typeof payload.userId !== "string") return null

    const user = await getUserById(payload.userId)
    return user
  } catch (error) {
    return null
  }
}
