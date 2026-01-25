"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  FileText,
  ImageIcon,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Tags,
  Bookmark,
  DollarSign,
  Receipt,
  UserCheck,
  ClipboardList,
  CalendarCheck,
  Star,
  ChevronDown,
  LogOut,
  Building2,
  Code2,
} from "lucide-react"
import { useState } from "react"

const navigationGroups = [
  {
    name: "Principal",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    name: "Estoque",
    items: [
      { name: "Veiculos", href: "/admin/vehicles", icon: Car },
      { name: "Marcas", href: "/admin/brands", icon: Tags },
      { name: "Categorias", href: "/admin/categories", icon: Bookmark },
    ]
  },
  {
    name: "Comercial",
    items: [
      { name: "Vendas", href: "/admin/sales", icon: Receipt },
      { name: "Propostas", href: "/admin/proposals", icon: ClipboardList },
      { name: "Test Drives", href: "/admin/test-drives", icon: CalendarCheck },
      { name: "Avaliacoes", href: "/admin/evaluations", icon: Star },
    ]
  },
  {
    name: "Financeiro",
    items: [
      { name: "Fluxo de Caixa", href: "/admin/finance", icon: DollarSign },
      { name: "Relatorios", href: "/admin/reports", icon: BarChart3 },
    ]
  },
  {
    name: "Equipe",
    items: [
      { name: "Vendedores", href: "/admin/sellers", icon: UserCheck },
      { name: "Usuarios", href: "/admin/users", icon: Users },
    ]
  },
  {
    name: "Marketing",
    items: [
      { name: "Blog", href: "/admin/blog", icon: FileText },
      { name: "Banners", href: "/admin/banners", icon: ImageIcon },
      { name: "Contatos", href: "/admin/inquiries", icon: MessageSquare },
    ]
  },
  {
    name: "Sistema",
    items: [
      { name: "Configuracoes", href: "/admin/settings", icon: Settings },
      { name: "API Docs", href: "/api-docs", icon: Code2 },
    ]
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 lg:flex">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-700/50 px-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30">
          <Building2 className="size-6 text-white" />
        </div>
        <div>
          <Link href="/admin" className="text-lg font-bold text-white">
            Nacional Veiculos
          </Link>
          <p className="text-xs text-slate-400">Painel Administrativo</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {navigationGroups.map((group) => {
            const isCollapsed = collapsedGroups.includes(group.name)
            
            return (
              <div key={group.name}>
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="mb-2 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-300"
                >
                  {group.name}
                  <ChevronDown className={cn(
                    "size-4 transition-transform",
                    isCollapsed && "-rotate-90"
                  )} />
                </button>
                
                {!isCollapsed && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || 
                        (item.href !== "/admin" && pathname.startsWith(item.href))
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive 
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30" 
                              : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                          )}
                        >
                          <item.icon className={cn(
                            "size-5",
                            isActive ? "text-white" : "text-slate-400"
                          )} />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white"
        >
          <LogOut className="size-5 text-slate-400" />
          Voltar ao Site
        </Link>
      </div>
    </aside>
  )
}
