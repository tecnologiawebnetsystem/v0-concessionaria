"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Navigation, ExternalLink, Car } from "lucide-react"

interface StoreMapProps {
  className?: string
  showFullInfo?: boolean
}

export function StoreMap({ className, showFullInfo = true }: StoreMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Coordenadas de Taubaté - Nacional Veículos
  const latitude = -23.0226
  const longitude = -45.5561
  const address = "Av. Independência, 1500 - Centro, Taubaté - SP"
  const encodedAddress = encodeURIComponent("Nacional Veículos, Av. Independência, 1500, Centro, Taubaté, SP")
  
  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
  }

  return (
    <Card className={className}>
      {showFullInfo && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nossa Localização
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Car className="h-3 w-3" />
              Estacionamento Gratuito
            </Badge>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={showFullInfo ? "" : "p-0"}>
        {/* Map Container */}
        <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-2 animate-pulse" />
                <p className="text-sm text-slate-500">Carregando mapa...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.8!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjQiUyA0NcKwMzMnMjIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1704067200000!5m2!1spt-BR!2sbr`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            onLoad={() => setMapLoaded(true)}
          />
        </div>

        {showFullInfo && (
          <>
            {/* Store Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Endereço</p>
                  <p className="text-sm text-muted-foreground">{address}</p>
                  <p className="text-sm text-muted-foreground">CEP: 12020-000</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Telefone</p>
                  <p className="text-sm text-muted-foreground">(12) 3621-0000</p>
                  <p className="text-sm text-muted-foreground">WhatsApp: (12) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Horário de Funcionamento</p>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 14h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button 
                onClick={openDirections}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Como Chegar
              </Button>
              <Button 
                variant="outline" 
                onClick={openInGoogleMaps}
                className="flex-1 bg-transparent"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir no Maps
              </Button>
            </div>

            {/* Landmarks */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Pontos de Referência</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Próximo ao Shopping Taubaté</li>
                <li>• 5 minutos da Rodovia Dutra (saída 102)</li>
                <li>• Em frente ao Parque do Vale</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for embedding in other pages
export function StoreMapCompact() {
  const openDirections = () => {
    const encodedAddress = encodeURIComponent("Nacional Veículos, Av. Independência, 1500, Centro, Taubaté, SP")
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 group cursor-pointer" onClick={openDirections}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.8!2d-45.5561!3d-23.0226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjQiUyA0NcKwMzMnMjIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1704067200000!5m2!1spt-BR!2sbr"
        width="100%"
        height="200"
        style={{ border: 0, pointerEvents: "none" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <Badge className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 shadow-lg">
          <Navigation className="mr-1 h-3 w-3" />
          Como Chegar
        </Badge>
      </div>
    </div>
  )
}
