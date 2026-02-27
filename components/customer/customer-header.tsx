"use client"

import Link from "next/link"
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
import { Bell, Menu, User, LogOut, Heart, FileText, Car, Search, Home, ClipboardList, History, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Meu Painel", href: "/minha-conta", icon: Home },
  { name: "Favoritos", href: "/minha-conta/favoritos", icon: Heart },
  { name: "Propostas", href: "/minha-conta/propostas", icon: FileText },
  { name: "Test Drives", href: "/minha-conta/test-drives", icon: Car },
  { name: "Avaliacoes", href: "/minha-conta/avaliacoes", icon: ClipboardList },
  { name: "Historico", href: "/minha-conta/historico", icon: History },
  { name: "Meu Perfil", href: "/minha-conta/perfil", icon: User },
]

export function CustomerHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-slate-800">
            <Menu className="size-5 text-slate-400" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Car className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">GT Veículos</h1>
                  <p className="text-[10px] text-slate-400">Area do Cliente</p>
                </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-800">
                  <X className="size-5 text-slate-400" />
                </Button>
              </SheetClose>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SheetClose key={item.name} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      )}
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
            <div className="p-4 border-t border-slate-700/50">
              <SheetClose asChild>
                <Link
                  href="/logout"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="size-5" />
                  Sair da Conta
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Bar */}
      <div className="hidden flex-1 items-center gap-4 lg:flex">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Buscar veiculos, propostas..."
            className="h-10 border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link href="/veiculos">
          <Button size="sm" className="hidden sm:flex bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0">
            <Car className="size-4 mr-2" />
            Ver Veiculos
          </Button>
        </Link>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-800">
              <Bell className="size-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 size-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-semibold">
                2
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-white">Notificacoes</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <div className="p-2 space-y-2">
              <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="size-5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">Proposta Aprovada!</p>
                  <p className="text-xs text-slate-400 truncate">Sua proposta para Honda Civic foi aprovada</p>
                  <p className="text-[10px] text-slate-500 mt-1">Ha 2 horas</p>
                </div>
              </div>
              <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Car className="size-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">Test Drive Confirmado</p>
                  <p className="text-xs text-slate-400 truncate">Amanha as 14h - Toyota Corolla</p>
                  <p className="text-[10px] text-slate-500 mt-1">Ha 5 horas</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-slate-700" />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                Ver todas as notificacoes
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-3 rounded-full pl-2 pr-4 hover:bg-slate-800">
              <Avatar className="size-8 border-2 border-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
                  CL
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-white">Cliente</p>
                <p className="text-xs text-slate-400">Minha Conta</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-white">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem asChild>
              <Link href="/minha-conta/perfil" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                <User className="mr-2 size-4" />
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/minha-conta/favoritos" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                <Heart className="mr-2 size-4" />
                Favoritos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/minha-conta/propostas" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                <FileText className="mr-2 size-4" />
                Minhas Propostas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem asChild>
              <Link href="/logout" className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                <LogOut className="mr-2 size-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
