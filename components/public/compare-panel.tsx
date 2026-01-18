"use client"

import { useState } from "react"
import { useVehicle } from "@/contexts/vehicle-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, X, Trash2, ArrowRight } from "lucide-react"
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

export function ComparePanel() {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useVehicle()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Scale className="h-5 w-5" />
          {compareCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-xs">
              {compareCount}
            </Badge>
          )}
          <span className="sr-only">Comparar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Comparar Veículos
          </SheetTitle>
          <SheetDescription>
            {compareCount === 0
              ? "Adicione veículos para comparar"
              : `${compareCount} de 3 veículos selecionados`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {compareList.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum veículo para comparar</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione até 3 veículos para comparar lado a lado
              </p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setOpen(false)} asChild>
                <Link href="/veiculos">Ver Veículos</Link>
              </Button>
            </div>
          ) : (
            <>
              {compareList.map((vehicle) => (
                <Card key={vehicle.id} className="p-3 flex gap-3">
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
                        <Scale className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-600">{vehicle.brand_name}</p>
                    <h4 className="font-semibold text-sm truncate">{vehicle.name}</h4>
                    <p className="text-xs text-gray-500">{vehicle.year} • {vehicle.fuel_type}</p>
                    <p className="font-bold text-blue-900 text-sm mt-1">
                      {formatCurrency(vehicle.price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 flex-shrink-0"
                    onClick={() => removeFromCompare(vehicle.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Card>
              ))}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={clearCompare}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={compareCount < 2}
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link href="/comparar">
                    Comparar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
