"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export function VehicleFilters({ brands, categories, currentFilters }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/veiculos?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/veiculos")
  }

  const hasFilters = Object.keys(currentFilters).length > 0

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 size-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="busca">Buscar</Label>
          <Input
            id="busca"
            placeholder="Nome, marca, modelo..."
            defaultValue={currentFilters.busca || ""}
            onChange={(e) => updateFilter("busca", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select value={currentFilters.categoria || "all"} onValueChange={(value) => updateFilter("categoria", value)}>
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

        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Select value={currentFilters.marca || "all"} onValueChange={(value) => updateFilter("marca", value)}>
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

        <div className="space-y-2">
          <Label>Ano</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="De"
              defaultValue={currentFilters.ano_min || "0"}
              onChange={(e) => updateFilter("ano_min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Até"
              defaultValue={currentFilters.ano_max || "9999"}
              onChange={(e) => updateFilter("ano_max", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preço (R$)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mín"
              defaultValue={currentFilters.preco_min || "0"}
              onChange={(e) => updateFilter("preco_min", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              defaultValue={currentFilters.preco_max || "999999"}
              onChange={(e) => updateFilter("preco_max", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
