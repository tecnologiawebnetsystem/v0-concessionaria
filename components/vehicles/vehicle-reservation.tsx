"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Clock,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VehicleReservationProps {
  vehicleId: string
  vehicleName: string
  vehiclePrice: number
  vehicleImage?: string
}

const RESERVATION_AMOUNTS = [
  { value: 500, label: "R$ 500", description: "Reserva basica" },
  { value: 1000, label: "R$ 1.000", description: "Recomendado" },
  { value: 2000, label: "R$ 2.000", description: "Prioridade maxima" },
]

export function VehicleReservation({
  vehicleId,
  vehicleName,
  vehiclePrice,
  vehicleImage,
}: VehicleReservationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [reservationData, setReservationData] = useState({
    amount: 1000,
    paymentMethod: "pix",
    name: "",
    email: "",
    phone: "",
    cpf: "",
    acceptTerms: false,
  })
  const [pixData, setPixData] = useState<{
    qrCode: string
    copyPaste: string
    expiresAt: string
  } | null>(null)
  const [reservationId, setReservationId] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14)
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15)
  }

  const handleCreateReservation = async () => {
    if (!reservationData.acceptTerms) {
      toast.error("Aceite os termos para continuar")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          amount: reservationData.amount,
          paymentMethod: reservationData.paymentMethod,
          customerName: reservationData.name,
          customerEmail: reservationData.email,
          customerPhone: reservationData.phone,
          customerCpf: reservationData.cpf,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar reserva")
      }

      setReservationId(data.reservationId)
      
      if (reservationData.paymentMethod === "pix") {
        setPixData({
          qrCode: data.pixQrCode || "/images/pix-example.png",
          copyPaste: data.pixCopyPaste || "00020126580014br.gov.bcb.pix0136...",
          expiresAt: data.expiresAt,
        })
      }

      setStep(3)
      toast.success("Reserva criada! Aguardando pagamento.")
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar reserva")
    } finally {
      setIsLoading(false)
    }
  }

  const copyPixCode = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste)
      toast.success("Codigo PIX copiado!")
    }
  }

  const isStep1Valid = reservationData.amount > 0
  const isStep2Valid = 
    reservationData.name.length >= 3 &&
    reservationData.email.includes("@") &&
    reservationData.phone.length >= 14 &&
    reservationData.cpf.length === 14 &&
    reservationData.acceptTerms

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2">
          <Lock className="size-4" />
          Reservar Veiculo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            Reservar Veiculo
          </DialogTitle>
          <DialogDescription>
            Garanta este veiculo com um sinal. Voce tera 48h de exclusividade.
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <CheckCircle2 className="size-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-1",
                    step > s ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Escolher valor */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              {vehicleImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="size-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{vehicleName}</p>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(vehiclePrice)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Valor do sinal</Label>
              <RadioGroup
                value={String(reservationData.amount)}
                onValueChange={(v) =>
                  setReservationData({ ...reservationData, amount: Number(v) })
                }
              >
                {RESERVATION_AMOUNTS.map((option) => (
                  <Label
                    key={option.value}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                      reservationData.amount === option.value
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={String(option.value)} />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {option.value === 1000 && (
                      <Badge variant="secondary">Recomendado</Badge>
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Forma de pagamento</Label>
              <RadioGroup
                value={reservationData.paymentMethod}
                onValueChange={(v) =>
                  setReservationData({ ...reservationData, paymentMethod: v })
                }
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  className={cn(
                    "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                    reservationData.paymentMethod === "pix"
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="pix" />
                  <QrCode className="size-5 text-green-600" />
                  <span>PIX</span>
                </Label>
                <Label
                  className={cn(
                    "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                    reservationData.paymentMethod === "credit_card"
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="credit_card" />
                  <CreditCard className="size-5 text-blue-600" />
                  <span>Cartao</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-sm">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-200">
                O sinal sera descontado do valor total do veiculo. Em caso de desistencia,
                o valor podera ser devolvido parcialmente conforme nossos termos.
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
            >
              Continuar
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Dados pessoais */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={reservationData.name}
                  onChange={(e) =>
                    setReservationData({ ...reservationData, name: e.target.value })
                  }
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={reservationData.email}
                  onChange={(e) =>
                    setReservationData({ ...reservationData, email: e.target.value })
                  }
                  placeholder="seu@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={reservationData.phone}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={reservationData.cpf}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        cpf: formatCPF(e.target.value),
                      })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={reservationData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setReservationData({
                      ...reservationData,
                      acceptTerms: checked === true,
                    })
                  }
                />
                <label htmlFor="terms" className="text-sm leading-relaxed">
                  Li e aceito os{" "}
                  <a href="/termos" className="text-primary underline">
                    termos de reserva
                  </a>{" "}
                  e a{" "}
                  <a href="/privacidade" className="text-primary underline">
                    politica de privacidade
                  </a>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                className="flex-1"
                disabled={!isStep2Valid || isLoading}
                onClick={handleCreateReservation}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    Confirmar Reserva
                    <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pagamento */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="size-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Reserva criada!</h3>
              <p className="text-muted-foreground">
                Efetue o pagamento para confirmar sua reserva
              </p>
            </div>

            {reservationData.paymentMethod === "pix" && pixData && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixData.qrCode}
                    alt="QR Code PIX"
                    className="w-48 h-48 mx-auto bg-white p-2 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ou copie o codigo PIX</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={pixData.copyPaste.slice(0, 30) + "..."}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" onClick={copyPixCode}>
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  <span>Expira em 30 minutos</span>
                </div>
              </div>
            )}

            <Card className="text-left">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Veiculo</span>
                  <span className="font-medium">{vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor do sinal</span>
                  <span className="font-medium text-primary">
                    {formatPrice(reservationData.amount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validade da reserva</span>
                  <span className="font-medium">48 horas</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
