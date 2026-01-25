"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  SlidersHorizontal,
  Car,
  Fuel,
  Calendar,
  Gauge,
  Heart,
  ChevronRight,
  Grid3X3,
  List,
  X,
  Sparkles,
  ArrowUpDown,
} from "lucide-react"

interface Vehicle {
  id: string
  name: string
  slug: string
  brand_name: string
  category_name: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  primary_image: string
  is_featured: boolean
  condition: string
}

interface VehiclesPageClientProps {
  vehicles: Vehicle[]
  brands: any[]
  categories: any[]
  currentFilters: any
}

export function VehiclesPageClient({ vehicles, brands, categories, currentFilters }: VehiclesPageClientProps) {
  const [search, setSearch] = useState(currentFilters.busca || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState(currentFilters.ordenar || "")
  const [priceRange, setPriceRange] = useState([0, 500000])

  const filteredVehicles = vehicles.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && 
        !v.brand_name?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case "menor-preco": return a.price - b.price
      case "maior-preco": return b.price - a.price
      case "mais-novo": return b.year - a.year
      case "menor-km": return a.mileage - b.mileage
      default: return 0
    }
  })

  return (
    <main className="flex-1" id="main-content">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-cyan-600/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Sparkles className="size-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">{vehicles.length} veiculos disponiveis</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Encontre seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Veiculo Ideal</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explore nossa colecao de veiculos seminovos e 0km com as melhores condicoes de financiamento.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                <Input
                  placeholder="Buscar por marca, modelo ou ano..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 pl-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 rounded-xl"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="lg:hidden h-14 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700">
                    <SlidersHorizontal className="size-5 text-slate-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-slate-900 border-slate-700 p-0">
                  <SheetHeader className="p-4 border-b border-slate-700">
                    <SheetTitle className="text-white">Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 space-y-6">
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-2 block">Marca</label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Todas as marcas" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">Todas as marcas</SelectItem>
                          {brands.map(b => (
                            <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-2 block">Categoria</label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400 mb-4 block">
                        Faixa de Preco: R$ {priceRange[0].toLocaleString()} - R$ {priceRange[1].toLocaleString()}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500000}
                        step={10000}
                        className="py-4"
                      />
                    </div>
                    
                    <SheetClose asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                        Aplicar Filtros
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-slate-400">
              <span className="text-white font-semibold">{sortedVehicles.length}</span> veiculos encontrados
            </p>
            
            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white">
                  <ArrowUpDown className="size-4 mr-2 text-slate-500" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="relevancia">Relevancia</SelectItem>
                  <SelectItem value="menor-preco">Menor Preco</SelectItem>
                  <SelectItem value="maior-preco">Maior Preco</SelectItem>
                  <SelectItem value="mais-novo">Mais Novo</SelectItem>
                  <SelectItem value="menor-km">Menor KM</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Toggle */}
              <div className="hidden lg:flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Filters + Grid */}
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Filtros</h3>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 h-auto p-0">
                    Limpar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Marca</label>
                    <Select>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue placeholder="Todas as marcas" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">Todas as marcas</SelectItem>
                        {brands.map(b => (
                          <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Categoria</label>
                    <Select>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map(c => (
                          <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Combustivel</label>
                    <Select>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="gasolina">Gasolina</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="eletrico">Eletrico</SelectItem>
                        <SelectItem value="hibrido">Hibrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-2 block">Cambio</label>
                    <Select>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="automatico">Automatico</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-400 mb-4 block">
                      Faixa de Preco
                    </label>
                    <div className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500000}
                        step={10000}
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>R$ {priceRange[0].toLocaleString()}</span>
                        <span>R$ {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
                  Aplicar Filtros
                </Button>
              </div>
            </aside>

            {/* Vehicles Grid */}
            <div className="flex-1">
              {sortedVehicles.length > 0 ? (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {sortedVehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
                      <Card className={`group bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                        {/* Image */}
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[4/3]"}`}>
                          <Image
                            src={vehicle.primary_image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop"}
                            alt={vehicle.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {vehicle.is_featured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                                <Sparkles className="size-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                            {vehicle.condition === "new" && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                0KM
                              </Badge>
                            )}
                          </div>
                          
                          {/* Favorite Button */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-3 right-3 size-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                            onClick={(e) => {
                              e.preventDefault()
                              // Toggle favorite
                            }}
                          >
                            <Heart className="size-4" />
                          </Button>
                        </div>

                        {/* Content */}
                        <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-blue-400 font-medium">{vehicle.brand_name}</p>
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                {vehicle.name}
                              </h3>
                            </div>
                          </div>
                          
                          {/* Specs */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {vehicle.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="size-3" />
                              {vehicle.mileage?.toLocaleString()} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="size-3" />
                              {vehicle.fuel_type}
                            </span>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-slate-500">A partir de</p>
                              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                R$ {vehicle.price?.toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                              Ver mais
                              <ChevronRight className="size-4 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Car className="size-16 mx-auto text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum veiculo encontrado</h3>
                  <p className="text-slate-400 mb-6">Tente ajustar os filtros para encontrar o que procura.</p>
                  <Button 
                    variant="outline" 
                    className="border-slate-700 text-white hover:bg-slate-800 bg-transparent"
                    onClick={() => setSearch("")}
                  >
                    Limpar busca
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
