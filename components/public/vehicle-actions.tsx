"use client"

import React from "react"

import { useVehicle } from "@/contexts/vehicle-context"
import { Button } from "@/components/ui/button"
import { Heart, Scale, Share2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Vehicle {
  id: number
  slug: string
  name: string
  brand_name: string
  price: number
  year: number
  mileage: number
  fuel_type: string
  transmission: string
  primary_image: string
  category_name?: string
}

interface VehicleActionsProps {
  vehicle: Vehicle
  showLabels?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
}

export function VehicleActions({ vehicle, showLabels = false, size = "default", className = "" }: VehicleActionsProps) {
  const { addFavorite, removeFavorite, isFavorite, addToCompare, isInCompare, compareCount } = useVehicle()

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id)
      toast.success("Removido dos favoritos")
    } else {
      addFavorite(vehicle)
      toast.success("Adicionado aos favoritos")
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCompare(vehicle.id)) {
      toast.info("Este veículo já está na comparação")
    } else if (compareCount >= 3) {
      toast.error("Você pode comparar no máximo 3 veículos")
    } else {
      addToCompare(vehicle)
      toast.success("Adicionado à comparação")
    }
  }

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/veiculos/${vehicle.slug}`
    const text = `Confira este ${vehicle.name} na Nacional Veículos!`
    
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link copiado!")
        break
    }
  }

  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
  const buttonSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Favorite Button */}
      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} ${isFavorite(vehicle.id) ? "bg-red-50 border-red-200 text-red-500" : "bg-white/80 backdrop-blur-sm"}`}
        onClick={handleFavorite}
        title={isFavorite(vehicle.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart className={`${iconSize} ${isFavorite(vehicle.id) ? "fill-red-500" : ""}`} />
        {showLabels && <span className="ml-2">Favoritar</span>}
      </Button>

      {/* Compare Button */}
      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} ${isInCompare(vehicle.id) ? "bg-blue-50 border-blue-200 text-blue-500" : "bg-white/80 backdrop-blur-sm"}`}
        onClick={handleCompare}
        title={isInCompare(vehicle.id) ? "Já na comparação" : "Adicionar à comparação"}
      >
        <Scale className={iconSize} />
        {showLabels && <span className="ml-2">Comparar</span>}
      </Button>

      {/* Share Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`${buttonSize} bg-white/80 backdrop-blur-sm`}
            title="Compartilhar"
          >
            <Share2 className={iconSize} />
            {showLabels && <span className="ml-2">Compartilhar</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="cursor-pointer">
            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
            <svg className="h-4 w-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
            </svg>
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter / X
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copiar link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
