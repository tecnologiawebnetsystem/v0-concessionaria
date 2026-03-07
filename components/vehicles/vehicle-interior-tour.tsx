"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Hotspot {
  id: string
  x: number // porcentagem 0-100
  y: number // porcentagem 0-100
  label: string
  description?: string
}

interface InteriorScene {
  id: string
  name: string
  image: string
  hotspots?: Hotspot[]
}

interface VehicleInteriorTourProps {
  scenes: InteriorScene[]
  className?: string
}

export function VehicleInteriorTour({ scenes, className }: VehicleInteriorTourProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

  const currentScene = scenes[currentSceneIndex]

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [zoom, pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    
    const maxPan = (zoom - 1) * 200
    const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - startPan.x))
    const newY = Math.max(-maxPan, Math.min(maxPan, e.clientY - startPan.y))
    setPan({ x: newX, y: newY })
  }, [isDragging, zoom, startPan])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSceneIndex((prev) => (prev - 1 + scenes.length) % scenes.length)
        resetView()
      } else if (e.key === "ArrowRight") {
        setCurrentSceneIndex((prev) => (prev + 1) % scenes.length)
        resetView()
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [scenes.length, isFullscreen, resetView])

  if (scenes.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg h-[400px]", className)}>
        <p className="text-muted-foreground">Tour virtual nao disponivel</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-black",
        isFullscreen ? "fixed inset-0 z-50" : "h-[400px]",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default" }}
    >
      {/* Main image with pan and zoom */}
      <div
        className="w-full h-full transition-transform duration-100"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentScene.image}
          alt={currentScene.name}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Hotspots */}
        {currentScene.hotspots?.map((hotspot) => (
          <button
            key={hotspot.id}
            className={cn(
              "absolute w-8 h-8 -ml-4 -mt-4 rounded-full transition-all duration-200",
              "bg-primary/80 hover:bg-primary text-primary-foreground",
              "flex items-center justify-center",
              "animate-pulse hover:animate-none",
              "ring-4 ring-primary/30",
              activeHotspot === hotspot.id && "scale-125 animate-none"
            )}
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: `scale(${1 / zoom})`,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
            }}
          >
            <MapPin className="size-4" />
          </button>
        ))}
      </div>

      {/* Active hotspot info */}
      {activeHotspot && currentScene.hotspots && (
        <div className="absolute bottom-24 left-4 right-4 md:left-auto md:right-4 md:max-w-xs">
          {currentScene.hotspots
            .filter((h) => h.id === activeHotspot)
            .map((hotspot) => (
              <div
                key={hotspot.id}
                className="bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{hotspot.label}</h4>
                    {hotspot.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {hotspot.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={() => setActiveHotspot(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Scene name */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
          {currentScene.name}
        </Badge>
      </div>

      {/* Virtual tour badge */}
      <div className="absolute top-4 right-4">
        <Badge className="bg-primary text-primary-foreground">
          Tour Virtual
        </Badge>
      </div>

      {/* Scene selector */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            className={cn(
              "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
              index === currentSceneIndex
                ? "border-primary ring-2 ring-primary/30"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
            onClick={() => {
              setCurrentSceneIndex(index)
              resetView()
              setActiveHotspot(null)
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.image}
              alt={scene.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-20 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
        onClick={() => {
          setCurrentSceneIndex((prev) => (prev - 1 + scenes.length) % scenes.length)
          resetView()
          setActiveHotspot(null)
        }}
      >
        <ChevronLeft className="size-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
        onClick={() => {
          setCurrentSceneIndex((prev) => (prev + 1) % scenes.length)
          resetView()
          setActiveHotspot(null)
        }}
      >
        <ChevronRight className="size-6" />
      </Button>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
          disabled={zoom <= 1}
        >
          <ZoomOut className="size-4" />
        </Button>

        <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
          disabled={zoom >= 3}
        >
          <ZoomIn className="size-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={resetView}
          disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
        >
          <RotateCcw className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <X className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {/* Scene indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
        {scenes.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentSceneIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => {
              setCurrentSceneIndex(index)
              resetView()
              setActiveHotspot(null)
            }}
          />
        ))}
      </div>
    </div>
  )
}
