"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
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
  Menu,
  LogOut,
  Home,
  Award,
  Zap,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/seller", icon: LayoutDashboard, color: "text-emerald-400" },
  { name: "Minhas Vendas", href: "/seller/sales", icon: DollarSign, color: "text-blue-400" },
  { name: "Veiculos", href: "/seller/vehicles", icon: Car, color: "text-cyan-400" },
  { name: "Comissoes", href: "/seller/commissions", icon: TrendingUp, color: "text-amber-400" },
  { name: "Metas", href: "/seller/goals", icon: Target, color: "text-violet-400" },
  { name: "Agendamentos", href: "/seller/appointments", icon: Calendar, color: "text-pink-400" },
  { name: "Historico", href: "/seller/history", icon: Clock, color: "text-slate-400" },
  { name: "Meu Perfil", href: "/seller/profile", icon: User, color: "text-teal-400" },
  { name: "Documentos", href: "/seller/documents", icon: FileText, color: "text-orange-400" },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/seller" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Portal Vendedor</h1>
            <p className="text-xs text-slate-500">GT Veículos</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/seller" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-400" : item.color)} />
              <span>{item.name}</span>
              {item.name === "Comissoes" && (
                <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                  3
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50">
            <Home className="h-5 w-5 mr-3" />
            Voltar ao Site
          </Button>
        </Link>
        <form action="/api/auth/logout" method="POST">
          <Button 
            type="submit"
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </form>
      </div>

      {/* Achievement Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Meta do Mes</p>
              <p className="text-xs text-slate-400">75% concluido</p>
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SellerSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 text-white hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
