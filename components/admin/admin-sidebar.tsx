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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Veículos", href: "/admin/vehicles", icon: Car },
  { name: "Vendas", href: "/admin/sales", icon: Receipt },
  { name: "Financeiro", href: "/admin/finance", icon: DollarSign },
  { name: "Vendedores", href: "/admin/sellers", icon: UserCheck },
  { name: "Propostas", href: "/admin/proposals", icon: ClipboardList },
  { name: "Test Drives", href: "/admin/test-drives", icon: CalendarCheck },
  { name: "Avaliações", href: "/admin/evaluations", icon: Star },
  { name: "Marcas", href: "/admin/brands", icon: Tags },
  { name: "Categorias", href: "/admin/categories", icon: Bookmark },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Contatos", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Relatórios", href: "/admin/reports", icon: BarChart3 },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/admin" className="text-xl font-bold text-blue-900">
          Nacional Veículos
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
