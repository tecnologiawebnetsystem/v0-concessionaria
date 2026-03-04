"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export type LoginState = {
  error?: string
} | null

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = formData.get("redirectTo") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  const user = await authenticateUser(email, password)
  console.log("[v0] loginAction - auth result:", user ? `OK role=${user.role}` : "FALHOU")

  if (!user) {
    return { error: "Email ou senha incorretos" }
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

  console.log("[v0] loginAction - cookie setado, redirecionando para:", destination)
  redirect(destination)
}
