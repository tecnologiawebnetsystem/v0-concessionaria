"use server"

import { cookies } from "next/headers"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = formData.get("redirectTo") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return { error: "Credenciais inválidas" }
  }

  const token = await createSession(user)
  const cookieStore = await cookies()

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  const role = user.role
  const isGenericRedirect = !redirectTo || redirectTo === "/" || redirectTo === "/login"

  const destination = isGenericRedirect
    ? role === "admin" || role === "super_admin"
      ? "/admin"
      : role === "seller"
        ? "/seller"
        : "/minha-conta"
    : redirectTo

  return { success: true, redirectTo: destination }
}
