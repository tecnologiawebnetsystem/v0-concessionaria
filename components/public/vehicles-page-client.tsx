"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { AISearch } from "@/components/public/ai-search"
import {
  Search, SlidersHorizontal, Car, Fuel, Calendar, Gauge,
  Heart, ArrowRight, Grid3X3, List, X, Sparkles, Star,
  ChevronDown, ChevronUp, Check,
} from "lucide-react"

interface Vehicle {
  id: string; name: string; slug: string; brand_name: string
  category_name: string; year: number; is_new: boolean
  price: number; mileage: number; fuel_type: string; transmission: string
  primary_image: string; is_featured: boolean
}

interface VehiclesPageClientProps {
  vehicles: Vehicle[]; brands: any[]; categories: any[]; currentFilters: any
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
}

function VehicleCard({ vehicle, view }: { vehicle: Vehicle; view: "grid" | "list" }) {
  const [fav, setFav] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  if (view === "list") {
    return (
      <Link href={`/veiculos/${vehicle.slug}`} className="group block">
        <article className="flex gap-4 bg-card rounded-2xl border border-border hover:border-primary/30 overflow-hidden hover-lift transition-colors p-3">
          <div className="relative w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
            {vehicle.primary_image && !imgErr ? (
              <Image src={vehicle.primary_image} alt={vehicle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Car className="h-8 w-8 text-muted-foreground/30" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0 py-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{vehicle.brand_name}</p>
                <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-primary transition-colors truncate">{vehicle.name}</h3>
              </div>
              <p className="font-display font-bold text-primary text-lg flex-shrink-0">{formatCurrency(vehicle.price)}</p>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vehicle.year}</span>
              <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{vehicle.mileage > 0 ? `${Number(vehicle.mileage).toLocaleString("pt-BR")} km` : "0 km"}</span>
              <span className="flex items-center gap-1 capitalize"><Fuel className="h-3.5 w-3.5" />{vehicle.fuel_type || "—"}</span>
              <span>{vehicle.transmission || "—"}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/veiculos/${vehicle.slug}`} className="group block">
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover-lift hover:border-primary/30 transition-colors duration-300">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {vehicle.primary_image && !imgErr ? (
            <Image src={vehicle.primary_image} alt={vehicle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgErr(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
              <Car className="h-14 w-14 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {vehicle.is_featured && <span className="badge-featured flex items-center gap-1"><Star className="h-3 w-3 fill-amber-500" /> Destaque</span>}
            {vehicle.is_new && <span className="badge-new">0 KM</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); setFav(f => !f) }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform" aria-label="Favoritar">
            <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-display font-bold text-lg drop-shadow">{formatCurrency(vehicle.price)}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">{vehicle.brand_name}</p>
          <h3 className="font-display font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">{vehicle.name}</h3>
          <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vehicle.year}</span>
            {vehicle.mileage !== undefined && <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{vehicle.mileage > 0 ? `${Number(vehicle.mileage).toLocaleString("pt-BR")} km` : "0 km"}</span>}
            {vehicle.fuel_type && <span className="flex items-center gap-1 capitalize"><Fuel className="h-3.5 w-3.5" />{vehicle.fuel_type}</span>}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{vehicle.transmission || "Consulte"}</span>
            <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Ver detalhes <ArrowRight className="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border last:border-0 py-4">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-colors">
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function VehiclesPageClient({ vehicles, brands, categories, currentFilters }: VehiclesPageClientProps) {
  const [search, setSearch] = useState(currentFilters.busca || "")
  const [aiMode, setAiMode] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState(currentFilters.ordenar || "relevancia")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.marca ? [currentFilters.marca] : [])
  const [selectedFuel, setSelectedFuel] = useState<string[]>([])
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])

  const maxPrice = useMemo(() => Math.max(...vehicles.map(v => Number(v.price)), 500000), [vehicles])

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      if (search && !v.name?.toLowerCase().includes(search.toLowerCase()) && !v.brand_name?.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedBrands.length > 0 && !selectedBrands.includes(String((v as any).brand_id || v.brand_name))) return false
      if (Number(v.price) < priceRange[0] || Number(v.price) > priceRange[1]) return false
      if (selectedFuel.length > 0 && !selectedFuel.includes(v.fuel_type?.toLowerCase())) return false
      if (selectedTransmission.length > 0 && !selectedTransmission.includes(v.transmission?.toLowerCase())) return false
      return true
    })
  }, [vehicles, search, selectedBrands, priceRange, selectedFuel, selectedTransmission])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "menor-preco": return Number(a.price) - Number(b.price)
        case "maior-preco": return Number(b.price) - Number(a.price)
        case "mais-novo": return b.year - a.year
        case "menor-km": return Number(a.mileage) - Number(b.mileage)
        default: return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
      }
    })
  }, [filtered, sortBy])

  const activeFiltersCount = selectedBrands.length + selectedFuel.length + selectedTransmission.length + (priceRange[1] < maxPrice ? 1 : 0)

  const clearFilters = () => {
    setSelectedBrands([]); setSelectedFuel([]); setSelectedTransmission([]); setPriceRange([0, maxPrice]); setSearch("")
  }

  const fuelTypes = [...new Set(vehicles.map(v => v.fuel_type?.toLowerCase()).filter(Boolean))]
  const transmissions = [...new Set(vehicles.map(v => v.transmission?.toLowerCase()).filter(Boolean))]

  const FilterPanel = () => (
    <div className="space-y-0">
      {/* Header painel */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-1">
        <h2 className="font-display font-bold text-foreground">Filtros</h2>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X className="h-3.5 w-3.5" /> Limpar ({activeFiltersCount})
          </button>
        )}
      </div>

      <FilterSection title="Preco">
        <div className="space-y-3">
          <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={maxPrice} step={5000} className="w-full" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Marca">
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {brands.map((b: any) => (
            <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(String(b.id)) ? "bg-primary border-primary" : "border-border group-hover:border-primary"}`}>
                {selectedBrands.includes(String(b.id)) && <Check className="h-2.5 w-2.5 text-white" />}
              </div>
              <input type="checkbox" className="sr-only" checked={selectedBrands.includes(String(b.id))} onChange={() => toggleFilter(selectedBrands, setSelectedBrands, String(b.id))} />
              <span className="text-sm text-foreground">{b.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {fuelTypes.length > 0 && (
        <FilterSection title="Combustivel">
          <div className="flex flex-wrap gap-2">
            {fuelTypes.map((f) => (
              <button key={f} onClick={() => toggleFilter(selectedFuel, setSelectedFuel, f!)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${selectedFuel.includes(f!) ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                {f}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {transmissions.length > 0 && (
        <FilterSection title="Cambio" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {transmissions.map((t) => (
              <button key={t} onClick={() => toggleFilter(selectedTransmission, setSelectedTransmission, t!)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${selectedTransmission.includes(t!) ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                {t}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  )

  return (
    <main className="flex-1 bg-background" id="main-content">
      {/* Hero compacto */}
      <section className="bg-gray-950 pt-10 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            {sorted.length > 0 ? `${sorted.length} veiculos encontrados` : "Nosso estoque"}
          </h1>

          {/* Toggle Busca */}
          <div className="max-w-3xl">
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 mb-4 w-fit">
              <button onClick={() => setAiMode(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!aiMode ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>
                <Search className="h-3.5 w-3.5" /> Filtros
              </button>
              <button onClick={() => setAiMode(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${aiMode ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}>
                <Sparkles className="h-3.5 w-3.5" /> Busca com IA
              </button>
            </div>

            {aiMode ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                <AISearch />
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por marca ou modelo..."
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
                  />
                </div>
                {/* Filtros mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-12 px-4 border-white/10 text-white hover:bg-white/10 bg-transparent rounded-xl relative md:hidden">
                      <SlidersHorizontal className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">{activeFiltersCount}</span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-[#0d0d0d] border-r border-white/10 p-6 overflow-y-auto">
                    <SheetTitle className="sr-only">Filtros</SheetTitle>
                    <FilterPanel />
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Layout principal: sidebar + grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar sticky — desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-5 shadow-card">
              <FilterPanel />
            </div>
          </aside>

          {/* Conteudo */}
          <div className="flex-1 min-w-0">
            {/* Barra de ordenacao */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{sorted.length}</span> veiculos
                {activeFiltersCount > 0 && <span className="text-primary ml-1">(filtrado)</span>}
              </p>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-44 text-sm rounded-xl border-border">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Mais relevantes</SelectItem>
                    <SelectItem value="menor-preco">Menor preco</SelectItem>
                    <SelectItem value="maior-preco">Maior preco</SelectItem>
                    <SelectItem value="mais-novo">Mais novos</SelectItem>
                    <SelectItem value="menor-km">Menor KM</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"} transition-colors`} aria-label="Grade">
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"} transition-colors`} aria-label="Lista">
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedBrands.map(id => {
                  const b = brands.find((br: any) => String(br.id) === id)
                  return b ? (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      {b.name} <button onClick={() => toggleFilter(selectedBrands, setSelectedBrands, id)}><X className="h-3 w-3" /></button>
                    </span>
                  ) : null
                })}
                {selectedFuel.map(f => (
                  <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 capitalize">
                    {f} <button onClick={() => toggleFilter(selectedFuel, setSelectedFuel, f)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Grid / lista */}
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Car className="h-14 w-14 text-muted-foreground/30 mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Nenhum veiculo encontrado</h3>
                <p className="text-muted-foreground text-sm mb-6">Tente ajustar os filtros ou buscar por outro termo.</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-xl">Limpar filtros</Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
                {sorted.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} view={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
