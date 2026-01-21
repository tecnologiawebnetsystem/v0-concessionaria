"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  Search, 
  Phone, 
  User, 
  LogOut, 
  MessageCircle, 
  Moon, 
  Sun,
  ChevronRight,
  Car,
  Home,
  BookOpen,
  Info,
  Mail,
  Heart,
  GitCompare,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { FavoritesPanel } from "./favorites-panel"
import { ComparePanel } from "./compare-panel"

export function PublicHeader() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
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
    { name: "Inicio", href: "/", icon: Home },
    { name: "Veiculos", href: "/veiculos", icon: Car },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Sobre", href: "/sobre", icon: Info },
    { name: "Contato", href: "/contato", icon: Mail },
  ]

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm" 
          : "bg-white dark:bg-slate-950"
      )}
    >
      {/* Top bar - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block border-b border-gray-100 dark:border-slate-800 bg-blue-900 dark:bg-blue-950 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-white">
          <div className="flex items-center gap-4">
            <a 
              href="tel:+551234567890" 
              className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
              aria-label="Ligar para (12) 3456-7890"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              <span>(12) 3456-7890</span>
            </a>
            <a 
              href="https://wa.me/5512987654321" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
              aria-label="Abrir WhatsApp"
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="text-xs opacity-90">
            Seg - Sex: 8h as 18h | Sab: 9h as 13h
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            aria-label="Nacional Veiculos - Pagina inicial"
          >
            <div className="relative flex size-10 sm:size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow-lg">
              <span className="text-xl sm:text-2xl font-bold text-white">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold leading-tight text-blue-900 dark:text-blue-100">
                Nacional
              </span>
              <span className="text-[10px] sm:text-xs font-medium leading-tight text-gray-600 dark:text-gray-400 hidden xs:block">
                Confianca e Qualidade
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:gap-1" aria-label="Navegacao principal">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-all",
                  isActive(item.href)
                    ? "text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-gray-700 dark:text-gray-300"
            >
              <Link href="/veiculos" aria-label="Buscar veiculos">
                <Search className="size-4" aria-hidden="true" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>
            
            <FavoritesPanel />
            <ComparePanel />
            
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 dark:text-gray-300"
                aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" aria-hidden="true" />
                ) : (
                  <Moon className="size-4" aria-hidden="true" />
                )}
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-blue-900 text-white text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/minha-conta" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      Minha Conta
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "super_admin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-900 hover:bg-blue-800">
                  <Link href="/registro">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            {/* Quick call button on mobile */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-green-600 sm:hidden"
            >
              <a href="https://wa.me/5512987654321" aria-label="WhatsApp">
                <MessageCircle className="size-5" aria-hidden="true" />
              </a>
            </Button>
            
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 dark:text-gray-300"
                aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
              >
                {theme === "dark" ? (
                  <Sun className="size-5" aria-hidden="true" />
                ) : (
                  <Moon className="size-5" aria-hidden="true" />
                )}
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-300"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-700">
                      <span className="text-xl font-bold text-white">N</span>
                    </div>
                    <span className="text-blue-900 dark:text-blue-100">Nacional Veiculos</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-80px)]">
                  {/* User info if logged in */}
                  {user && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-900 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Menu mobile">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                            isActive(item.href)
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                          )}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                          <span className="font-medium">{item.name}</span>
                          <ChevronRight className="size-4 ml-auto opacity-50" aria-hidden="true" />
                        </Link>
                      )
                    })}

                    <div className="pt-4 border-t my-4">
                      <Link
                        href="/veiculos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <Search className="size-5" aria-hidden="true" />
                        <span className="font-medium">Buscar Veiculos</span>
                      </Link>
                      <Link
                        href="/comparar"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <GitCompare className="size-5" aria-hidden="true" />
                        <span className="font-medium">Comparar</span>
                      </Link>
                    </div>

                    {user && (
                      <div className="pt-4 border-t">
                        <Link
                          href="/minha-conta"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          <User className="size-5" aria-hidden="true" />
                          <span className="font-medium">Minha Conta</span>
                        </Link>
                        {(user.role === "admin" || user.role === "super_admin") && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                          >
                            <Settings className="size-5" aria-hidden="true" />
                            <span className="font-medium">Painel Admin</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </nav>

                  {/* Bottom actions */}
                  <div className="p-4 border-t space-y-3">
                    {/* Contact buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                        <a href="tel:+551234567890">
                          <Phone className="size-4 mr-2" aria-hidden="true" />
                          Ligar
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                        <a href="https://wa.me/5512987654321" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="size-4 mr-2" aria-hidden="true" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>

                    {user ? (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <LogOut className="size-4 mr-2" aria-hidden="true" />
                        Sair da conta
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" asChild className="w-full bg-transparent">
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            Entrar
                          </Link>
                        </Button>
                        <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                          <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
                            Cadastrar
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
