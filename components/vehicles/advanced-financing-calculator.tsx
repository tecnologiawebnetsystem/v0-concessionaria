"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Calculator,
  Building2,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Sparkles,
  PiggyBank,
  Calendar,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Bank {
  id: string
  name: string
  logo?: string
  interestRate: number
  maxInstallments: number
  minDownPayment: number // porcentagem
  features: string[]
  isPartner: boolean
}

interface FinancingResult {
  bankId: string
  bankName: string
  monthlyPayment: number
  totalAmount: number
  totalInterest: number
  interestRate: number
  installments: number
  downPayment: number
  financedAmount: number
}

interface AdvancedFinancingCalculatorProps {
  vehiclePrice: number
  vehicleId: string
  vehicleName: string
  className?: string
}

const BANKS: Bank[] = [
  {
    id: "santander",
    name: "Santander",
    interestRate: 1.29,
    maxInstallments: 60,
    minDownPayment: 20,
    features: ["Aprovacao em 24h", "Sem entrada minima para clientes"],
    isPartner: true,
  },
  {
    id: "bradesco",
    name: "Bradesco",
    interestRate: 1.39,
    maxInstallments: 72,
    minDownPayment: 15,
    features: ["Ate 72x", "Carencia de 60 dias"],
    isPartner: true,
  },
  {
    id: "itau",
    name: "Itau",
    interestRate: 1.45,
    maxInstallments: 60,
    minDownPayment: 20,
    features: ["Seguro incluso", "Taxa fixa"],
    isPartner: false,
  },
  {
    id: "bb",
    name: "Banco do Brasil",
    interestRate: 1.35,
    maxInstallments: 60,
    minDownPayment: 20,
    features: ["Menor taxa para correntistas", "Aprovacao rapida"],
    isPartner: false,
  },
  {
    id: "caixa",
    name: "Caixa",
    interestRate: 1.49,
    maxInstallments: 60,
    minDownPayment: 25,
    features: ["Financiamento de seminovos", "Parceria FGTS"],
    isPartner: false,
  },
]

export function AdvancedFinancingCalculator({
  vehiclePrice,
  vehicleId,
  vehicleName,
  className,
}: AdvancedFinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(30)
  const [installments, setInstallments] = useState(48)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userProfile, setUserProfile] = useState<"excellent" | "good" | "regular">("good")

  const downPayment = (vehiclePrice * downPaymentPercent) / 100
  const financedAmount = vehiclePrice - downPayment

  // Calcular resultados para todos os bancos
  const results = useMemo(() => {
    return BANKS.map((bank) => {
      // Ajustar taxa baseado no perfil do usuario
      let adjustedRate = bank.interestRate
      if (userProfile === "excellent") adjustedRate -= 0.15
      if (userProfile === "regular") adjustedRate += 0.2

      const monthlyRate = adjustedRate / 100
      const n = installments

      // Formula Price
      const monthlyPayment =
        financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1)

      const totalAmount = monthlyPayment * n
      const totalInterest = totalAmount - financedAmount

      return {
        bankId: bank.id,
        bankName: bank.name,
        monthlyPayment,
        totalAmount,
        totalInterest,
        interestRate: adjustedRate,
        installments,
        downPayment,
        financedAmount,
        bank,
      }
    }).sort((a, b) => a.monthlyPayment - b.monthlyPayment)
  }, [financedAmount, installments, downPayment, userProfile])

  const bestOffer = results[0]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const handleSaveSimulation = async () => {
    if (!selectedBank) {
      toast.error("Selecione um banco primeiro")
      return
    }

    setIsSaving(true)
    try {
      const selected = results.find((r) => r.bankId === selectedBank)
      if (!selected) return

      const response = await fetch("/api/financing/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          vehiclePrice,
          downPayment: selected.downPayment,
          financedAmount: selected.financedAmount,
          installments: selected.installments,
          interestRate: selected.interestRate,
          monthlyPayment: selected.monthlyPayment,
          totalAmount: selected.totalAmount,
          bankName: selected.bankName,
        }),
      })

      if (response.ok) {
        toast.success("Simulacao salva! Entraremos em contato.")
      }
    } catch (error) {
      toast.error("Erro ao salvar simulacao")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5" />
          Simulador de Financiamento
        </CardTitle>
        <CardDescription>
          Compare taxas de {BANKS.length} bancos em tempo real
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Perfil do cliente */}
        <div className="space-y-3">
          <Label>Seu perfil de credito</Label>
          <RadioGroup
            value={userProfile}
            onValueChange={(v) => setUserProfile(v as typeof userProfile)}
            className="grid grid-cols-3 gap-3"
          >
            <Label
              className={cn(
                "flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-center",
                userProfile === "excellent"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                  : "hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="excellent" className="sr-only" />
              <Sparkles className="size-5 text-green-600" />
              <span className="text-sm font-medium">Excelente</span>
              <span className="text-xs text-muted-foreground">Score 700+</span>
            </Label>
            <Label
              className={cn(
                "flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-center",
                userProfile === "good"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="good" className="sr-only" />
              <CheckCircle2 className="size-5 text-blue-600" />
              <span className="text-sm font-medium">Bom</span>
              <span className="text-xs text-muted-foreground">Score 500-699</span>
            </Label>
            <Label
              className={cn(
                "flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-center",
                userProfile === "regular"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                  : "hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="regular" className="sr-only" />
              <AlertCircle className="size-5 text-amber-600" />
              <span className="text-sm font-medium">Regular</span>
              <span className="text-xs text-muted-foreground">Score 300-499</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Valor da entrada */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Entrada</Label>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(downPayment)}
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={([v]) => setDownPaymentPercent(v)}
            min={0}
            max={70}
            step={5}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">{downPaymentPercent}%</span>
            <span>70%</span>
          </div>
        </div>

        {/* Numero de parcelas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Parcelas</Label>
            <span className="text-lg font-bold">{installments}x</span>
          </div>
          <Slider
            value={[installments]}
            onValueChange={([v]) => setInstallments(v)}
            min={12}
            max={72}
            step={6}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>12x</span>
            <span>36x</span>
            <span>48x</span>
            <span>60x</span>
            <span>72x</span>
          </div>
        </div>

        <Separator />

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Valor do veiculo</p>
            <p className="text-lg font-semibold">{formatCurrency(vehiclePrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor financiado</p>
            <p className="text-lg font-semibold">{formatCurrency(financedAmount)}</p>
          </div>
        </div>

        {/* Melhor oferta */}
        <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-5 text-primary" />
              <span className="font-semibold">Melhor oferta</span>
            </div>
            <Badge className="bg-primary">{bestOffer.bankName}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Parcela de</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(bestOffer.monthlyPayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa a partir de</p>
              <p className="text-2xl font-bold">
                {bestOffer.interestRate.toFixed(2)}% a.m.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de bancos */}
        <div className="space-y-3">
          <Label>Comparar todas as ofertas</Label>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={result.bankId}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                  selectedBank === result.bankId
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => setSelectedBank(result.bankId)}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{result.bankName}</p>
                      {result.bank.isPartner && (
                        <Badge variant="secondary" className="text-xs">
                          Parceiro
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge className="text-xs bg-green-600">Menor taxa</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.interestRate.toFixed(2)}% a.m. | ate {result.bank.maxInstallments}x
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(result.monthlyPayment)}</p>
                  <p className="text-xs text-muted-foreground">
                    Total: {formatCurrency(result.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acoes */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            disabled={!selectedBank || isSaving}
            onClick={handleSaveSimulation}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                Solicitar Financiamento
                <ChevronRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          *Valores simulados. Taxas e condicoes sujeitas a analise de credito.
        </p>
      </CardContent>
    </Card>
  )
}
