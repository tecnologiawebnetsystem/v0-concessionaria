"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Bell, ExternalLink, Search, TrendingUp, DollarSign, Settings, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { SessionData } from "@/lib/session"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SellerHeaderProps {
  session: SessionData
  sellerData?: {
    pendingCommissions: number
    monthSales: number
  }
}

export function SellerHeader({ session, sellerData }: SellerHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Logout realizado com sucesso!")
      router.push("/login")
      router.refresh()
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
      {/* Left Section */}
      <div className="flex items-center gap-4 lg:ml-0 ml-12">
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-white">Painel do Vendedor</h2>
          <p className="text-xs text-slate-500">Bem-vindo(a), {session.name.split(" ")[0]}</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden lg:flex flex-1 items-center justify-center max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Buscar veiculos, clientes..." 
            className="h-10 bg-slate-800/50 border-slate-700 text-white pl-10 rounded-xl placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Stats Cards */}
        {sellerData && (
          <div className="hidden xl:flex items-center gap-4 mr-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Vendas do Mes</p>
                <p className="text-sm font-bold text-white">{sellerData.monthSales}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Comissoes</p>
                <p className="text-sm font-bold text-amber-400">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(sellerData.pendingCommissions)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-800">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
            <DropdownMenuLabel className="text-white">Notificacoes</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
              {[
                { title: "Nova meta definida", desc: "Sua meta de setembro foi atualizada", time: "2h" },
                { title: "Comissao aprovada", desc: "R$ 2.500 liberado para pagamento", time: "5h" },
                { title: "Novo agendamento", desc: "Test drive marcado para amanha", time: "1d" },
              ].map((notif, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 cursor-pointer transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-white">{notif.title}</p>
                    <span className="text-xs text-slate-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{notif.desc}</p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* External Link */}
        <Button variant="ghost" size="icon" asChild className="hidden md:flex hover:bg-slate-800">
          <Link href="/" target="_blank">
            <ExternalLink className="h-5 w-5 text-slate-400" />
          </Link>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-3 rounded-full pl-2 pr-4 hover:bg-slate-800">
              <Avatar className="h-8 w-8 border-2 border-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{session.name.split(" ")[0]}</p>
                <p className="text-xs text-slate-500">Vendedor</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
            <DropdownMenuLabel className="text-slate-300">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white">{session.name}</p>
                <p className="text-xs text-slate-500">{session.email}</p>
                <Badge className="w-fit mt-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Vendedor
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <Link href="/seller/profile">
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <Link href="/seller/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configuracoes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <Link href="/ajuda">
                <HelpCircle className="mr-2 h-4 w-4" />
                Ajuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
