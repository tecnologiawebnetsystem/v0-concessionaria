"use client"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { UnifiedChat } from "@/components/public/unified-chat"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Calendar,
  Gauge,
  Fuel,
  ArrowRight,
  Car,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  FileText,
  TrendingUp,
  Zap,
  Heart,
  MapPin,
  Phone,
  Truck,
  Sparkles,
  BadgeCheck,
  Calculator,
  Newspaper,
  Play,
  Eye,
  ArrowUpRight,
} from "lucide-react"
import { useState, useRef } from "react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface HomePageProps {
  vehicles: any[]
  totalVehicles?: number
  brands?: any[]
}

export default function ClientHomePage({ vehicles, totalVehicles = 0, brands = [] }: HomePageProps) {
  const [searchType, setSearchType] = useState<"all" | "new" | "used">("all")
  const [searchBrand, setSearchBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [favorites, setFavorites] = useState<number[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const featuredVehicles = vehicles.filter((v) => v.is_featured).slice(0, 8)
  const allVehicles = vehicles.slice(0, 30)

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  const priceRanges = [
    { label: "Ate R$ 50 mil", value: "0-50000", color: "from-emerald-500 to-teal-500", icon: "💚" },
    { label: "R$ 50 - 100 mil", value: "50000-100000", color: "from-blue-500 to-cyan-500", icon: "💙" },
    { label: "R$ 100 - 150 mil", value: "100000-150000", color: "from-violet-500 to-purple-500", icon: "💜" },
    { label: "Acima R$ 150 mil", value: "150000-999999", color: "from-amber-500 to-orange-500", icon: "🧡" },
  ]

  const categories = [
    { name: "SUVs", icon: "🚙", count: 45 },
    { name: "Sedans", icon: "🚗", count: 32 },
    { name: "Hatches", icon: "🚕", count: 28 },
    { name: "Picapes", icon: "🛻", count: 15 },
    { name: "Esportivos", icon: "🏎️", count: 8 },
    { name: "Eletricos", icon: "⚡", count: 12 },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <PublicHeader />
      <UnifiedChat />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[700px] overflow-hidden">
          {/* Video/Image Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80 z-10" />
            <div className="absolute inset-0 bg-[url('/hero-car.jpg')] bg-cover bg-center bg-no-repeat opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 z-10" />
          </div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto px-4 py-20 md:py-28 relative z-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-blue-300">Mais de 5.000 clientes satisfeitos</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Seu proximo{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      carro
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 10C50 4 150 4 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                          <stop stopColor="#3b82f6"/>
                          <stop offset="1" stopColor="#06b6d4"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <br />esta aqui
                </h1>

                <p className="text-xl text-slate-400 max-w-lg">
                  Ha mais de 15 anos conectando voce ao veiculo dos seus sonhos. 
                  Financiamento facilitado, garantia e atendimento premium.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/veiculos">
                    <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold rounded-2xl shadow-xl shadow-blue-600/25">
                      <Search className="mr-2 h-5 w-5" />
                      Ver {totalVehicles || vehicles.length} veiculos
                    </Button>
                  </Link>
                  <Link href="/minha-conta/avaliacoes">
                    <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 text-white hover:bg-slate-800 text-lg font-semibold rounded-2xl bg-transparent">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Vender meu carro
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                  <div>
                    <p className="text-3xl font-bold text-white">{totalVehicles || vehicles.length}+</p>
                    <p className="text-sm text-slate-500">Veiculos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">15+</p>
                    <p className="text-sm text-slate-500">Anos</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">98%</p>
                    <p className="text-sm text-slate-500">Aprovacao</p>
                  </div>
                </div>
              </div>

              {/* Right - Search Card */}
              <div className="lg:pl-8">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <Search className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Busca rapida</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Type Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                      {[
                        { id: "all", label: "Todos" },
                        { id: "new", label: "0 KM" },
                        { id: "used", label: "Seminovos" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSearchType(type.id as any)}
                          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                            searchType === type.id
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {/* Brand Select */}
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1.5 block">Marca</label>
                      <Select value={searchBrand} onValueChange={setSearchBrand}>
                        <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                          <SelectValue placeholder="Todas as marcas" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">Todas as marcas</SelectItem>
                          {brands.map((brand: any) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Select */}
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1.5 block">Faixa de preco</label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                          <SelectValue placeholder="Qualquer valor" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">Qualquer valor</SelectItem>
                          {priceRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search Button */}
                    <Link href="/veiculos" className="block">
                      <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-base font-semibold">
                        <Search className="mr-2 h-5 w-5" />
                        Buscar veiculos
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-3">Buscas populares:</p>
                    <div className="flex flex-wrap gap-2">
                      {["SUV", "Sedan", "Hatch", "Automatico", "Flex"].map((tag) => (
                        <Link key={tag} href={`/veiculos?q=${tag.toLowerCase()}`}>
                          <Badge variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARCAS CAROUSEL */}
        <section className="py-12 bg-slate-900 border-y border-slate-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-12 overflow-hidden">
              {brands.slice(0, 8).map((brand: any) => (
                <Link 
                  key={brand.id} 
                  href={`/veiculos?marca=${brand.id}`}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
                >
                  {brand.logo_url ? (
                    <img 
                      src={brand.logo_url || "/placeholder.svg"} 
                      alt={brand.name} 
                      className="h-12 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <span className={`text-xl font-bold text-slate-400 hover:text-white ${brand.logo_url ? 'hidden' : ''}`}>
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIAS POR PRECO */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <DollarSign className="h-3 w-3 mr-1" /> Orcamento
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Busque por faixa de preco</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Encontre veiculos que cabem no seu bolso</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {priceRanges.map((range, idx) => (
                <Link key={idx} href={`/veiculos?preco=${range.value}`}>
                  <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-slate-700 transition-all duration-500 cursor-pointer h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${range.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <CardContent className="p-6 md:p-8 relative">
                      <span className="text-4xl md:text-5xl mb-4 block">{range.icon}</span>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{range.label}</h3>
                      <div className="flex items-center text-slate-500 group-hover:text-blue-400 transition-colors">
                        <span className="text-sm">Ver veiculos</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VEICULOS EM DESTAQUE - CAROUSEL */}
        {featuredVehicles.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <Star className="h-3 w-3 mr-1 fill-amber-400" /> Destaques
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Veiculos em destaque</h2>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full border-slate-700 hover:bg-slate-800 bg-transparent">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full border-slate-700 hover:bg-slate-800 bg-transparent">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {featuredVehicles.map((vehicle: any) => (
                  <Link 
                    key={vehicle.id} 
                    href={`/veiculos/${vehicle.slug}`}
                    className="flex-shrink-0 w-[340px] snap-start"
                  >
                    <Card className="group bg-slate-900 border-slate-800 hover:border-blue-500/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {vehicle.primary_image ? (
                          <Image
                            src={vehicle.primary_image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <Car className="h-16 w-16 text-slate-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-amber-500 text-white text-xs">
                            <Star className="h-3 w-3 mr-1 fill-white" /> Destaque
                          </Badge>
                          {vehicle.is_new && (
                            <Badge className="bg-emerald-500 text-white text-xs">0 KM</Badge>
                          )}
                        </div>

                        {/* Favorite */}
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleFavorite(vehicle.id) }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(vehicle.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                        </button>
                      </div>

                      <CardContent className="p-5">
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-1">{vehicle.brand_name}</p>
                          <h3 className="font-bold text-white text-lg truncate">{vehicle.name}</h3>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {vehicle.year_manufacture}/{vehicle.year_model}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="h-3.5 w-3.5" /> {vehicle.mileage?.toLocaleString()} km
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-white">{formatCurrency(vehicle.price)}</p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                            Ver mais
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIAS */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Car className="h-3 w-3 mr-1" /> Categorias
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Encontre por tipo de veiculo</h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/veiculos?tipo=${cat.name.toLowerCase()}`}>
                  <Card className="group bg-slate-900 border-slate-800 hover:border-blue-500/30 transition-all duration-300 cursor-pointer text-center">
                    <CardContent className="p-6">
                      <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{cat.count} ofertas</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TODOS OS VEICULOS - GRID DE 30 */}
        <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Nosso estoque completo</h2>
                <p className="text-slate-400 mt-2">{allVehicles.length} veiculos disponiveis</p>
              </div>
              <Link href="/veiculos">
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 bg-transparent">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {allVehicles.map((vehicle: any) => (
                <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
                  <Card className="group bg-slate-900 border-slate-800 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {vehicle.primary_image ? (
                        <Image
                          src={vehicle.primary_image || "/placeholder.svg"}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Car className="h-12 w-12 text-slate-700" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {vehicle.is_featured && (
                          <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                            <Star className="h-2.5 w-2.5 mr-0.5 fill-white" /> Top
                          </Badge>
                        )}
                        {vehicle.is_new && (
                          <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5">0KM</Badge>
                        )}
                      </div>

                      {/* Favorite */}
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(vehicle.id) }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart className={`h-3.5 w-3.5 ${favorites.includes(vehicle.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                      </button>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    </div>

                    <CardContent className="p-3 md:p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{vehicle.brand_name}</p>
                      <h3 className="font-bold text-white text-sm truncate mb-2">{vehicle.name}</h3>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                        <span>{vehicle.year_manufacture}/{vehicle.year_model}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>{(vehicle.mileage / 1000).toFixed(0)}k km</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-white">{formatCurrency(vehicle.price)}</p>
                        <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Link href="/veiculos">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl px-12">
                  Ver todos os {totalVehicles || vehicles.length} veiculos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICOS */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossos servicos</h2>
              <p className="text-slate-400">Tudo que voce precisa em um so lugar</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Calculator, 
                  title: "Financiamento", 
                  desc: "Aprovacao em ate 30 minutos. Melhores taxas do mercado.",
                  color: "from-blue-500 to-cyan-500",
                  link: "/financiamento"
                },
                { 
                  icon: DollarSign, 
                  title: "Venda seu carro", 
                  desc: "Avaliacao gratuita e pagamento a vista na hora.",
                  color: "from-emerald-500 to-teal-500",
                  link: "/avaliar-veiculo"
                },
                { 
                  icon: Shield, 
                  title: "Garantia", 
                  desc: "Todos os veiculos com garantia de motor e cambio.",
                  color: "from-violet-500 to-purple-500",
                  link: "/garantia"
                },
                { 
                  icon: FileText, 
                  title: "Documentacao", 
                  desc: "Cuidamos de toda a burocracia para voce.",
                  color: "from-amber-500 to-orange-500",
                  link: "/documentacao"
                },
              ].map((service, idx) => (
                <Link key={idx} href={service.link}>
                  <Card className="group bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-slate-400 text-sm">{service.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Pronto para encontrar seu proximo carro?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Fale com um de nossos consultores e encontre o veiculo ideal para voce
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/veiculos">
                  <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl text-lg font-semibold">
                    <Search className="mr-2 h-5 w-5" />
                    Explorar veiculos
                  </Button>
                </Link>
                <Link href="https://wa.me/5512999999999">
                  <Button size="lg" variant="outline" className="h-14 px-8 border-white/30 text-white hover:bg-white/10 rounded-2xl text-lg font-semibold bg-transparent">
                    <Phone className="mr-2 h-5 w-5" />
                    Falar no WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LOCALIZACAO */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <MapPin className="h-3 w-3 mr-1" /> Localizacao
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Venha nos visitar</h2>
                <p className="text-slate-400 mb-8">
                  Estamos localizados em Taubate, com facil acesso pela Rodovia Presidente Dutra.
                  Venha conhecer nosso showroom e fazer um test drive!
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Endereco</h4>
                      <p className="text-slate-400">Av. Independencia, 1500 - Centro, Taubate - SP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10">
                      <Clock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Horario</h4>
                      <p className="text-slate-400">Seg a Sex: 8h as 18h | Sab: 9h as 13h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10">
                      <Phone className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Telefone</h4>
                      <p className="text-slate-400">(12) 3333-4444 | (12) 99999-9999</p>
                    </div>
                  </div>
                </div>

                <Link href="https://maps.google.com" target="_blank">
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    <MapPin className="mr-2 h-4 w-4" />
                    Abrir no Google Maps
                  </Button>
                </Link>
              </div>

              <div className="relative h-[400px] rounded-3xl overflow-hidden border border-slate-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.356303544976!2d-45.555932684425!3d-23.02636448494991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzM0LjkiUyA0NcKwMzMnMTIuNSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
