"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  Search, 
  Phone, 
  User, 
  LogOut, 
  MessageCircle, 
  ChevronRight,
  Car,
  Home,
  BookOpen,
  Info,
  Mail,
  Heart,
  GitCompare,
  Settings,
  X,
  Sparkles
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
  SheetClose,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

export function PublicHeader() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
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
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
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
          ? "bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-700/50" 
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="hidden lg:block border-b border-slate-700/50 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-6">
            <a 
              href="tel:+551234567890" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Phone className="size-4 text-blue-400" />
              <span>(12) 3456-7890</span>
            </a>
            <a 
              href="https://wa.me/5512987654321" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="size-3 text-amber-400" />
            <span>Seg - Sex: 8h as 18h | Sab: 9h as 13h</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative flex size-11 lg:size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
              <span className="text-xl lg:text-2xl font-bold text-white">GT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold leading-tight text-white">
                GT
              </span>
              <span className="text-[10px] lg:text-xs font-medium leading-tight text-slate-400">
                Veículos Premium
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "text-white bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/veiculos">
                <Search className="size-5" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
              asChild
            >
              <Link href="/minha-conta/favoritos">
                <Heart className="size-5" />
              </Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-slate-800 rounded-full">
                    <Avatar className="size-8 border-2 border-blue-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white font-medium">{user.name?.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link href="/minha-conta" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                      <User className="mr-2 size-4" />
                      Minha Conta
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "super_admin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                        <Settings className="mr-2 size-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link href="/seller" className="cursor-pointer text-slate-300 hover:text-white focus:text-white focus:bg-slate-800">
                        <Settings className="mr-2 size-4" />
                        Painel Vendedor
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10">
                    <LogOut className="mr-2 size-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0">
                  <Link href="/registro">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-green-400 hover:bg-slate-800"
            >
              <a href="https://wa.me/5512987654321">
                <MessageCircle className="size-5" />
              </a>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700">
                <SheetHeader className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                        <span className="text-xl font-bold text-white">GT</span>
                      </div>
                      <span className="text-white">GT Veículos</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-80px)]">
                  {/* User info if logged in */}
                  {user && (
                    <div className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border-2 border-blue-500/30">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <SheetClose key={item.name} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                              isActive(item.href)
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                            )}
                          >
                            <Icon className="size-5" />
                            <span className="font-medium">{item.name}</span>
                            <ChevronRight className="size-4 ml-auto opacity-50" />
                          </Link>
                        </SheetClose>
                      )
                    })}

                    <div className="pt-4 border-t border-slate-700/50 mt-4 space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/veiculos"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <Search className="size-5" />
                          <span className="font-medium">Buscar Veiculos</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/minha-conta/favoritos"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <Heart className="size-5" />
                          <span className="font-medium">Favoritos</span>
                        </Link>
                      </SheetClose>
                    </div>

                    {user && (
                      <div className="pt-4 border-t border-slate-700/50 space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/minha-conta"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50"
                          >
                            <User className="size-5" />
                            <span className="font-medium">Minha Conta</span>
                          </Link>
                        </SheetClose>
                        {(user.role === "admin" || user.role === "super_admin") && (
                          <SheetClose asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Settings className="size-5" />
                              <span className="font-medium">Painel Admin</span>
                            </Link>
                          </SheetClose>
                        )}
                        {user.role === "seller" && (
                          <SheetClose asChild>
                            <Link
                              href="/seller"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Settings className="size-5" />
                              <span className="font-medium">Painel Vendedor</span>
                            </Link>
                          </SheetClose>
                        )}
                      </div>
                    )}
                  </nav>

                  {/* Bottom actions */}
                  <div className="p-4 border-t border-slate-700/50 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild className="w-full border-slate-700 text-white hover:bg-slate-800 bg-transparent">
                        <a href="tel:+551234567890">
                          <Phone className="size-4 mr-2" />
                          Ligar
                        </a>
                      </Button>
                      <Button size="sm" asChild className="w-full bg-green-600 hover:bg-green-500 text-white">
                        <a href="https://wa.me/5512987654321" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="size-4 mr-2" />
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
                        className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10 bg-transparent"
                      >
                        <LogOut className="size-4 mr-2" />
                        Sair da conta
                      </Button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <SheetClose asChild>
                          <Button variant="outline" asChild className="w-full border-slate-700 text-white hover:bg-slate-800 bg-transparent">
                            <Link href="/login">Entrar</Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                            <Link href="/registro">Cadastrar</Link>
                          </Button>
                        </SheetClose>
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
