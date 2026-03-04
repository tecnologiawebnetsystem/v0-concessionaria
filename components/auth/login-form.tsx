"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronDown, ChevronUp, Shield, Briefcase, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { loginAction } from "@/app/actions/auth"
import { useState, useRef } from "react"

const DEMO_USERS = [
  {
    role: "Administrador",
    icon: Shield,
    color: "text-red-600 bg-red-50 border-red-200",
    iconColor: "text-red-600",
    email: "admin@nacionalveiculos.com.br",
    password: "admin123",
  },
  {
    role: "Vendedor",
    icon: Briefcase,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    email: "marcos.vendedor@nacionalveiculos.com.br",
    password: "senha123",
  },
  {
    role: "Cliente",
    icon: User,
    color: "text-green-600 bg-green-50 border-green-200",
    iconColor: "text-green-600",
    email: "lucas.mendes@email.com",
    password: "senha123",
  },
]

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [showDemo, setShowDemo] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  function fillDemo(demoEmail: string, demoPassword: string) {
    if (emailRef.current) emailRef.current.value = demoEmail
    if (passwordRef.current) passwordRef.current.value = demoPassword
    setShowDemo(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              disabled={isPending}
              defaultValue=""
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              defaultValue=""
            />
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/registro" className="font-medium text-red-600 hover:underline">
            Criar conta gratuita
          </Link>
        </div>

        {/* Credenciais de demonstração */}
        <div className="mt-6 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="flex w-full items-center justify-between text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="font-medium">Acessar como demonstração</span>
            {showDemo ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>

          {showDemo && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-400 mb-2">Clique em um perfil para preencher automaticamente</p>
              {DEMO_USERS.map((demo) => {
                const Icon = demo.icon
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => fillDemo(demo.email, demo.password)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all hover:opacity-80 ${demo.color}`}
                  >
                    <Icon className={`size-4 mt-0.5 shrink-0 ${demo.iconColor}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{demo.role}</p>
                      <p className="text-xs truncate opacity-70">{demo.email}</p>
                      <p className="text-xs opacity-70">
                        Senha: <span className="font-mono">{demo.password}</span>
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
