import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Criar Conta - GT Veículos",
  description: "Crie sua conta para acessar fotos exclusivas dos veículos",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-900">GT Veículos</h1>
          </Link>
          <p className="mt-2 text-sm text-blue-700">Crie sua conta para acessar conteúdo exclusivo</p>
        </div>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-blue-900 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
