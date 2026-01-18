"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Car, CheckCircle, Loader2, DollarSign, ArrowRight, Camera, Shield, Clock } from "lucide-react"
import { toast } from "sonner"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

const brands = [
  "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Jeep", "Nissan", 
  "Peugeot", "Renault", "Toyota", "Volkswagen", "Citroën", "Mitsubishi", 
  "Kia", "BMW", "Mercedes-Benz", "Audi", "Volvo", "Land Rover", "Outra"
]

const conditions = [
  { value: "excellent", label: "Excelente", description: "Sem arranhões, interior perfeito" },
  { value: "good", label: "Bom", description: "Pequenos sinais de uso normal" },
  { value: "regular", label: "Regular", description: "Alguns arranhões e desgastes" },
  { value: "poor", label: "Precisa de reparos", description: "Necessita manutenção" },
]

interface CarEvaluationProps {
  trigger?: React.ReactNode
  onComplete?: () => void
}

export function CarEvaluation({ trigger, onComplete }: CarEvaluationProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Vehicle info
    brand: "",
    model: "",
    year: "",
    version: "",
    mileage: "",
    color: "",
    fuel: "",
    transmission: "",
    condition: "",
    // Contact info
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Erro ao enviar")

      setSubmitted(true)
      toast.success("Solicitação enviada! Entraremos em contato em breve.")
      onComplete?.()
    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const canProceedStep1 = formData.brand && formData.model && formData.year && formData.mileage
  const canProceedStep2 = formData.condition && formData.fuel && formData.transmission
  const canSubmit = formData.name && formData.email && formData.phone

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setFormData({
      brand: "", model: "", year: "", version: "", mileage: "", color: "",
      fuel: "", transmission: "", condition: "", name: "", email: "", phone: "",
      city: "", message: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <DollarSign className="h-4 w-4" />
            Avalie seu Carro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Solicitação Enviada!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Recebemos as informações do seu veículo. Nossa equipe entrará em contato em até 24 horas com uma avaliação.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fechar
              </Button>
              <Button onClick={resetForm}>
                Nova Avaliação
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Car className="h-5 w-5 text-primary" />
                Avalie seu Veículo
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do seu carro e receba uma avaliação em até 24 horas
              </DialogDescription>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 mx-1 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 text-xs text-muted-foreground mb-6">
              <span className={step >= 1 ? "text-primary font-medium" : ""}>Veículo</span>
              <span className={step >= 2 ? "text-primary font-medium" : ""}>Condição</span>
              <span className={step >= 3 ? "text-primary font-medium" : ""}>Contato</span>
            </div>

            {/* Step 1: Vehicle Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marca *</Label>
                    <Select value={formData.brand} onValueChange={(v) => handleChange("brand", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo *</Label>
                    <Input 
                      placeholder="Ex: Corolla, Civic, Onix"
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ano *</Label>
                    <Select value={formData.year} onValueChange={(v) => handleChange("year", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Versão</Label>
                    <Input 
                      placeholder="Ex: XEi, LX, Premier"
                      value={formData.version}
                      onChange={(e) => handleChange("version", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quilometragem *</Label>
                    <Input 
                      type="number"
                      placeholder="Ex: 45000"
                      value={formData.mileage}
                      onChange={(e) => handleChange("mileage", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor</Label>
                    <Input 
                      placeholder="Ex: Prata"
                      value={formData.color}
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Condition */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Combustível *</Label>
                    <Select value={formData.fuel} onValueChange={(v) => handleChange("fuel", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="gasoline">Gasolina</SelectItem>
                        <SelectItem value="ethanol">Etanol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Híbrido</SelectItem>
                        <SelectItem value="electric">Elétrico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Câmbio *</Label>
                    <Select value={formData.transmission} onValueChange={(v) => handleChange("transmission", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automático</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                        <SelectItem value="automated">Automatizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Condição do Veículo *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {conditions.map((c) => (
                      <Card 
                        key={c.value}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          formData.condition === c.value ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                        }`}
                        onClick={() => handleChange("condition", c.value)}
                      >
                        <CardContent className="p-4">
                          <p className="font-medium">{c.label}</p>
                          <p className="text-xs text-muted-foreground">{c.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-4">
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Car className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-semibold">{formData.brand} {formData.model}</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.year} • {Number(formData.mileage).toLocaleString()} km • {formData.transmission === "automatic" ? "Automático" : "Manual"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Nome Completo *</Label>
                    <Input 
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail *</Label>
                    <Input 
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone *</Label>
                    <Input 
                      placeholder="(12) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Cidade</Label>
                    <Input 
                      placeholder="Sua cidade"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Observações</Label>
                    <Textarea 
                      placeholder="Informações adicionais sobre o veículo..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
                  <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Seus dados estão seguros</p>
                    <p className="text-blue-700 dark:text-blue-300">Suas informações são utilizadas apenas para avaliação do veículo.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Solicitar Avaliação
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
