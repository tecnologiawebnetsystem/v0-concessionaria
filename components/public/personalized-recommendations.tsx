"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Eye,
  TrendingUp,
  Clock
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: string
  name: string
  brand: string
  year: number
  price: number
  image_url?: string
  slug: string
  reason?: string // "Baseado no que voce viu", "Similar ao seu favorito", etc.
}

interface PersonalizedRecommendationsProps {
  title?: string
  subtitle?: string
  className?: string
}

export function PersonalizedRecommendations({
  title = "Recomendados para voce",
  subtitle = "Baseado no seu historico de navegacao",
  className,
}: PersonalizedRecommendationsProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations")
      const data = await response.json()
      setVehicles(data.recommendations || [])
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("recommendations-scroll")
    if (!container) return

    const scrollAmount = 320
    const newPosition = direction === "left" 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount

    container.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-72 h-64 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return null // Nao mostrar se nao houver recomendacoes
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            {title}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div
        id="recommendations-scroll"
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            href={`/veiculos/${vehicle.slug}`}
            className="shrink-0 w-72"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {vehicle.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Sem imagem</span>
                  </div>
                )}

                {/* Reason badge */}
                {vehicle.reason && (
                  <Badge
                    className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm"
                  >
                    {vehicle.reason === "viewed" && <Eye className="size-3 mr-1" />}
                    {vehicle.reason === "favorite" && <Heart className="size-3 mr-1" />}
                    {vehicle.reason === "trending" && <TrendingUp className="size-3 mr-1" />}
                    {vehicle.reason === "recent" && <Clock className="size-3 mr-1" />}
                    {getReasonLabel(vehicle.reason)}
                  </Badge>
                )}

                {/* Quick actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="size-8 bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      // Toggle favorite
                    }}
                  >
                    <Heart className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">
                  {vehicle.brand} {vehicle.name}
                </h3>
                <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                <p className="text-lg font-bold text-primary mt-2">
                  {formatPrice(vehicle.price)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    viewed: "Voce viu",
    favorite: "Voce curtiu",
    trending: "Em alta",
    recent: "Novidade",
    similar: "Similar",
    price_range: "No seu orcamento",
  }
  return labels[reason] || "Recomendado"
}
