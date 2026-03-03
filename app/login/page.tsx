import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Login - GT Veículos",
  description: "Faça login para acessar sua conta",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <img src="/images/logo-gt-veiculos.png" alt="GT Veículos" className="h-14 w-auto mx-auto" />
          </Link>
          <p className="mt-3 text-sm text-gray-400">Faça login para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
