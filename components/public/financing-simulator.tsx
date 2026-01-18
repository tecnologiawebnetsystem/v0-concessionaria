"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingDown, Calendar, Percent, DollarSign, Info, MessageCircle, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FinancingSimulatorProps {
  vehiclePrice: number
  vehicleName: string
  vehicleSlug?: string
  onProposal?: () => void
}

const INTEREST_RATES = {
  "banco-padrao": { name: "Banco Padrão", rate: 1.99, description: "Taxa convencional" },
  "promocional": { name: "Taxa Promocional", rate: 1.49, description: "Oferta especial" },
  "consorcio": { name: "Consórcio", rate: 0.0, description: "Sem juros, com lance" },
}

const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60, 72]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function FinancingSimulator({ vehiclePrice, vehicleName, vehicleSlug, onProposal }: FinancingSimulatorProps) {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2) // 20% default
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [installments, setInstallments] = useState(48)
  const [selectedRate, setSelectedRate] = useState<keyof typeof INTEREST_RATES>("banco-padrao")
  const [showDetails, setShowDetails] = useState(false)

  const rate = INTEREST_RATES[selectedRate].rate
  const financedAmount = vehiclePrice - downPayment

  // Calculate monthly payment using PMT formula
  const calculateMonthlyPayment = () => {
    if (rate === 0) {
      return financedAmount / installments
    }
    const monthlyRate = rate / 100
    const payment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, installments)) / 
                    (Math.pow(1 + monthlyRate, installments) - 1)
    return payment
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalPaid = monthlyPayment * installments + downPayment
  const totalInterest = totalPaid - vehiclePrice

  // Update down payment when percent changes
  useEffect(() => {
    setDownPayment(vehiclePrice * (downPaymentPercent / 100))
  }, [downPaymentPercent, vehiclePrice])

  // Update percent when down payment changes
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value)
    setDownPaymentPercent(Math.round((value / vehiclePrice) * 100))
  }

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Simulador de Financiamento
        </CardTitle>
        <CardDescription className="text-blue-100">
          Simule as condições de pagamento para {vehicleName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Vehicle Price Display */}
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Valor do Veículo</p>
          <p className="text-3xl font-bold text-blue-900">{formatCurrency(vehiclePrice)}</p>
        </div>

        {/* Interest Rate Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-gray-500" />
            Tipo de Financiamento
          </Label>
          <Tabs value={selectedRate} onValueChange={(v) => setSelectedRate(v as keyof typeof INTEREST_RATES)}>
            <TabsList className="grid w-full grid-cols-3">
              {Object.entries(INTEREST_RATES).map(([key, value]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {value.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(INTEREST_RATES).map(([key, value]) => (
              <TabsContent key={key} value={key} className="mt-2">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-600">{value.description}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {value.rate === 0 ? "Sem juros" : `${value.rate}% a.m.`}
                  </Badge>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-gray-500" />
              Entrada
            </Label>
            <span className="text-sm font-medium text-blue-600">{downPaymentPercent}%</span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={([value]) => setDownPaymentPercent(value)}
            min={0}
            max={70}
            step={5}
            className="w-full"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
              <Input
                type="number"
                value={Math.round(downPayment)}
                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Valor financiado: <span className="font-semibold">{formatCurrency(financedAmount)}</span>
          </p>
        </div>

        {/* Installments */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Parcelas
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {INSTALLMENT_OPTIONS.map((opt) => (
              <Button
                key={opt}
                variant={installments === opt ? "default" : "outline"}
                size="sm"
                onClick={() => setInstallments(opt)}
                className={installments === opt ? "bg-blue-600" : ""}
              >
                {opt}x
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">Parcela mensal de</p>
            <p className="text-4xl font-bold text-green-700">{formatCurrency(monthlyPayment)}</p>
            <p className="text-sm text-gray-500">em {installments}x</p>
          </div>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            <Info className="h-4 w-4" />
            {showDetails ? "Ocultar detalhes" : "Ver detalhes do financiamento"}
          </button>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-green-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Entrada:</span>
                <span className="font-medium">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor financiado:</span>
                <span className="font-medium">{formatCurrency(financedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de juros:</span>
                <span className="font-medium text-orange-600">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600 font-semibold">Total a pagar:</span>
                <span className="font-bold text-blue-900">{formatCurrency(totalPaid)}</span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
                <MessageCircle className="h-5 w-5 mr-2" />
                Simular no WhatsApp
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar simulação por WhatsApp</DialogTitle>
                <DialogDescription>
                  Um consultor irá entrar em contato para finalizar sua simulação
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Veículo:</strong> {vehicleName}</p>
                  <p><strong>Valor:</strong> {formatCurrency(vehiclePrice)}</p>
                  <p><strong>Entrada:</strong> {formatCurrency(downPayment)} ({downPaymentPercent}%)</p>
                  <p><strong>Parcelas:</strong> {installments}x de {formatCurrency(monthlyPayment)}</p>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const message = `Olá! Gostaria de mais informações sobre o financiamento:\n\n*Veículo:* ${vehicleName}\n*Valor:* ${formatCurrency(vehiclePrice)}\n*Entrada:* ${formatCurrency(downPayment)} (${downPaymentPercent}%)\n*Parcelas:* ${installments}x de ${formatCurrency(monthlyPayment)}\n\nPode me ajudar?`
                    window.open(`https://wa.me/5511987654321?text=${encodeURIComponent(message)}`, "_blank")
                  }}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Abrir WhatsApp
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="w-full h-12 text-base bg-transparent"
            onClick={onProposal}
          >
            <FileText className="h-5 w-5 mr-2" />
            Enviar Proposta Online
          </Button>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          * Simulação meramente ilustrativa. Valores sujeitos a análise de crédito e aprovação. 
          Taxas podem variar de acordo com o perfil do cliente.
        </p>
      </CardContent>
    </Card>
  )
}
