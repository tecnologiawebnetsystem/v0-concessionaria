"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { 
  Camera, 
  RotateCw, 
  Video, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  X,
  Maximize2
} from "lucide-react"
import { Vehicle360Viewer } from "./vehicle-360-viewer"
import { VehicleInteriorTour } from "./vehicle-interior-tour"
import { VehicleVideoPlayer } from "./vehicle-video-player"
import { cn } from "@/lib/utils"

interface VehicleMedia {
  id: string
  type: "image" | "360" | "video" | "interior"
  url: string
  thumbnail?: string
  title?: string
}

interface ImmersiveGalleryProps {
  images: string[]
  media360?: string[] // Array de imagens para 360
  interiorScenes?: {
    id: string
    name: string
    image: string
    hotspots?: { id: string; x: number; y: number; label: string; description?: string }[]
  }[]
  videos?: { url: string; poster?: string; title?: string }[]
  className?: string
}

export function ImmersiveGallery({
  images,
  media360 = [],
  interiorScenes = [],
  videos = [],
  className,
}: ImmersiveGalleryProps) {
  const [activeTab, setActiveTab] = useState("photos")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const has360 = media360.length > 0
  const hasInterior = interiorScenes.length > 0
  const hasVideos = videos.length > 0

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
    } else {
      setLightboxIndex((prev) => (prev + 1) % images.length)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tabs for different media types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
          <TabsTrigger value="photos" className="flex items-center gap-2 py-2">
            <Camera className="size-4" />
            <span className="hidden sm:inline">Fotos</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {images.length}
            </Badge>
          </TabsTrigger>
          
          {has360 && (
            <TabsTrigger value="360" className="flex items-center gap-2 py-2">
              <RotateCw className="size-4" />
              <span className="hidden sm:inline">360</span>
              <Badge className="ml-1 px-1.5 py-0 text-xs bg-primary">Novo</Badge>
            </TabsTrigger>
          )}
          
          {hasInterior && (
            <TabsTrigger value="interior" className="flex items-center gap-2 py-2">
              <Compass className="size-4" />
              <span className="hidden sm:inline">Interior</span>
            </TabsTrigger>
          )}
          
          {hasVideos && (
            <TabsTrigger value="video" className="flex items-center gap-2 py-2">
              <Video className="size-4" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Photos tab */}
        <TabsContent value="photos" className="mt-4">
          <div className="space-y-4">
            {/* Main image */}
            <div 
              className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted cursor-pointer group"
              onClick={() => openLightbox(selectedImageIndex)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImageIndex]}
                alt={`Foto ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Zoom indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm rounded-full p-3">
                  <ZoomIn className="size-6" />
                </div>
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
                    }}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((prev) => (prev + 1) % images.length)
                    }}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox(selectedImageIndex)
                }}
              >
                <Maximize2 className="size-4" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all",
                    index === selectedImageIndex
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  )}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 360 tab */}
        {has360 && (
          <TabsContent value="360" className="mt-4">
            <Vehicle360Viewer images={media360} autoRotate={false} />
          </TabsContent>
        )}

        {/* Interior tour tab */}
        {hasInterior && (
          <TabsContent value="interior" className="mt-4">
            <VehicleInteriorTour scenes={interiorScenes} />
          </TabsContent>
        )}

        {/* Video tab */}
        {hasVideos && (
          <TabsContent value="video" className="mt-4">
            <div className="space-y-4">
              {videos.map((video, index) => (
                <VehicleVideoPlayer
                  key={index}
                  src={video.url}
                  poster={video.poster}
                  title={video.title}
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="size-6" />
            </Button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 size-12"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="size-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 size-12"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="size-8" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "shrink-0 w-16 h-12 rounded overflow-hidden transition-all",
                    index === lightboxIndex
                      ? "ring-2 ring-primary"
                      : "opacity-50 hover:opacity-100"
                  )}
                  onClick={() => setLightboxIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
