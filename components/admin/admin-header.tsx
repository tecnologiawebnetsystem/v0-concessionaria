"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  LogOut, 
  User, 
  ExternalLink, 
  Bell, 
  Search,
  Menu,
  Settings,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { SessionData } from "@/lib/session"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AdminHeader({ session }: { session: SessionData }) {
  const router = useRouter()
  const [notifications] = useState(3)

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Logout realizado com sucesso!")
      window.location.href = "/login"
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-4 backdrop-blur-md lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700">
                <span className="text-lg font-bold text-white">NV</span>
              </div>
              <div>
                <p className="font-bold text-white">GT Veículos</p>
                <p className="text-xs text-slate-400">Painel Admin</p>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {[
                  { name: "Dashboard", href: "/admin" },
                  { name: "Veiculos", href: "/admin/vehicles" },
                  { name: "Vendas", href: "/admin/sales" },
                  { name: "Financeiro", href: "/admin/finance" },
                  { name: "Vendedores", href: "/admin/sellers" },
                  { name: "Propostas", href: "/admin/proposals" },
                  { name: "Test Drives", href: "/admin/test-drives" },
                  { name: "Avaliacoes", href: "/admin/evaluations" },
                  { name: "Blog", href: "/admin/blog" },
                  { name: "Usuarios", href: "/admin/users" },
                  { name: "Contatos", href: "/admin/inquiries" },
                  { name: "Configuracoes", href: "/admin/settings" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Bar */}
      <div className="hidden flex-1 items-center gap-4 lg:flex">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Buscar veiculos, clientes, vendas..."
            className="h-10 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-800">
              <Bell className="size-5 text-slate-400" />
              {notifications > 0 && (
                <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full bg-red-500 p-0 text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notificacoes
              <Badge variant="secondary">{notifications} novas</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Nova proposta recebida</p>
                <p className="text-xs text-slate-500">Honda Civic 2023 - R$ 125.000</p>
                <p className="text-xs text-slate-400">Ha 5 minutos</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Test drive agendado</p>
                <p className="text-xs text-slate-500">Toyota Corolla - Amanha 14h</p>
                <p className="text-xs text-slate-400">Ha 1 hora</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Venda finalizada</p>
                <p className="text-xs text-slate-500">Jeep Compass - R$ 185.000</p>
                <p className="text-xs text-slate-400">Ha 3 horas</p>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-blue-600">
              Ver todas as notificacoes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Links */}
        <Button variant="ghost" size="icon" asChild className="hidden md:flex hover:bg-slate-800">
          <Link href="/" target="_blank">
            <ExternalLink className="size-5 text-slate-400" />
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-3 rounded-full pl-2 pr-4 hover:bg-slate-800">
              <Avatar className="size-8 border-2 border-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-white">{session.name}</p>
                <p className="text-xs text-slate-400">
                  {session.role === "super_admin" ? "Super Admin" : "Administrador"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session.name}</p>
                <p className="text-xs text-slate-500">{session.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 size-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 size-4" />
              Ajuda e Suporte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 size-4" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
