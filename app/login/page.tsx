import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login - GT Veículos",
  description: "Faça login para acessar sua conta",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-900">GT Veículos</h1>
          </Link>
          <p className="mt-2 text-sm text-blue-700">Faça login para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
