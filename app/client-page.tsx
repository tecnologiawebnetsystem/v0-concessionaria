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
} from "lucide-react"
import { useState } from "react"

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
  const [searchModel, setSearchModel] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const featuredVehicles = vehicles.filter((v) => v.is_featured).slice(0, 6)
  const recentVehicles = vehicles.slice(0, 8)

  // Categorias por tipo
  const categories = [
    { name: "SUVs", icon: Truck, count: vehicles.filter(v => v.body_type === "SUV").length, filter: "suv" },
    { name: "Sedans", icon: Car, count: vehicles.filter(v => v.body_type === "Sedan").length, filter: "sedan" },
    { name: "Hatches", icon: Car, count: vehicles.filter(v => v.body_type === "Hatch").length, filter: "hatch" },
    { name: "Picapes", icon: Truck, count: vehicles.filter(v => v.body_type === "Picape").length, filter: "picape" },
  ]

  // Faixas de preco
  const priceRanges = [
    { label: "Ate R$ 50.000", min: 0, max: 50000, color: "from-emerald-500 to-teal-600" },
    { label: "R$ 50.000 - R$ 100.000", min: 50000, max: 100000, color: "from-blue-500 to-indigo-600" },
    { label: "R$ 100.000 - R$ 150.000", min: 100000, max: 150000, color: "from-violet-500 to-purple-600" },
    { label: "Acima de R$ 150.000", min: 150000, max: 999999999, color: "from-amber-500 to-orange-600" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <PublicHeader />
      <UnifiedChat />

      <main className="flex-1">
        {/* HERO SECTION - Estilo WebMotors Premium */}
        <section className="relative min-h-[600px] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_50%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            {/* Header Text */}
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Mais de 15 anos realizando sonhos
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                Encontre o carro{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  perfeito
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                Os melhores veiculos novos e seminovos com garantia, financiamento facilitado e atendimento premium
              </p>
            </div>

            {/* Search Box - Estilo WebMotors */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-2 shadow-2xl shadow-blue-500/10">
                {/* Tabs */}
                <Tabs defaultValue="buy" className="w-full">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <TabsList className="bg-transparent gap-2">
                      <TabsTrigger 
                        value="buy" 
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 px-6 py-2 rounded-xl"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Comprar
                      </TabsTrigger>
                      <TabsTrigger 
                        value="sell"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 px-6 py-2 rounded-xl"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Vender
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="hidden md:flex items-center gap-4 text-sm">
                      <button 
                        onClick={() => setSearchType("all")}
                        className={`px-4 py-1.5 rounded-full transition-all ${searchType === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        Todos
                      </button>
                      <button 
                        onClick={() => setSearchType("new")}
                        className={`px-4 py-1.5 rounded-full transition-all ${searchType === "new" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        0 KM
                      </button>
                      <button 
                        onClick={() => setSearchType("used")}
                        className={`px-4 py-1.5 rounded-full transition-all ${searchType === "used" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        Seminovos
                      </button>
                    </div>
                  </div>

                  <TabsContent value="buy" className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Marca</label>
                        <Select value={searchBrand} onValueChange={setSearchBrand}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl">
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

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Modelo</label>
                        <Input 
                          placeholder="Digite o modelo" 
                          className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl placeholder:text-slate-500"
                          value={searchModel}
                          onChange={(e) => setSearchModel(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Preco</label>
                        <Select value={priceRange} onValueChange={setPriceRange}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Qualquer preco" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="all">Qualquer preco</SelectItem>
                            <SelectItem value="0-50000">Ate R$ 50.000</SelectItem>
                            <SelectItem value="50000-100000">R$ 50.000 - R$ 100.000</SelectItem>
                            <SelectItem value="100000-150000">R$ 100.000 - R$ 150.000</SelectItem>
                            <SelectItem value="150000+">Acima de R$ 150.000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Link href="/veiculos" className="w-full">
                          <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-base font-semibold shadow-lg shadow-blue-600/25">
                            <Search className="h-5 w-5 mr-2" />
                            Ver {totalVehicles || vehicles.length} ofertas
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sell" className="p-4 md:p-6">
                    <div className="text-center py-8">
                      <Car className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Venda seu veiculo conosco</h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Avaliamos seu carro gratuitamente e fazemos a melhor proposta do mercado
                      </p>
                      <Link href="/avaliar-veiculo">
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl px-8 py-3">
                          Avaliar meu veiculo
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8 text-center">
                <div>
                  <p className="text-3xl font-bold text-white">{totalVehicles || vehicles.length}+</p>
                  <p className="text-sm text-slate-500">Veiculos disponiveis</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-white">15+</p>
                  <p className="text-sm text-slate-500">Anos de mercado</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-white">5.000+</p>
                  <p className="text-sm text-slate-500">Clientes satisfeitos</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p className="text-sm text-slate-500">Aprovacao financiamento</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS POR FAIXA DE PRECO */}
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Busque por faixa de preco</h2>
                <p className="text-slate-400 mt-1">Encontre veiculos dentro do seu orcamento</p>
              </div>
              <Link href="/veiculos" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                Ver todos <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {priceRanges.map((range, idx) => (
                <Link key={idx} href={`/veiculos?priceMin=${range.min}&priceMax=${range.max}`}>
                  <Card className="group bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer">
                    <CardContent className="p-6 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${range.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <DollarSign className={`h-10 w-10 mb-4 text-transparent bg-gradient-to-br ${range.color} bg-clip-text`} />
                      <h3 className="font-bold text-white mb-1">{range.label}</h3>
                      <p className="text-sm text-slate-500">
                        {vehicles.filter(v => v.price >= range.min && v.price < range.max).length} veiculos
                      </p>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIAS POR TIPO */}
        <section className="py-16 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Busque por categoria</h2>
                <p className="text-slate-400 mt-1">Escolha o estilo que combina com voce</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "SUVs", icon: "🚙", desc: "Espaco e conforto", filter: "suv" },
                { name: "Sedans", icon: "🚗", desc: "Elegancia e economia", filter: "sedan" },
                { name: "Hatches", icon: "🚕", desc: "Praticos e ageis", filter: "hatch" },
                { name: "Picapes", icon: "🛻", desc: "Forca e versatilidade", filter: "picape" },
                { name: "Esportivos", icon: "🏎️", desc: "Performance pura", filter: "esportivo" },
                { name: "Eletricos", icon: "⚡", desc: "O futuro e agora", filter: "eletrico" },
                { name: "Luxo", icon: "✨", desc: "Exclusividade total", filter: "luxo" },
                { name: "Economicos", icon: "💰", desc: "Menor custo/km", filter: "economico" },
              ].map((cat, idx) => (
                <Link key={idx} href={`/veiculos?categoria=${cat.filter}`}>
                  <Card className="group bg-gradient-to-br from-slate-800 to-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10">
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <h3 className="font-bold text-white mb-1">{cat.name}</h3>
                      <p className="text-sm text-slate-500">{cat.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VEICULOS EM DESTAQUE */}
        {featuredVehicles.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Badge className="mb-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Star className="h-3 w-3 mr-1 fill-amber-400" /> Selecao especial
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Veiculos em destaque</h2>
                </div>
                <Link href="/veiculos?destaque=true" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  Ver todos <ChevronRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredVehicles.map((vehicle: any, index: number) => (
                  <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
                    <Card className="group bg-slate-800/50 border-slate-700 hover:border-blue-500/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {vehicle.primary_image ? (
                          <Image
                            src={vehicle.primary_image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                            <Car className="h-20 w-20 text-slate-600" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-amber-500 text-white shadow-lg">
                            <Star className="h-3 w-3 mr-1 fill-white" /> Destaque
                          </Badge>
                          {vehicle.is_new && (
                            <Badge className="bg-emerald-500 text-white shadow-lg">0 KM</Badge>
                          )}
                        </div>

                        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors">
                          <Heart className="h-5 w-5" />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">{vehicle.brand_name}</p>
                          <h3 className="text-xl font-bold text-white line-clamp-1">{vehicle.name}</h3>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {vehicle.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" /> {vehicle.mileage ? `${(vehicle.mileage / 1000).toFixed(0)}k km` : "0 km"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-3 w-3" /> {vehicle.fuel_type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">A partir de</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(vehicle.price)}</p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Ver detalhes <ArrowRight className="ml-1 h-4 w-4" />
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

        {/* SERVICOS */}
        <section className="py-16 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Nossos servicos</h2>
              <p className="text-slate-400">Tudo que voce precisa para comprar ou vender seu veiculo</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: Calculator, 
                  title: "Financiamento", 
                  desc: "Aprovacao em ate 24h com as melhores taxas",
                  color: "from-blue-500 to-indigo-600",
                  href: "/financiamento"
                },
                { 
                  icon: DollarSign, 
                  title: "Vender Veiculo", 
                  desc: "Avaliacao gratuita e pagamento a vista",
                  color: "from-emerald-500 to-teal-600",
                  href: "/avaliar-veiculo"
                },
                { 
                  icon: FileText, 
                  title: "Tabela FIPE", 
                  desc: "Consulte o valor de mercado do seu carro",
                  color: "from-violet-500 to-purple-600",
                  href: "/tabela-fipe"
                },
                { 
                  icon: Shield, 
                  title: "Garantia", 
                  desc: "Todos os veiculos com garantia inclusa",
                  color: "from-amber-500 to-orange-600",
                  href: "/garantia"
                },
              ].map((service, idx) => (
                <Link key={idx} href={service.href}>
                  <Card className="group bg-slate-800/30 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 h-full">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">{service.title}</h3>
                      <p className="text-slate-400 text-sm">{service.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUE ESCOLHER A NACIONAL */}
        <section className="py-20 bg-gradient-to-b from-slate-900 via-blue-950/50 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                <BadgeCheck className="h-3 w-3 mr-1" /> Confie em quem entende
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Por que a Nacional Veiculos?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Somos especialistas em realizar o sonho do carro proprio com seguranca e transparencia</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "Garantia Total", desc: "Todos os veiculos com garantia e procedencia verificada", color: "blue" },
                { icon: Award, title: "15 Anos de Mercado", desc: "Experiencia e credibilidade que voce pode confiar", color: "indigo" },
                { icon: Clock, title: "Financiamento Rapido", desc: "Aprovacao em ate 24h com as melhores taxas", color: "violet" },
                { icon: Users, title: "Atendimento VIP", desc: "Equipe especializada pronta para ajudar voce", color: "amber" },
              ].map((item, idx) => (
                <Card key={idx} className="bg-slate-800/30 border-slate-700 text-center p-8 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-${item.color}-500/30`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pronto para encontrar seu proximo carro?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Fale com nossos especialistas e encontre o veiculo perfeito para voce
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/veiculos">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 shadow-xl">
                  <Car className="mr-2 h-5 w-5" />
                  Ver Estoque
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Phone className="mr-2 h-5 w-5" />
                  Falar com Vendedor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* LOCALIZACAO */}
        <section className="py-16 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <MapPin className="h-3 w-3 mr-1" /> Localizacao
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Venha nos visitar</h2>
                <p className="text-slate-400 mb-8">
                  Estamos localizados em uma regiao de facil acesso, com amplo estacionamento e estrutura completa para atende-lo da melhor forma.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Endereco</h4>
                      <p className="text-slate-400">Av. Brasil, 1500 - Centro, Sao Paulo - SP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Horario de Funcionamento</h4>
                      <p className="text-slate-400">Segunda a Sabado: 8h as 18h</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Telefone</h4>
                      <p className="text-slate-400">(11) 99999-9999</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976599489994!2d-46.65390492467461!3d-23.561414261670066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0x63b06e8e5d2500e8!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1706540000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
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
