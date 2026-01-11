"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Phone, Mail, MessageSquare, Loader2 } from "lucide-react"

export function ContactForm({ vehicle }: { vehicle: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Olá! Tenho interesse no veículo ${vehicle.name}. Gostaria de mais informações.`,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vehicle_id: vehicle.id,
          type: "vehicle",
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem")
      }

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Interessado?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 91234-5678"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Sua mensagem..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 size-4" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3 border-t pt-6">
            <a
              href="tel:+5511123456789"
              className="flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-blue-900"
            >
              <Phone className="size-5" />
              (11) 1234-5678
            </a>
            <a
              href="mailto:contato@nacionalveiculos.com.br"
              className="flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-blue-900"
            >
              <Mail className="size-5" />
              contato@nacionalveiculos.com.br
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
