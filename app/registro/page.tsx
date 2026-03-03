import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Criar Conta - GT Veículos",
  description: "Crie sua conta para acessar fotos exclusivas dos veículos",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <img src="/images/logo-gt-veiculos.png" alt="GT Veículos" className="h-14 w-auto mx-auto" />
          </Link>
          <p className="mt-3 text-sm text-gray-400">Crie sua conta para acessar conteúdo exclusivo</p>
        </div>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-red-500 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
