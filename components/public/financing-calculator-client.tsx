"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Clock, Percent, MessageCircle, Check } from "lucide-react"
import Link from "next/link"

interface FinancingCalculatorClientProps {
  vehiclePrice: number
  vehicleName: string
}

export function FinancingCalculatorClient({ vehiclePrice, vehicleName }: FinancingCalculatorClientProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(30)
  const [months, setMonths] = useState(48)
  const [interestRate] = useState(1.49) // Taxa mensal

  const calculations = useMemo(() => {
    const downPayment = (vehiclePrice * downPaymentPercent) / 100
    const financedAmount = vehiclePrice - downPayment
    
    // Calculo Price (parcelas fixas)
    const monthlyRate = interestRate / 100
    const coefficient = (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const monthlyPayment = financedAmount * coefficient
    
    const totalPaid = downPayment + (monthlyPayment * months)
    const totalInterest = totalPaid - vehiclePrice

    return {
      downPayment,
      financedAmount,
      monthlyPayment,
      totalPaid,
      totalInterest
    }
  }, [vehiclePrice, downPaymentPercent, months, interestRate])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Calculator className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">Simule o Financiamento</CardTitle>
              <p className="text-sm text-slate-500">Calcule suas parcelas em segundos</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            98% Aprovacao
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Vehicle Price Display */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Valor do veiculo</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(vehiclePrice)}</p>
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Entrada</label>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{formatCurrency(calculations.downPayment)}</span>
              <span className="text-sm text-slate-500 ml-2">({downPaymentPercent}%)</span>
            </div>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            min={0}
            max={70}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>70%</span>
          </div>
        </div>

        {/* Months Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Parcelas</label>
            <span className="text-2xl font-bold text-white">{months}x</span>
          </div>
          <Slider
            value={[months]}
            onValueChange={(value) => setMonths(value[0])}
            min={12}
            max={72}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>12x</span>
            <span>72x</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-400">Valor financiado</span>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(calculations.financedAmount)}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Parcela mensal</span>
            </div>
            <p className="text-xl font-bold text-white">{formatCurrency(calculations.monthlyPayment)}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Taxa de juros (mensal)</span>
            <span className="text-white font-medium">{interestRate}% a.m.</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total de juros</span>
            <span className="text-amber-400 font-medium">{formatCurrency(calculations.totalInterest)}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-slate-700">
            <span className="text-slate-300 font-medium">Total a pagar</span>
            <span className="text-white font-bold text-lg">{formatCurrency(calculations.totalPaid)}</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          {[
            "Aprovacao em 30 min",
            "Sem burocracia",
            "Melhores taxas",
            "Documentacao gratis"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link 
          href={`https://wa.me/5512999999999?text=Olá! Gostaria de simular o financiamento do ${vehicleName}. Entrada: ${formatCurrency(calculations.downPayment)}, Parcelas: ${months}x de ${formatCurrency(calculations.monthlyPayment)}`}
          target="_blank"
          className="block"
        >
          <Button className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg font-semibold">
            <MessageCircle className="mr-2 h-5 w-5" />
            Solicitar Financiamento
          </Button>
        </Link>

        <p className="text-xs text-slate-500 text-center">
          * Simulacao sujeita a analise de credito. Taxas podem variar de acordo com o perfil do cliente.
        </p>
      </CardContent>
    </Card>
  )
}
