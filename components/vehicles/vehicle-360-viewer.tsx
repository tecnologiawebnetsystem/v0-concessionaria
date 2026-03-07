"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  RotateCw, 
  Pause, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Move
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Vehicle360ViewerProps {
  images: string[] // Array de imagens em sequencia (36 ou 72 imagens)
  className?: string
  autoRotate?: boolean
  autoRotateSpeed?: number // ms entre frames
}

export function Vehicle360Viewer({ 
  images, 
  className,
  autoRotate = false,
  autoRotateSpeed = 100
}: Vehicle360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoRotate)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Pre-load all images
  useEffect(() => {
    if (images.length === 0) return
    
    let loaded = 0
    images.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === images.length) {
          setIsLoaded(true)
        }
      }
      img.src = src
    })
  }, [images])

  // Auto rotation
  useEffect(() => {
    if (isPlaying && isLoaded) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoRotateSpeed)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isLoaded, images.length, autoRotateSpeed])

  // Handle drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setIsPlaying(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const diff = e.clientX - startX
    const sensitivity = 5 // pixels por frame
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1
      setCurrentIndex((prev) => {
        const newIndex = prev + direction
        if (newIndex < 0) return images.length - 1
        if (newIndex >= images.length) return 0
        return newIndex
      })
      setStartX(e.clientX)
    }
  }, [isDragging, startX, images.length])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setIsPlaying(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    
    const diff = e.touches[0].clientX - startX
    const sensitivity = 5
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1
      setCurrentIndex((prev) => {
        const newIndex = prev + direction
        if (newIndex < 0) return images.length - 1
        if (newIndex >= images.length) return 0
        return newIndex
      })
      setStartX(e.touches[0].clientX)
    }
  }, [isDragging, startX, images.length])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setIsPlaying(false)
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setIsPlaying(false)
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images.length, isFullscreen])

  if (images.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg h-[400px]", className)}>
        <p className="text-muted-foreground">Visualizacao 360 nao disponivel</p>
      </div>
    )
  }

  const loadingProgress = Math.round((loadedCount / images.length) * 100)

  const ViewerContent = () => (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[400px]",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Carregando visualizacao 360... {loadingProgress}%
          </p>
        </div>
      )}

      {/* Main image */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-100"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[currentIndex]}
          alt={`Visualizacao 360 - Frame ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Drag indicator */}
      {isLoaded && !isDragging && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
          <Move className="size-4" />
          <span>Arraste para girar</span>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        >
          <ChevronRight className="size-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
          disabled={zoom <= 1}
        >
          <ZoomOut className="size-4" />
        </Button>
        
        <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          disabled={zoom >= 3}
        >
          <ZoomIn className="size-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <X className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* Frame indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48">
        <Slider
          value={[currentIndex]}
          max={images.length - 1}
          step={1}
          onValueChange={([value]) => {
            setCurrentIndex(value)
            setIsPlaying(false)
          }}
          className="cursor-pointer"
        />
      </div>

      {/* 360 badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
        <RotateCw className="size-4 animate-spin" style={{ animationDuration: "3s" }} />
        360
      </div>
    </div>
  )

  return <ViewerContent />
}
