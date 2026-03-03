"use client"

import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { UnifiedChat } from "@/components/public/unified-chat"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import {
  Search, Calendar, Gauge, Fuel, ArrowRight, Car, Star,
  Shield, Clock, Award, Users, ChevronRight, ChevronLeft,
  Heart, MapPin, Phone, Sparkles, BadgeCheck, Calculator,
  CheckCircle2, TrendingUp, Zap, ArrowUpRight, Instagram,
  MessageCircle,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

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

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(end * ease))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString("pt-BR")}{suffix}</span>
}

function VehicleCard({ vehicle, priority = false }: { vehicle: any; priority?: boolean }) {
  const [favorited, setFavorited] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/veiculos/${vehicle.slug}`} className="group block">
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover-lift hover:border-primary/30 transition-colors duration-300">
        {/* Imagem */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {vehicle.primary_image && !imgError ? (
            <Image
              src={vehicle.primary_image}
              alt={vehicle.name}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
              <Car className="h-14 w-14 text-muted-foreground/30" />
            </div>
          )}

          {/* Gradiente base */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges topo */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {vehicle.is_featured && (
              <span className="badge-featured flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500" /> Destaque
              </span>
            )}
            {vehicle.condition === "new" && (
              <span className="badge-new">0 KM</span>
            )}
          </div>

          {/* Botão favorito */}
          <button
            onClick={(e) => { e.preventDefault(); setFavorited(f => !f) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={`h-4 w-4 ${favorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>

          {/* Preço na base da imagem */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-display font-bold text-lg leading-tight drop-shadow">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">{vehicle.brand_name}</p>
          <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">{vehicle.name}</h3>

          {/* Specs row */}
          <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vehicle.year_manufacture || vehicle.year}</span>
            {vehicle.mileage !== undefined && (
              <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{vehicle.mileage > 0 ? `${Number(vehicle.mileage).toLocaleString("pt-BR")} km` : "0 km"}</span>
            )}
            {vehicle.fuel_type && (
              <span className="flex items-center gap-1 capitalize"><Fuel className="h-3.5 w-3.5" />{vehicle.fuel_type}</span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {vehicle.transmission || "Consulte"}
            </span>
            <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function ClientHomePage({ vehicles, totalVehicles = 0, brands = [] }: HomePageProps) {
  const [searchType, setSearchType] = useState<"all" | "new" | "used">("all")
  const [searchBrand, setSearchBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLDivElement>(null)

  const featuredVehicles = vehicles.filter((v) => v.is_featured).slice(0, 8)
  const recentVehicles = vehicles.slice(0, 12)

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" })
  }

  const searchParams = new URLSearchParams()
  if (searchBrand && searchBrand !== "all") searchParams.set("marca", searchBrand)
  if (priceRange && priceRange !== "all") searchParams.set("preco", priceRange)
  if (searchType !== "all") searchParams.set("tipo", searchType)
  const searchUrl = `/veiculos${searchParams.toString() ? `?${searchParams}` : ""}`

  const priceRanges = [
    { label: "Ate R$ 50 mil", value: "0-50000" },
    { label: "R$ 50 mil — R$ 100 mil", value: "50000-100000" },
    { label: "R$ 100 mil — R$ 200 mil", value: "100000-200000" },
    { label: "Acima de R$ 200 mil", value: "200000-999999" },
  ]

  const bodyTypes = [
    { name: "SUVs", slug: "suv", icon: "🚙" },
    { name: "Hatch", slug: "hatch", icon: "🚗" },
    { name: "Sedan", slug: "sedan", icon: "🚘" },
    { name: "Picape", slug: "picape", icon: "🛻" },
    { name: "Eletrico", slug: "eletrico", icon: "⚡" },
    { name: "Esportivo", slug: "esportivo", icon: "🏎" },
  ]

  const trustItems = [
    { icon: Shield, title: "Garantia de 3 meses", desc: "Motor e cambio em todos os seminovos" },
    { icon: BadgeCheck, title: "Revisados e vistoriados", desc: "Checklist de 120 pontos antes da venda" },
    { icon: Calculator, title: "Financiamento facilitado", desc: "Aprovacao em ate 2h nos principais bancos" },
    { icon: TrendingUp, title: "Melhor preco garantido", desc: "Fazemos o match com a Tabela FIPE" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <UnifiedChat />

      <main className="flex-1">

        {/* ================================================
            HERO — fundo escuro premium com busca integrada
            ================================================ */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-950">
          {/* Fundo com imagem */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/hero-car.jpg')] bg-cover bg-center opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
          </div>

          {/* Acento vermelho sutil */}
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Esquerda — copy */}
              <div className="space-y-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Mais de 5.000 clientes em Taubate
                </div>

                <h1 className="font-display text-fluid-2xl font-bold text-white leading-none">
                  O carro que<br />
                  voce merece<br />
                  <span className="text-gradient-brand">esta aqui.</span>
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Ha mais de 15 anos conectando voce ao veiculo ideal.
                  Garantia real, financiamento facilitado e atendimento sem burocracia.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/veiculos">
                    <Button size="lg" className="h-13 px-7 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-brand">
                      <Search className="h-4 w-4 mr-2" />
                      Ver {totalVehicles || vehicles.length}+ veiculos
                    </Button>
                  </Link>
                  <a href="https://wa.me/5512974063079" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="h-13 px-7 border-white/20 text-white hover:bg-white/10 rounded-xl font-semibold bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Falar no WhatsApp
                    </Button>
                  </a>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 pt-4 border-t border-white/10">
                  {[
                    { value: totalVehicles || vehicles.length, suffix: "+", label: "Veiculos" },
                    { value: 15, suffix: "+", label: "Anos" },
                    { value: 5000, suffix: "+", label: "Clientes" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-3xl font-bold text-white">
                        <AnimatedCounter end={s.value} suffix={s.suffix} />
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direita — card de busca */}
              <div className="lg:pl-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-7 shadow-2xl">
                  <h2 className="font-display text-xl font-bold text-white mb-6">Buscar veiculo</h2>

                  {/* Tabs tipo */}
                  <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl mb-5">
                    {[
                      { id: "all", label: "Todos" },
                      { id: "new", label: "0 KM" },
                      { id: "used", label: "Seminovos" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSearchType(t.id as any)}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          searchType === t.id
                            ? "bg-red-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {/* Marca */}
                    <Select value={searchBrand} onValueChange={setSearchBrand}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Marca" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all">Todas as marcas</SelectItem>
                        {brands.map((b: any) => (
                          <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Faixa de preco */}
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue placeholder="Faixa de preco" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="all">Qualquer valor</SelectItem>
                        {priceRanges.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Link href={searchUrl} className="block">
                      <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-base">
                        <Search className="h-4 w-4 mr-2" /> Buscar agora
                      </Button>
                    </Link>
                  </div>

                  {/* Busca IA */}
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2.5">Buscas rapidas:</p>
                    <div className="flex flex-wrap gap-2">
                      {["SUV automatico", "Ate 50 mil", "Hatch 0km", "Flex"].map((tag) => (
                        <Link key={tag} href={`/veiculos?q=${encodeURIComponent(tag)}`}>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs hover:border-red-500/40 hover:text-red-400 transition-colors cursor-pointer">
                            {tag}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            MARCAS — carrossel infinito suave
            ================================================ */}
        {brands.length > 0 && (
          <section className="py-14 bg-white border-y border-border overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Marcas disponiveis</p>
            </div>
            <div className="relative flex items-center">
              <button onClick={() => scroll(brandsRef, "left")} className="absolute left-4 z-10 w-9 h-9 rounded-full bg-background border border-border shadow-card flex items-center justify-center hover:border-primary transition-colors">
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>
              <div ref={brandsRef} className="flex items-center gap-8 overflow-x-auto scrollbar-hide px-12 py-2" style={{ scrollbarWidth: "none" }}>
                {brands.map((brand: any) => (
                  <Link
                    key={brand.id}
                    href={`/veiculos?marca=${brand.id}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-20 h-12 flex items-center justify-center grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-300">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="font-display font-bold text-lg text-foreground">{brand.name}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{brand.name}</span>
                  </Link>
                ))}
              </div>
              <button onClick={() => scroll(brandsRef, "right")} className="absolute right-4 z-10 w-9 h-9 rounded-full bg-background border border-border shadow-card flex items-center justify-center hover:border-primary transition-colors">
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            </div>
          </section>
        )}

        {/* ================================================
            TIPOS DE CARROCERIA
            ================================================ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Categorias</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Buscar por tipo</h2>
              </div>
              <Link href="/veiculos" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {bodyTypes.map((type) => (
                <Link key={type.slug} href={`/veiculos?categoria=${type.slug}`}>
                  <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/3 hover-lift cursor-pointer text-center transition-colors">
                    <span className="text-3xl">{type.icon}</span>
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{type.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================
            VEICULOS EM DESTAQUE
            ================================================ */}
        {featuredVehicles.length > 0 && (
          <section className="py-20 bg-muted/40">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> Destaques
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Veiculos em destaque</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => scroll(scrollRef, "left")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors bg-background">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => scroll(scrollRef, "right")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors bg-background">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
                {featuredVehicles.map((vehicle, i) => (
                  <div key={vehicle.id} className="flex-shrink-0 w-[300px] md:w-[340px] snap-start">
                    <VehicleCard vehicle={vehicle} priority={i < 3} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================
            TODOS OS VEICULOS — grid limpo
            ================================================ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Estoque completo</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Veiculos disponiveis</h2>
              </div>
              <Link href="/veiculos" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recentVehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 4} />
              ))}
            </div>
            {vehicles.length > 12 && (
              <div className="text-center mt-12">
                <Link href="/veiculos">
                  <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl border-border font-semibold">
                    Ver todos os {totalVehicles}+ veiculos <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ================================================
            POR QUE ESCOLHER A GT — trust signals
            ================================================ */}
        <section className="py-24 bg-gray-950 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">Diferenciais</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Por que escolher<br className="hidden md:block" /> a GT Veiculos?
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">Mais de 15 anos de historia e milhares de clientes satisfeitos em Taubate e regiao.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustItems.map((item, i) => (
                <div key={i} className="group p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-white/8 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-red-600/15 flex items-center justify-center mb-5 group-hover:bg-red-600/25 transition-colors">
                    <item.icon className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-gray-950 flex items-center justify-center text-white text-xs font-bold">
                        {["J","M","A","C","R"][i-1]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                      <span className="text-amber-400 font-bold ml-1">4.9</span>
                    </div>
                    <p className="text-gray-400 text-sm">+500 avaliacoes verificadas</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>CNPJ verificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Detran credenciado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Nota 5 no Google</span>
                  </div>
                </div>

                <a href="https://instagram.com/gtveiculostaubate" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent gap-2 rounded-xl">
                    <Instagram className="h-4 w-4" /> @gtveiculostaubate
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            CTA FINAL — faixa de conversao
            ================================================ */}
        <section className="py-20 bg-red-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
              Pronto para encontrar seu proximo veiculo?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
              Visite a GT Veiculos em Taubate ou fale com um especialista agora mesmo pelo WhatsApp.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/veiculos">
                <Button size="lg" className="h-13 px-8 bg-white text-red-600 hover:bg-gray-100 font-bold rounded-xl">
                  <Search className="h-4 w-4 mr-2" /> Ver estoque completo
                </Button>
              </Link>
              <a href="https://wa.me/5512974063079" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-13 px-8 border-white/40 text-white hover:bg-white/10 bg-transparent font-semibold rounded-xl">
                  <MessageCircle className="h-4 w-4 mr-2" /> Falar com especialista
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-red-100 text-sm">
              <MapPin className="h-4 w-4" />
              Av. Cesar Costa, 222 — Taubate, SP · Seg–Sex 8h–18h · Sab 9h–13h
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
