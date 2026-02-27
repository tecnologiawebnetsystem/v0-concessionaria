"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Heart,
  FileText,
  Car,
  ClipboardList,
  User,
  Bell,
  History,
  LogOut,
  Sparkles,
  Shield,
} from "lucide-react"

const navigation = [
  { name: "Meu Painel", href: "/minha-conta", icon: LayoutDashboard },
  { name: "Favoritos", href: "/minha-conta/favoritos", icon: Heart },
  { name: "Minhas Propostas", href: "/minha-conta/propostas", icon: FileText },
  { name: "Test Drives", href: "/minha-conta/test-drives", icon: Car },
  { name: "Avaliacoes", href: "/minha-conta/avaliacoes", icon: ClipboardList },
  { name: "Alertas", href: "/minha-conta/alertas", icon: Bell },
  { name: "Historico", href: "/minha-conta/historico", icon: History },
  { name: "Meu Perfil", href: "/minha-conta/perfil", icon: User },
]

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-700/50">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
          <Car className="size-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white">GT Veículos</h1>
          <p className="text-[10px] text-slate-400">Area do Cliente</p>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Bem-vindo!</span>
          </div>
          <p className="text-xs text-slate-400">Acompanhe suas propostas, test drives e muito mais.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Premium Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="size-5 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Cliente Premium</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Ganhe beneficios exclusivos em suas compras.</p>
          <Link
            href="/minha-conta/premium"
            className="inline-flex items-center text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="size-5" />
          Sair da Conta
        </Link>
      </div>
    </aside>
  )
}
