"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function WhatsAppFloat({ phoneNumber = "5511999999999" }: { phoneNumber?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = (message?: string) => {
    const defaultMessage = "Olá! Vim do site da Nacional Veículos e gostaria de mais informações."
    const encodedMessage = encodeURIComponent(message || defaultMessage)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110 sm:size-16"
        aria-label="Abrir WhatsApp"
      >
        {isOpen ? <X className="size-6 sm:size-7" /> : <MessageCircle className="size-6 sm:size-7" />}
        <span className="absolute -top-1 -right-1 flex size-4 animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="absolute -top-1 -right-1 flex size-4 rounded-full bg-green-400" />
      </button>

      {/* Quick Actions Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-lg border bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
              <MessageCircle className="size-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fale Conosco</h3>
              <p className="text-xs text-gray-600">Respondemos em minutos!</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleWhatsAppClick()}
              className="w-full justify-start bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <MessageCircle className="mr-2 size-4" />
              Iniciar Conversa
            </Button>
            <Button
              onClick={() =>
                handleWhatsAppClick("Olá! Gostaria de agendar uma visita para conhecer os veículos disponíveis.")
              }
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              Agendar Visita
            </Button>
            <Button
              onClick={() => handleWhatsAppClick("Olá! Gostaria de saber sobre as condições de financiamento.")}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              Financiamento
            </Button>
            <Button
              onClick={() =>
                handleWhatsAppClick("Olá! Tenho um veículo para vender/trocar e gostaria de fazer uma avaliação.")
              }
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              Avaliar Meu Carro
            </Button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500">Horário de atendimento: Seg-Sex 8h-18h | Sáb 8h-13h</p>
        </div>
      )}
    </>
  )
}
