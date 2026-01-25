"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Car, ArrowRight, Trash2, Calendar, Gauge, Fuel } from "lucide-react"
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
}

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<Vehicle[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("vehicle_favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch {
        setFavorites([])
      }
    }
  }, [])

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter((v) => v.id !== id)
    setFavorites(newFavorites)
    localStorage.setItem("vehicle_favorites", JSON.stringify(newFavorites))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Favoritos</h1>
          <p className="text-slate-400">Veiculos que voce salvou para ver depois</p>
        </div>
        <Link href="/veiculos">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Car className="mr-2 h-4 w-4" />
            Ver Estoque
          </Button>
        </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden group bg-slate-800/50 border-slate-700">
              <div className="relative aspect-video">
                <Image
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFavorite(vehicle.id)}
                  type="button"
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-red-500/80 transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-400 fill-red-400" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-white">{vehicle.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
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
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(vehicle.price)}
                  </p>
                  <Link href={`/veiculos/${vehicle.slug}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-semibold mb-2 text-white">Nenhum veiculo favorito</h3>
            <p className="text-slate-400 mb-4">
              Adicione veiculos aos favoritos clicando no coracao ao navegar pelo estoque.
            </p>
            <Link href="/veiculos">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explorar Veiculos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {favorites.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            onClick={() => {
              setFavorites([])
              localStorage.removeItem("vehicle_favorites")
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Todos os Favoritos
          </Button>
        </div>
      )}
    </div>
  )
}
