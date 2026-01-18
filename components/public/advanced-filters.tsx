"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X, Filter, Search, Calculator, Fuel, Cog, Calendar, Gauge, Palette, DollarSign, Bell, Loader2 } from "lucide-react"

const FUEL_TYPES = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"]
const TRANSMISSION_TYPES = ["Automático", "Manual", "CVT", "Automatizado"]
const COLORS = [
  { name: "Preto", value: "preto", color: "#000000" },
  { name: "Branco", value: "branco", color: "#FFFFFF" },
  { name: "Prata", value: "prata", color: "#C0C0C0" },
  { name: "Cinza", value: "cinza", color: "#808080" },
  { name: "Vermelho", value: "vermelho", color: "#EF4444" },
  { name: "Azul", value: "azul", color: "#3B82F6" },
  { name: "Verde", value: "verde", color: "#22C55E" },
  { name: "Marrom", value: "marrom", color: "#78350F" },
]

interface AdvancedFiltersProps {
  brands: any[]
  categories: any[]
  currentFilters: any
}

export function AdvancedFilters({ brands, categories, currentFilters }: AdvancedFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Local state for smoother UX
  const [priceRange, setPriceRange] = useState([
    Number(currentFilters.preco_min) || 0,
    Number(currentFilters.preco_max) || 500000
  ])
  const [monthlyPayment, setMonthlyPayment] = useState(currentFilters.parcela || "")
  const [showAlert, setShowAlert] = useState(false)

  const updateFilter = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/veiculos?${params.toString()}`)
    })
  }

  const updateMultipleFilters = (filters: Record<string, string>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.push(`/veiculos?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push("/veiculos")
      setPriceRange([0, 500000])
      setMonthlyPayment("")
    })
  }

  const handlePriceRangeCommit = (values: number[]) => {
    updateMultipleFilters({
      preco_min: values[0].toString(),
      preco_max: values[1].toString()
    })
  }

  const handleMonthlyPaymentSearch = () => {
    if (monthlyPayment) {
      // Convert monthly payment to price range (assuming 48 months)
      const maxPrice = Number(monthlyPayment) * 48
      updateMultipleFilters({
        preco_max: maxPrice.toString(),
        parcela: monthlyPayment
      })
    }
  }

  const activeFiltersCount = Object.keys(currentFilters).filter(k => 
    currentFilters[k] && currentFilters[k] !== "all" && k !== "ordenar"
  ).length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-600">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
              <X className="mr-1 size-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">Filtrando...</span>
          </div>
        )}

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="busca" className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            Buscar
          </Label>
          <Input
            id="busca"
            placeholder="Nome, marca, modelo..."
            defaultValue={currentFilters.busca || ""}
            onChange={(e) => updateFilter("busca", e.target.value)}
          />
        </div>

        {/* Monthly Payment Search - NEW! */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4 pb-3">
            <Label className="flex items-center gap-2 text-blue-900 font-semibold mb-3">
              <Calculator className="h-4 w-4" />
              Buscar por Parcela
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                <Input
                  type="number"
                  placeholder="Quanto pode pagar?"
                  className="pl-9"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                />
              </div>
              <Button onClick={handleMonthlyPaymentSearch} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Buscar
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Encontre carros que cabem no seu bolso</p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={["basico", "preco"]} className="space-y-2">
          {/* Basic Filters */}
          <AccordionItem value="basico" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              Filtros Básicos
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Categoria</Label>
                <Select 
                  value={currentFilters.categoria || "all"} 
                  onValueChange={(value) => updateFilter("categoria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Marca</Label>
                <Select 
                  value={currentFilters.marca || "all"} 
                  onValueChange={(value) => updateFilter("marca", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {brands.map((brand: any) => (
                      <SelectItem key={brand.id} value={brand.slug}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Ano
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="De"
                    defaultValue={currentFilters.ano_min || ""}
                    onChange={(e) => updateFilter("ano_min", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Até"
                    defaultValue={currentFilters.ano_max || ""}
                    onChange={(e) => updateFilter("ano_max", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="preco" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Faixa de Preço
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-blue-900">{formatCurrency(priceRange[0])}</span>
                  <span className="font-medium text-blue-900">{formatCurrency(priceRange[1])}</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={handlePriceRangeCommit}
                  max={500000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    onBlur={() => handlePriceRangeCommit(priceRange)}
                  />
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    onBlur={() => handlePriceRangeCommit(priceRange)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Specifications */}
          <AccordionItem value="specs" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              Especificações
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {/* Fuel Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-gray-500">
                  <Fuel className="h-3 w-3" />
                  Combustível
                </Label>
                <Select 
                  value={currentFilters.combustivel || "all"} 
                  onValueChange={(value) => updateFilter("combustivel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {FUEL_TYPES.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-gray-500">
                  <Cog className="h-3 w-3" />
                  Câmbio
                </Label>
                <Select 
                  value={currentFilters.cambio || "all"} 
                  onValueChange={(value) => updateFilter("cambio", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {TRANSMISSION_TYPES.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-gray-500">
                  <Gauge className="h-3 w-3" />
                  Quilometragem
                </Label>
                <Select 
                  value={currentFilters.km || "all"} 
                  onValueChange={(value) => updateFilter("km", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Qualquer</SelectItem>
                    <SelectItem value="0km">0 km (Novo)</SelectItem>
                    <SelectItem value="30000">Até 30.000 km</SelectItem>
                    <SelectItem value="60000">Até 60.000 km</SelectItem>
                    <SelectItem value="100000">Até 100.000 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Color */}
          <AccordionItem value="cor" className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                Cor
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateFilter("cor", currentFilters.cor === color.value ? "all" : color.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      currentFilters.cor === color.value 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border shadow-sm"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-[10px] text-gray-600">{color.name}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Alert for new vehicles */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4 pb-3">
            <button 
              onClick={() => setShowAlert(!showAlert)}
              className="flex items-center gap-2 text-amber-800 font-semibold w-full"
            >
              <Bell className="h-4 w-4" />
              Alerta de Novos Veículos
            </button>
            {showAlert && (
              <div className="mt-3 space-y-2">
                <Input placeholder="Seu e-mail" type="email" />
                <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                  Receber Alertas
                </Button>
                <p className="text-xs text-amber-700">
                  Receba uma notificação quando chegar um veículo com esses filtros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
