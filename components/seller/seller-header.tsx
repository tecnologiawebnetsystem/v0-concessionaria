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
import { LogOut, User, Bell, ExternalLink, Menu } from "lucide-react"
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
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Painel do Vendedor</h2>
          <p className="text-xs text-gray-500">Bem-vindo(a), {session.name.split(" ")[0]}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {sellerData && (
          <div className="hidden md:flex items-center gap-4 mr-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Vendas do Mês</p>
              <p className="text-sm font-semibold text-emerald-600">{sellerData.monthSales}</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-right">
              <p className="text-xs text-gray-500">Comissões Pendentes</p>
              <p className="text-sm font-semibold text-amber-600">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(sellerData.pendingCommissions)}
              </p>
            </div>
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </Button>
        
        <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
          <Link href="/" target="_blank">
            <ExternalLink className="mr-2 size-4" />
            Ver Site
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-emerald-600 text-white">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session.name}</p>
                <p className="text-xs text-gray-500">{session.email}</p>
                <Badge variant="outline" className="w-fit mt-1 text-emerald-600 border-emerald-600">
                  Vendedor
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/seller/profile">
                <User className="mr-2 size-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
