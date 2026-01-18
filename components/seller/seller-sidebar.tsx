"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  DollarSign,
  Target,
  User,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { name: "Minhas Vendas", href: "/seller/sales", icon: DollarSign },
  { name: "Veículos Disponíveis", href: "/seller/vehicles", icon: Car },
  { name: "Comissões", href: "/seller/commissions", icon: TrendingUp },
  { name: "Metas", href: "/seller/goals", icon: Target },
  { name: "Agendamentos", href: "/seller/appointments", icon: Calendar },
  { name: "Histórico", href: "/seller/history", icon: Clock },
  { name: "Meu Perfil", href: "/seller/profile", icon: User },
  { name: "Documentos", href: "/seller/documents", icon: FileText },
]

export function SellerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/seller" className="text-xl font-bold text-emerald-700">
          Portal do Vendedor
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/seller" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
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
