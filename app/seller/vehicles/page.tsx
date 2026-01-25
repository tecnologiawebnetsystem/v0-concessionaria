"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Car,
  Search,
  Eye,
  Calendar,
  Fuel,
  Gauge,
  DollarSign,
  Heart,
  Share2,
  MessageCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SellerVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, featured: 0, new_vehicles: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/admin/vehicles")
      const data = await res.json()
      setVehicles(data.vehicles || [])
      setStats({
        total: data.vehicles?.length || 0,
        featured: data.vehicles?.filter((v: any) => v.is_featured).length || 0,
        new_vehicles: data.vehicles?.filter((v: any) => v.is_new).length || 0
      })
    } catch (error) {
      console.error("Erro ao carregar veiculos:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatNumber = (value: number) => 
    new Intl.NumberFormat("pt-BR").format(value)

  const filteredVehicles = vehicles.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.model?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Veiculos Disponiveis</h1>
          <p className="text-slate-400">Catalogo de veiculos disponiveis para venda</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Disponivel</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Car className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-blue-200">veiculos no estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Em Destaque</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Eye className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.featured}</div>
            <p className="text-sm text-amber-200">veiculos destacados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Novos (0km)</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Car className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.new_vehicles}</div>
            <p className="text-sm text-emerald-200">veiculos 0km</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            <Input 
              placeholder="Buscar por nome, marca ou modelo..." 
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de Veiculos */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
              <div className="aspect-[16/10] bg-slate-700" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-6 bg-slate-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Car className="size-16 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">Nenhum veiculo encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle: any) => (
            <Card key={vehicle.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
              {/* Imagem */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                {vehicle.primary_image ? (
                  <img 
                    src={vehicle.primary_image || "/placeholder.svg"} 
                    alt={vehicle.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="size-16 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {vehicle.is_featured && (
                    <Badge className="bg-amber-500/90 text-white border-0">Destaque</Badge>
                  )}
                  {vehicle.is_new && (
                    <Badge className="bg-emerald-500/90 text-white border-0">0km</Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button size="icon" variant="ghost" className="size-8 bg-black/40 hover:bg-black/60 text-white">
                    <Heart className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 bg-black/40 hover:bg-black/60 text-white">
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Nome e Marca */}
                <div className="mb-3">
                  <p className="text-sm text-blue-400">{vehicle.brand_name}</p>
                  <h3 className="font-semibold text-lg text-white line-clamp-1">{vehicle.name}</h3>
                  <p className="text-sm text-slate-400">{vehicle.model}</p>
                </div>

                {/* Especificacoes */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="size-4 text-slate-500" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Gauge className="size-4 text-slate-500" />
                    <span>{formatNumber(vehicle.mileage || 0)} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Fuel className="size-4 text-slate-500" />
                    <span>{vehicle.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Car className="size-4 text-slate-500" />
                    <span>{vehicle.transmission || 'N/A'}</span>
                  </div>
                </div>

                {/* Preco e Acoes */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">Preco</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {formatCurrency(Number(vehicle.price))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                      <Link href={`/veiculos/${vehicle.slug}`} target="_blank">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <MessageCircle className="size-4 mr-1" />
                      Vender
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
