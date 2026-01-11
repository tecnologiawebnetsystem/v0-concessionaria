"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Calendar, Share2 } from "lucide-react"
import { toast } from "sonner"

export function VehicleCTAButtons({
  vehicleName,
  vehicleSlug,
  vehiclePrice,
  phoneNumber = "5511999999999",
}: {
  vehicleName: string
  vehicleSlug: string
  vehiclePrice: number
  phoneNumber?: string
}) {
  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no ${vehicleName}. Gostaria de mais informações sobre este veículo.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

  const handleCall = () => {
    window.location.href = `tel:+${phoneNumber}`
  }

  const handleShare = async () => {
    const shareData = {
      title: vehicleName,
      text: `Confira este ${vehicleName} na Nacional Veículos!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success("Compartilhado com sucesso!")
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          copyToClipboard()
        }
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copiado para a área de transferência!")
  }

  return (
    <div className="sticky top-24 space-y-3">
      <Button onClick={handleWhatsApp} className="w-full bg-green-500 hover:bg-green-600" size="lg">
        <MessageCircle className="mr-2 size-5" />
        Falar no WhatsApp
      </Button>

      <Button onClick={handleCall} variant="outline" className="w-full bg-transparent" size="lg">
        <Phone className="mr-2 size-5" />
        Ligar Agora
      </Button>

      <Button variant="outline" className="w-full bg-transparent" size="lg">
        <Calendar className="mr-2 size-5" />
        Agendar Test Drive
      </Button>

      <Button onClick={handleShare} variant="ghost" className="w-full" size="sm">
        <Share2 className="mr-2 size-4" />
        Compartilhar
      </Button>

      <div className="rounded-lg border bg-blue-50 p-4 text-center">
        <p className="text-sm font-semibold text-blue-900">Atendimento Imediato</p>
        <p className="text-xs text-blue-700">Seg-Sex: 8h-18h | Sáb: 8h-13h</p>
      </div>
    </div>
  )
}
