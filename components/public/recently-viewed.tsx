"use client"

import { useVehicle } from "@/contexts/vehicle-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function RecentlyViewed() {
  const { recentlyViewed, addFavorite, removeFavorite, isFavorite } = useVehicle()

  if (recentlyViewed.length === 0) return null

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Vistos Recentemente</h2>
          </div>
          <Link href="/veiculos" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recentlyViewed.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="flex-shrink-0 w-64 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <Link href={`/veiculos/${vehicle.slug}`}>
                <div className="relative aspect-[4/3] bg-gray-100">
                  {vehicle.primary_image ? (
                    <Image
                      src={vehicle.primary_image || "/placeholder.svg"}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Clock className="h-12 w-12" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      if (isFavorite(vehicle.id)) {
                        removeFavorite(vehicle.id)
                      } else {
                        addFavorite(vehicle)
                      }
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite(vehicle.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
                    />
                  </Button>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs font-medium text-blue-600">{vehicle.brand_name}</p>
                <h3 className="font-semibold text-sm truncate">{vehicle.name}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{vehicle.year}</span>
                  <span>•</span>
                  <span>{vehicle.mileage ? `${(vehicle.mileage / 1000).toFixed(0)}k km` : "0 km"}</span>
                </div>
                <p className="font-bold text-blue-900 mt-2">{formatCurrency(vehicle.price)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
