"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Lock, Expand, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export function VehicleGalleryClient({
  images,
  vehicleName,
  isAuthenticated,
}: {
  images: any[]
  vehicleName: string
  isAuthenticated?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-500">Sem imagens disponiveis</p>
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

  const displayImages = isAuthenticated ? images : images.slice(0, 1)
  const showLockOverlay = !isAuthenticated && images.length > 1

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group">
          <Image
            src={displayImages[currentIndex]?.url || "/placeholder.svg"}
            alt={displayImages[currentIndex]?.alt_text || vehicleName}
            fill
            className="object-cover"
            priority
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

          {/* Lock Overlay for non-authenticated users */}
          {showLockOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md z-20">
              <div className="text-center px-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Veja todas as fotos</h3>
                <p className="text-slate-400 mb-6 max-w-sm">
                  Crie uma conta gratuita para acessar todas as {images.length} fotos deste veiculo
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/registro?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Criar Conta Gratis
                    </Button>
                  </Link>
                  <Link href={`/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}>
                    <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 w-full sm:w-auto bg-transparent">
                      Fazer Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {isAuthenticated && images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <Badge className="bg-black/50 text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </Badge>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
          >
            <Expand className="h-5 w-5" />
          </button>

          {/* Favorite Button */}
          <button className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-all">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnails */}
        {isAuthenticated && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  index === currentIndex
                    ? "border-blue-500 ring-2 ring-blue-500/50"
                    : "border-slate-700 opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Non-authenticated notice */}
        {!isAuthenticated && images.length > 1 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-blue-300">
                Mais {images.length - 1} {images.length - 1 === 1 ? "foto disponivel" : "fotos disponiveis"}
              </span>
            </div>
            <Link href="/login">
              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                Fazer login
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
            <Image
              src={images[currentIndex]?.url || "/placeholder.svg"}
              alt={images[currentIndex]?.alt_text || vehicleName}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex ? "bg-white w-6" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
