"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Calendar as CalendarIcon, Clock, User, Phone, Mail, CheckCircle2, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import { format, addDays, isSunday, isMonday, isBefore, startOfToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TestDriveSchedulerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleName: string
  vehicleSlug: string
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
]

const SATURDAY_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"]

export function TestDriveScheduler({ open, onOpenChange, vehicleName, vehicleSlug }: TestDriveSchedulerProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cnh: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getAvailableSlots = () => {
    if (!selectedDate) return []
    // Saturday has different hours
    const day = selectedDate.getDay()
    if (day === 6) return SATURDAY_SLOTS
    return TIME_SLOTS
  }

  const isDateDisabled = (date: Date) => {
    // Disable Sundays and past dates
    return isSunday(date) || isBefore(date, startOfToday())
  }

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione uma data e horário")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vehicleName,
          vehicleSlug,
          scheduledDate: format(selectedDate, "yyyy-MM-dd"),
          scheduledTime: selectedTime,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        toast.success("Test drive agendado com sucesso!")
      } else {
        toast.error("Erro ao agendar. Tente novamente.")
      }
    } catch (error) {
      toast.error("Erro ao agendar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setSelectedDate(undefined)
    setSelectedTime("")
    setFormData({ name: "", email: "", phone: "", cnh: "" })
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
            <DialogTitle className="text-2xl mb-2">Test Drive Agendado!</DialogTitle>
            <DialogDescription className="text-base space-y-2">
              <p>Seu test drive do <strong>{vehicleName}</strong> foi confirmado.</p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4 text-left">
                <div className="flex items-center gap-2 text-blue-900 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-semibold">
                    {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-900">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 mt-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Av. Brasil, 1500 - São Paulo, SP</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Você receberá um e-mail de confirmação com os detalhes.
              </p>
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            Agendar Test Drive
          </DialogTitle>
          <DialogDescription>
            Agende uma visita para conhecer o {vehicleName}
          </DialogDescription>
        </DialogHeader>

        {/* Vehicle Badge */}
        <Badge className="w-fit bg-blue-100 text-blue-800 py-1 px-3">
          <Car className="h-4 w-4 mr-2" />
          {vehicleName}
        </Badge>

        {/* Progress */}
        <div className="flex items-center gap-2 my-4">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
        </div>

        {/* Step 1: Select Date and Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                Escolha uma data
              </Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 30)}
                  locale={ptBR}
                  className="rounded-lg border"
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Escolha um horário
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableSlots().map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-blue-600" : "bg-transparent"}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedDate || !selectedTime}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Personal Data */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-blue-700">às {selectedTime}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-blue-600">
                  Alterar
                </Button>
              </CardContent>
            </Card>

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

            <div className="space-y-2">
              <Label htmlFor="cnh">CNH (opcional)</Label>
              <Input
                id="cnh"
                placeholder="Número da CNH"
                value={formData.cnh}
                onChange={(e) => updateField("cnh", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Necessário para realizar o test drive. Você pode informar no dia da visita.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || !formData.email || !formData.phone || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmar Agendamento
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
