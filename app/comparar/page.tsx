"use client"

import { useVehicle } from "@/contexts/vehicle-context"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, X, Plus, ArrowLeft, Check, Minus, Calendar, Gauge, Fuel, Cog, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useVehicle()

  const specs = [
    { label: "Preço", key: "price", format: (v: any) => formatCurrency(v.price), highlight: true },
    { label: "Ano", key: "year", format: (v: any) => v.year },
    { label: "Quilometragem", key: "mileage", format: (v: any) => v.mileage ? `${formatNumber(v.mileage)} km` : "0 km" },
    { label: "Combustível", key: "fuel_type", format: (v: any) => v.fuel_type || "-" },
    { label: "Câmbio", key: "transmission", format: (v: any) => v.transmission || "-" },
    { label: "Categoria", key: "category_name", format: (v: any) => v.category_name || "-" },
  ]

  // Find best values for comparison
  const getBestValue = (key: string) => {
    if (compareList.length < 2) return null
    if (key === "price") {
      const min = Math.min(...compareList.map(v => v.price))
      return compareList.find(v => v.price === min)?.id
    }
    if (key === "mileage") {
      const min = Math.min(...compareList.map(v => v.mileage || 0))
      return compareList.find(v => (v.mileage || 0) === min)?.id
    }
    if (key === "year") {
      const max = Math.max(...compareList.map(v => v.year))
      return compareList.find(v => v.year === max)?.id
    }
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <WhatsAppFloat />

      <main className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/veiculos" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para veículos
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="h-8 w-8 text-blue-600" />
                Comparar Veículos
              </h1>
              <p className="text-gray-600 mt-1">Compare até 3 veículos lado a lado</p>
            </div>
            {compareList.length > 0 && (
              <Button variant="outline" onClick={clearCompare}>
                Limpar Comparação
              </Button>
            )}
          </div>

          {compareList.length < 2 ? (
            <Card className="p-12 text-center">
              <Scale className="h-20 w-20 text-gray-200 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {compareList.length === 0 
                  ? "Selecione veículos para comparar" 
                  : "Adicione mais um veículo"}
              </h2>
              <p className="text-gray-500 mb-6">
                Você precisa de pelo menos 2 veículos para fazer uma comparação
              </p>
              <Button asChild>
                <Link href="/veiculos">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Veículos
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Vehicle Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareList.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white"
                      onClick={() => removeFromCompare(vehicle.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="relative aspect-[16/10] bg-gray-100">
                      {vehicle.primary_image ? (
                        <Image
                          src={vehicle.primary_image || "/placeholder.svg"}
                          alt={vehicle.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Scale className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2 bg-blue-100 text-blue-800">{vehicle.brand_name}</Badge>
                      <h3 className="font-bold text-lg">{vehicle.name}</h3>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        {formatCurrency(vehicle.price)}
                      </p>
                    </div>
                  </Card>
                ))}

                {/* Add more slot */}
                {compareList.length < 3 && (
                  <Card className="border-2 border-dashed flex flex-col items-center justify-center min-h-[300px]">
                    <Plus className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Adicionar veículo</p>
                    <Button variant="outline" asChild>
                      <Link href="/veiculos">Escolher</Link>
                    </Button>
                  </Card>
                )}
              </div>

              {/* Comparison Table */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-blue-900 text-white">
                  <h3 className="font-bold text-lg">Comparativo de Especificações</h3>
                </div>
                <div className="divide-y">
                  {specs.map((spec) => {
                    const bestId = getBestValue(spec.key)
                    return (
                      <div key={spec.key} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:hidden p-3 bg-gray-50 font-medium text-gray-700">
                          {spec.label}
                        </div>
                        {compareList.map((vehicle, index) => (
                          <div 
                            key={vehicle.id} 
                            className={`p-4 flex flex-col ${
                              index === 0 ? "md:border-r" : index === 1 && compareList.length === 3 ? "md:border-r" : ""
                            } ${bestId === vehicle.id ? "bg-green-50" : ""}`}
                          >
                            <span className="text-xs text-gray-500 mb-1 hidden md:block">{spec.label}</span>
                            <span className={`font-semibold ${spec.highlight ? "text-xl text-blue-900" : ""} flex items-center gap-2`}>
                              {spec.format(vehicle)}
                              {bestId === vehicle.id && (
                                <Badge className="bg-green-500 text-xs">Melhor</Badge>
                              )}
                            </span>
                          </div>
                        ))}
                        {compareList.length < 3 && (
                          <div className="p-4 bg-gray-50 hidden lg:block"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Ficou interessado?</h3>
                    <p className="text-blue-100">Entre em contato para mais informações ou agende uma visita</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
