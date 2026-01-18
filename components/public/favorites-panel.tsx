"use client"

import { useState } from "react"
import { useVehicle } from "@/contexts/vehicle-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function FavoritesPanel() {
  const { favorites, removeFavorite, favoritesCount } = useVehicle()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
              {favoritesCount}
            </Badge>
          )}
          <span className="sr-only">Favoritos</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Meus Favoritos
          </SheetTitle>
          <SheetDescription>
            {favoritesCount === 0
              ? "Você ainda não tem veículos favoritos"
              : `${favoritesCount} veículo${favoritesCount > 1 ? "s" : ""} salvo${favoritesCount > 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum favorito ainda</p>
              <p className="text-sm text-gray-400 mt-1">
                Clique no coração nos veículos para salvá-los aqui
              </p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setOpen(false)} asChild>
                <Link href="/veiculos">Ver Veículos</Link>
              </Button>
            </div>
          ) : (
            favorites.map((vehicle) => (
              <Card key={vehicle.id} className="p-3 flex gap-3 group">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {vehicle.primary_image ? (
                    <Image
                      src={vehicle.primary_image || "/placeholder.svg"}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Heart className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-600">{vehicle.brand_name}</p>
                  <h4 className="font-semibold text-sm truncate">{vehicle.name}</h4>
                  <p className="text-xs text-gray-500">{vehicle.year}</p>
                  <p className="font-bold text-blue-900 text-sm mt-1">
                    {formatCurrency(vehicle.price)}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                    onClick={() => removeFavorite(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-blue-600"
                    onClick={() => setOpen(false)}
                    asChild
                  >
                    <Link href={`/veiculos/${vehicle.slug}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
