"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CepInput, type ViaCepAddress } from "@/components/ui/cep-input"
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Home,
  Building,
  Calculator,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DeliveryOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: React.ReactNode
}

interface DeliveryCalculatorProps {
  vehicleId: string
  vehicleName: string
  vehiclePrice: number
  dealershipCep?: string
  className?: string
}

export function DeliveryCalculator({
  vehicleId,
  vehicleName,
  vehiclePrice,
  dealershipCep = "12220-000", // CEP padrao da concessionaria
  className,
}: DeliveryCalculatorProps) {
  const [address, setAddress] = useState<ViaCepAddress | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [distance, setDistance] = useState<number | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculateDelivery = async (cepAddress: ViaCepAddress) => {
    setIsCalculating(true)
    setAddress(cepAddress)

    try {
      // Simular calculo de distancia (em producao, usar API de rotas)
      // Vamos estimar baseado no estado
      const sameState = cepAddress.state === "SP"
      const sameRegion = ["SP", "RJ", "MG", "ES"].includes(cepAddress.state)
      
      let estimatedDistance = 0
      if (sameState) {
        estimatedDistance = Math.floor(Math.random() * 300) + 50 // 50-350 km
      } else if (sameRegion) {
        estimatedDistance = Math.floor(Math.random() * 500) + 300 // 300-800 km
      } else {
        estimatedDistance = Math.floor(Math.random() * 1500) + 800 // 800-2300 km
      }
      
      setDistance(estimatedDistance)

      // Calcular opcoes de entrega
      const pricePerKm = 3.5 // R$ por km
      const baseDeliveryPrice = estimatedDistance * pricePerKm

      const options: DeliveryOption[] = [
        {
          id: "pickup",
          name: "Retirada na loja",
          description: "Retire o veiculo em nossa concessionaria",
          price: 0,
          estimatedDays: "Imediato",
          icon: <Building className="size-5" />,
        },
        {
          id: "standard",
          name: "Entrega padrao",
          description: `Entrega em ${cepAddress.city}, ${cepAddress.state}`,
          price: Math.round(baseDeliveryPrice),
          estimatedDays: sameState ? "3-5 dias" : sameRegion ? "5-7 dias" : "7-12 dias",
          icon: <Truck className="size-5" />,
        },
        {
          id: "express",
          name: "Entrega expressa",
          description: "Entrega prioritaria com acompanhamento",
          price: Math.round(baseDeliveryPrice * 1.5),
          estimatedDays: sameState ? "1-2 dias" : sameRegion ? "2-4 dias" : "4-7 dias",
          icon: <Package className="size-5" />,
        },
      ]

      setDeliveryOptions(options)
      setSelectedOption("pickup") // Selecionar retirada por padrao
    } catch (error) {
      toast.error("Erro ao calcular frete")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleAddressFound = (cepAddress: ViaCepAddress) => {
    calculateDelivery(cepAddress)
  }

  const selectedDelivery = deliveryOptions.find((o) => o.id === selectedOption)

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="size-5" />
          Calcular Entrega
        </CardTitle>
        <CardDescription>
          Descubra as opcoes de entrega para sua regiao
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input de CEP */}
        <div className="space-y-2">
          <CepInput
            onAddressFound={handleAddressFound}
            showAddressPreview={true}
            label="Digite seu CEP"
          />
        </div>

        {/* Loading */}
        {isCalculating && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <span className="ml-3">Calculando opcoes de entrega...</span>
          </div>
        )}

        {/* Resultado */}
        {deliveryOptions.length > 0 && !isCalculating && (
          <>
            {/* Info da distancia */}
            {distance && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="size-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {address?.city}, {address?.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aproximadamente {distance} km da concessionaria
                  </p>
                </div>
              </div>
            )}

            {/* Opcoes de entrega */}
            <div className="space-y-3">
              <Label>Opcoes de entrega</Label>
              <RadioGroup
                value={selectedOption || undefined}
                onValueChange={setSelectedOption}
              >
                {deliveryOptions.map((option) => (
                  <Label
                    key={option.id}
                    className={cn(
                      "flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedOption === option.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={option.id} className="mt-1" />
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center",
                        option.id === "pickup"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                          : option.id === "express"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                            : "bg-muted"
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{option.name}</p>
                        {option.id === "pickup" && (
                          <Badge variant="secondary" className="text-xs">
                            Gratis
                          </Badge>
                        )}
                        {option.id === "express" && (
                          <Badge className="text-xs bg-blue-600">
                            Mais rapido
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {option.estimatedDays}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {option.price === 0 ? "Gratis" : formatCurrency(option.price)}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Resumo */}
            {selectedDelivery && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valor do veiculo</span>
                  <span className="font-medium">{formatCurrency(vehiclePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Entrega ({selectedDelivery.name})</span>
                  <span className="font-medium">
                    {selectedDelivery.price === 0
                      ? "Gratis"
                      : formatCurrency(selectedDelivery.price)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(vehiclePrice + selectedDelivery.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                <span>Veiculo revisado e higienizado</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                <span>Documentacao completa</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                <span>Garantia de 90 dias</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                <span>Rastreamento em tempo real</span>
              </div>
            </div>
          </>
        )}

        {/* Estado inicial */}
        {deliveryOptions.length === 0 && !isCalculating && (
          <div className="text-center py-8 text-muted-foreground">
            <Home className="size-12 mx-auto mb-3 opacity-50" />
            <p>Digite seu CEP para ver as opcoes de entrega</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
