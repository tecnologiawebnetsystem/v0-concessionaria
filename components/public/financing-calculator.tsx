"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator } from "lucide-react"

export function FinancingCalculator({ vehiclePrice, vehicleName }: { vehiclePrice: number; vehicleName: string }) {
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2)
  const [months, setMonths] = useState(48)

  const financeAmount = vehiclePrice - downPayment
  const monthlyInterestRate = 0.0149 // 1.49% ao mês (taxa média)
  const monthlyPayment =
    (financeAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months))) /
    (Math.pow(1 + monthlyInterestRate, months) - 1)
  const totalAmount = monthlyPayment * months + downPayment
  const totalInterest = totalAmount - vehiclePrice

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5 text-blue-900" />
          Simulação de Financiamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="downPayment">Entrada: {formatCurrency(downPayment)}</Label>
          <Slider
            id="downPayment"
            min={0}
            max={vehiclePrice * 0.5}
            step={1000}
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            className="w-full"
          />
          <p className="text-xs text-gray-600">{((downPayment / vehiclePrice) * 100).toFixed(0)}% do valor total</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="months">Prazo: {months} meses</Label>
          <Slider
            id="months"
            min={12}
            max={60}
            step={6}
            value={[months]}
            onValueChange={(value) => setMonths(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>12 meses</span>
            <span>60 meses</span>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-blue-900 p-4 text-white">
          <div className="flex items-baseline justify-between">
            <span className="text-sm">Parcela mensal:</span>
            <span className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="border-t border-blue-700 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">Valor financiado:</span>
              <span className="font-semibold">{formatCurrency(financeAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Total a pagar:</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Juros totais:</span>
              <span className="font-semibold">{formatCurrency(totalInterest)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          * Simulação considerando taxa de 1,49% a.m. (CET de aprox. 19,56% a.a.). Valores sujeitos a aprovação de
          crédito e análise cadastral.
        </p>
      </CardContent>
    </Card>
  )
}
