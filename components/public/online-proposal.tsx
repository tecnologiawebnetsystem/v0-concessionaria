"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Phone, Mail, Car, DollarSign, Calendar, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface OnlineProposalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleName: string
  vehiclePrice: number
  vehicleSlug: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function OnlineProposal({ open, onOpenChange, vehicleName, vehiclePrice, vehicleSlug }: OnlineProposalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    proposedPrice: vehiclePrice.toString(),
    paymentMethod: "",
    hasTradeIn: false,
    tradeInBrand: "",
    tradeInModel: "",
    tradeInYear: "",
    tradeInMileage: "",
    message: "",
    acceptTerms: false,
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      toast.error("Você precisa aceitar os termos para continuar")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vehicleName,
          vehiclePrice,
          vehicleSlug,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        toast.success("Proposta enviada com sucesso!")
      } else {
        toast.error("Erro ao enviar proposta. Tente novamente.")
      }
    } catch (error) {
      toast.error("Erro ao enviar proposta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      cpf: "",
      proposedPrice: vehiclePrice.toString(),
      paymentMethod: "",
      hasTradeIn: false,
      tradeInBrand: "",
      tradeInModel: "",
      tradeInYear: "",
      tradeInMileage: "",
      message: "",
      acceptTerms: false,
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(resetForm, 300)
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl mb-2">Proposta Enviada!</DialogTitle>
            <DialogDescription className="text-base">
              Recebemos sua proposta para o <strong>{vehicleName}</strong>. 
              Nossa equipe entrará em contato em até 24 horas.
            </DialogDescription>
            <div className="mt-6">
              <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Proposta Online
          </DialogTitle>
          <DialogDescription>
            Envie sua proposta de compra para {vehicleName}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-4 mb-6">
          <span>Dados Pessoais</span>
          <span>Proposta</span>
          <span>Confirmação</span>
        </div>

        {/* Vehicle Info */}
        <Card className="bg-gray-50 mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Veículo selecionado</p>
              <p className="font-semibold">{vehicleName}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-1">
              {formatCurrency(vehiclePrice)}
            </Badge>
          </CardContent>
        </Card>

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => updateField("cpf", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!formData.name || !formData.email || !formData.phone}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Proposal */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposedPrice">Sua Proposta (R$) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="proposedPrice"
                    type="number"
                    value={formData.proposedPrice}
                    onChange={(e) => updateField("proposedPrice", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                <Select value={formData.paymentMethod} onValueChange={(v) => updateField("paymentMethod", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-vista">À Vista</SelectItem>
                    <SelectItem value="financiamento">Financiamento</SelectItem>
                    <SelectItem value="consorcio">Consórcio</SelectItem>
                    <SelectItem value="troca">Troca com Troco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trade-in Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasTradeIn" 
                  checked={formData.hasTradeIn}
                  onCheckedChange={(checked) => updateField("hasTradeIn", checked)}
                />
                <Label htmlFor="hasTradeIn" className="flex items-center gap-2 cursor-pointer">
                  <Car className="h-4 w-4" />
                  Tenho um veículo para dar como entrada
                </Label>
              </div>

              {formData.hasTradeIn && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Input
                    placeholder="Marca"
                    value={formData.tradeInBrand}
                    onChange={(e) => updateField("tradeInBrand", e.target.value)}
                  />
                  <Input
                    placeholder="Modelo"
                    value={formData.tradeInModel}
                    onChange={(e) => updateField("tradeInModel", e.target.value)}
                  />
                  <Input
                    placeholder="Ano"
                    value={formData.tradeInYear}
                    onChange={(e) => updateField("tradeInYear", e.target.value)}
                  />
                  <Input
                    placeholder="Quilometragem"
                    value={formData.tradeInMileage}
                    onChange={(e) => updateField("tradeInMileage", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Observações (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Alguma observação adicional?"
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!formData.proposedPrice || !formData.paymentMethod}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resumo da Proposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Nome:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">E-mail:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Telefone:</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Valor proposto:</span>
                  <span className="font-bold text-green-600">{formatCurrency(Number(formData.proposedPrice))}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Forma de pagamento:</span>
                  <span className="font-medium capitalize">{formData.paymentMethod.replace("-", " ")}</span>
                </div>
                {formData.hasTradeIn && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Veículo para troca:</span>
                    <span className="font-medium">
                      {formData.tradeInBrand} {formData.tradeInModel} {formData.tradeInYear}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="acceptTerms" 
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => updateField("acceptTerms", checked)}
              />
              <Label htmlFor="acceptTerms" className="text-xs text-gray-500 cursor-pointer">
                Li e aceito os termos de uso e política de privacidade. Autorizo o contato da 
                Nacional Veículos para tratar desta proposta.
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.acceptTerms || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Enviar Proposta
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
