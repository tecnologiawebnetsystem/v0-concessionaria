"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Car, ArrowRight, Eye, Calendar, Gauge, Fuel, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Vehicle {
  id: string
  name: string
  slug: string
  price: number
  year: number
  mileage: number
  fuel_type: string
  image: string
  viewedAt: string
}

export default function CustomerHistoryPage() {
  const [history, setHistory] = useState<Vehicle[]>([])

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = localStorage.getItem("viewed_vehicles")
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory))
      } catch {
        setHistory([])
      }
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("viewed_vehicles")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Group by date
  const groupedHistory = history.reduce((groups: Record<string, Vehicle[]>, vehicle) => {
    const date = new Date(vehicle.viewedAt).toLocaleDateString("pt-BR")
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(vehicle)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Visualizações</h1>
          <p className="text-muted-foreground">Veículos que você visitou recentemente</p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Histórico
          </Button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, vehicles]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {date}
              </h3>
              <div className="space-y-3">
                {vehicles.map((vehicle, index) => (
                  <Card key={`${vehicle.id}-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{vehicle.name}</h4>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {vehicle.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" />
                              {vehicle.mileage?.toLocaleString()} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-3 w-3" />
                              {vehicle.fuel_type}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{formatCurrency(vehicle.price)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(vehicle.viewedAt)}
                          </p>
                        </div>
                        <Link href={`/veiculos/${vehicle.slug}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhum veículo visualizado</h3>
            <p className="text-muted-foreground mb-4">
              Navegue pelo nosso estoque e seu histórico aparecerá aqui.
            </p>
            <Link href="/veiculos">
              <Button>
                Explorar Veículos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            O histórico é salvo localmente no seu navegador e mostra os últimos 20 veículos visualizados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
