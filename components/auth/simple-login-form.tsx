"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, Briefcase, User, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

const DEMO_USERS = [
  {
    role: "Administrador",
    icon: Shield,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    email: "admin@nacionalveiculos.com.br",
    password: "admin123",
    redirect: "/admin",
  },
  {
    role: "Vendedor",
    icon: Briefcase,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    email: "marcos.vendedor@nacionalveiculos.com.br",
    password: "senha123",
    redirect: "/seller",
  },
  {
    role: "Cliente",
    icon: User,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    email: "lucas.mendes@email.com",
    password: "senha123",
    redirect: "/minha-conta",
  },
]

export function SimpleLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login")
        setLoading(false)
        return
      }

      setSuccess(true)
      
      // Redirect apos 500ms para garantir cookie foi setado
      setTimeout(() => {
        window.location.href = data.redirectTo
      }, 500)
    } catch {
      setError("Erro de conexao. Tente novamente.")
      setLoading(false)
    }
  }

  async function handleQuickLogin(demoUser: typeof DEMO_USERS[0]) {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: demoUser.email, 
          password: demoUser.password 
        }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login")
        setLoading(false)
        return
      }

      setSuccess(true)
      
      // Redirect direto
      setTimeout(() => {
        window.location.href = data.redirectTo
      }, 500)
    } catch {
      setError("Erro de conexao. Tente novamente.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="size-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-700">Login realizado!</h2>
            <p className="text-muted-foreground mt-2">Redirecionando...</p>
            <Loader2 className="size-6 animate-spin mt-4 text-green-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Escolha um perfil ou entre com suas credenciais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Login rapido por perfil */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Acesso rapido:</p>
          <div className="grid gap-2">
            {DEMO_USERS.map((demo) => {
              const Icon = demo.icon
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  disabled={loading}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${demo.color} disabled:opacity-50`}
                >
                  <Icon className="size-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{demo.role}</p>
                    <p className="text-xs text-muted-foreground truncate">{demo.email}</p>
                  </div>
                  {loading && email === demo.email && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Formulario manual */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Nao tem conta?{" "}
          <Link href="/registro" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
