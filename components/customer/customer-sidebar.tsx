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
} from "lucide-react"

const navigation = [
  { name: "Meu Painel", href: "/minha-conta", icon: LayoutDashboard },
  { name: "Favoritos", href: "/minha-conta/favoritos", icon: Heart },
  { name: "Minhas Propostas", href: "/minha-conta/propostas", icon: FileText },
  { name: "Test Drives", href: "/minha-conta/test-drives", icon: Car },
  { name: "Avaliações", href: "/minha-conta/avaliacoes", icon: ClipboardList },
  { name: "Alertas", href: "/minha-conta/alertas", icon: Bell },
  { name: "Histórico", href: "/minha-conta/historico", icon: History },
  { name: "Meu Perfil", href: "/minha-conta/perfil", icon: User },
]

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 pt-16">
      <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Bem-vindo de volta!</p>
            <p className="font-semibold">Área do Cliente</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 mt-auto">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Link>
        </div>
      </div>
    </aside>
  )
}
