"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { History, ArrowRight, Eye, Calendar, Gauge, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CustomerHistoryPage() {
  const { data: history, isLoading, mutate } = useSWR<any[]>("/api/customer/history", fetcher)

  const clearHistory = async () => {
    await fetch("/api/customer/history", { method: "DELETE" })
    mutate([])
    toast({ title: "Histórico limpo com sucesso." })
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    })

  const groupedHistory = (history ?? []).reduce((groups: Record<string, any[]>, vehicle) => {
    const date = new Date(vehicle.viewed_at).toLocaleDateString("pt-BR")
    if (!groups[date]) groups[date] = []
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
        {(history?.length ?? 0) > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Histórico
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : (history?.length ?? 0) > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, vehicles]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {date}
              </h3>
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{vehicle.brand} {vehicle.name}</h4>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {vehicle.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" />
                              {vehicle.mileage?.toLocaleString()} km
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary">{formatCurrency(vehicle.price)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(vehicle.viewed_at)}</p>
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
    </div>
  )
}
