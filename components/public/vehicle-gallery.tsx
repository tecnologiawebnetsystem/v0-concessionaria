"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function VehicleGallery({
  images,
  vehicleName,
  isAuthenticated,
}: {
  images: any[]
  vehicleName: string
  isAuthenticated?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="aspect-video bg-gray-100">
          <img src="/classic-red-convertible.png" alt={vehicleName} className="size-full object-cover" />
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  // Show only first image if not authenticated
  const displayImages = isAuthenticated ? images : images.slice(0, 1)
  const showLockOverlay = !isAuthenticated && images.length > 1

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
      <div className="relative aspect-video bg-gray-100">
        <img
          src={displayImages[currentIndex]?.url || "/placeholder.svg?height=600&width=800&query=car"}
          alt={displayImages[currentIndex]?.alt_text || vehicleName}
          className="size-full object-cover"
        />

        {showLockOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center text-white">
              <Lock className="mx-auto mb-4 size-16" />
              <h3 className="mb-2 text-2xl font-bold">Ver Todas as Fotos</h3>
              <p className="mb-6 text-blue-100">Crie uma conta gratuita para acessar {images.length - 1} fotos</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild className="bg-white text-blue-900 hover:bg-blue-50">
                  <Link href={`/registro?redirect=${encodeURIComponent(window.location.pathname)}`}>
                    Criar Conta Grátis
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>Fazer Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6 text-gray-900" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="size-6 text-gray-900" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {isAuthenticated && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === currentIndex ? "border-blue-600 ring-2 ring-blue-600" : "border-transparent opacity-60",
              )}
            >
              <img src={image.url || "/placeholder.svg"} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {!isAuthenticated && images.length > 1 && (
        <div className="border-t bg-blue-50 p-4 text-center">
          <p className="text-sm text-blue-900">
            <Lock className="mr-1 inline size-4" />
            Mais {images.length - 1} {images.length - 1 === 1 ? "foto disponível" : "fotos disponíveis"}. Faça login
            para ver todas.
          </p>
        </div>
      )}
    </div>
  )
}
