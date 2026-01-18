"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, Phone, User, LogOut, MessageCircle, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { FavoritesPanel } from "./favorites-panel"
import { ComparePanel } from "./compare-panel"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      toast.success("Logout realizado com sucesso!")
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Veículos", href: "/veiculos" },
    { name: "Blog", href: "/blog" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ]

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="border-b border-gray-100 bg-blue-900 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-white">
          <div className="flex items-center gap-4">
            <a href="tel:+551134567890" className="flex items-center gap-1 hover:text-blue-200">
              <Phone className="size-3.5" />
              (11) 3456-7890
            </a>
            <a href="https://wa.me/5511987654321" className="flex items-center gap-1 hover:text-blue-200">
              <MessageCircle className="size-3.5" />
              WhatsApp
            </a>
          </div>
          <div className="hidden text-xs sm:block">Seg - Sex: 8h às 18h | Sáb: 9h às 13h</div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow-lg">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight text-blue-900">Nacional Veículos</span>
                <span className="text-xs font-medium leading-tight text-gray-600">Confiança e Qualidade</span>
              </div>
            </Link>

            <nav className="hidden lg:flex lg:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-gray-700 transition-colors hover:text-blue-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="sm" asChild className="text-gray-700">
              <Link href="/veiculos">
                <Search className="mr-2 size-4" />
                Buscar
              </Link>
            </Button>
            
            {/* Favoritos */}
            <FavoritesPanel />
            
            {/* Comparar */}
            <ComparePanel />
            
            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700"
              >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-blue-900 text-white">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" || user.role === "super_admin" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Painel Admin</Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/registro">Cadastrar</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-900 hover:bg-blue-800">
                  <Link href="/login">
                    <User className="mr-2 size-4" />
                    Entrar
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("border-t border-gray-200 bg-white lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/contato">
                <Phone className="mr-2 size-4" />
                Contato
              </Link>
            </Button>
            {user ? (
              <>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.role === "admin" || user.role === "super_admin" ? (
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <Link href="/admin">Painel Admin</Link>
                  </Button>
                ) : null}
                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-transparent">
                  <LogOut className="mr-2 size-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/registro">Cadastrar</Link>
                </Button>
                <Button size="sm" asChild className="w-full bg-blue-900 hover:bg-blue-800">
                  <Link href="/login">
                    <User className="mr-2 size-4" />
                    Entrar
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
