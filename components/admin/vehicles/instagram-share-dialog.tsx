"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Instagram, Download, Copy, Loader2, Check, ImageIcon } from "lucide-react"

type Vehicle = {
  id: string
  name: string
  model: string
  year: number
  price: number
  mileage?: number
  color?: string
  fuel_type?: string
  transmission?: string
  description?: string
  brand_name?: string
  category_name?: string
  image_url?: string
}

type InstagramShareDialogProps = {
  vehicle: Vehicle
  trigger?: React.ReactNode
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(price)
}

function generateCaption(vehicle: Vehicle) {
  const brand = vehicle.brand_name || ""
  const model = vehicle.name
  const year = vehicle.year
  const price = formatPrice(vehicle.price)
  const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString("pt-BR")} km` : "0 km"
  const fuel = vehicle.fuel_type || ""
  const transmission = vehicle.transmission || ""
  const color = vehicle.color || ""

  let caption = `${brand} ${model} ${year}\n\n`
  caption += `${price}\n\n`
  
  const specs = []
  if (mileage) specs.push(`${mileage}`)
  if (fuel) specs.push(fuel.charAt(0).toUpperCase() + fuel.slice(1))
  if (transmission) specs.push(transmission.charAt(0).toUpperCase() + transmission.slice(1))
  if (color) specs.push(color)
  
  if (specs.length > 0) {
    caption += specs.join(" | ") + "\n\n"
  }

  caption += "Venha conhecer! Entre em contato pelo link na bio.\n\n"
  
  // Hashtags
  const hashtags = [
    "#carros",
    "#veiculos",
    "#seminovos",
    "#carrosusados",
    "#ofertas",
    "#oportunidade",
  ]
  
  if (brand) {
    hashtags.push(`#${brand.toLowerCase().replace(/\s+/g, "")}`)
  }
  
  caption += hashtags.join(" ")

  return caption
}

export function InstagramShareDialog({ vehicle, trigger }: InstagramShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState(() => generateCaption(vehicle))
  const [copied, setCopied] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      toast.success("Legenda copiada!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Erro ao copiar legenda")
    }
  }

  async function handleGenerateImage() {
    setGeneratingImage(true)
    try {
      // Gerar imagem usando Canvas no cliente
      const canvas = document.createElement("canvas")
      canvas.width = 1080
      canvas.height = 1080
      const ctx = canvas.getContext("2d")
      
      if (!ctx) throw new Error("Canvas not supported")

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 1080)
      gradient.addColorStop(0, "#1f2937")
      gradient.addColorStop(1, "#111827")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1080, 1080)

      // Se tiver imagem do veículo, carrega e desenha
      if (vehicle.image_url) {
        try {
          const img = new Image()
          img.crossOrigin = "anonymous"
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error("Failed to load image"))
            img.src = vehicle.image_url!
          })
          
          // Desenhar imagem cobrindo todo o canvas
          const scale = Math.max(1080 / img.width, 1080 / img.height)
          const x = (1080 - img.width * scale) / 2
          const y = (1080 - img.height * scale) / 2
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        } catch {
          // Se falhar, mantém o background gradiente
        }
      }

      // Overlay escuro na parte inferior
      const overlayGradient = ctx.createLinearGradient(0, 500, 0, 1080)
      overlayGradient.addColorStop(0, "rgba(0,0,0,0)")
      overlayGradient.addColorStop(0.5, "rgba(0,0,0,0.7)")
      overlayGradient.addColorStop(1, "rgba(0,0,0,0.95)")
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, 1080, 1080)

      // Badge "DISPONÍVEL"
      ctx.fillStyle = "#dc2626"
      roundRect(ctx, 40, 40, 200, 50, 25)
      ctx.fill()
      ctx.font = "bold 20px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText("DISPONÍVEL", 140, 72)

      // Nome do veículo
      ctx.textAlign = "left"
      ctx.font = "bold 42px Arial"
      ctx.fillStyle = "white"
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetY = 2
      const title = `${vehicle.brand_name || ""} ${vehicle.name}`.trim()
      ctx.fillText(title, 60, 880)
      ctx.shadowBlur = 0

      // Especificações
      ctx.font = "28px Arial"
      ctx.fillStyle = "#e5e5e5"
      const specs = [
        vehicle.year.toString(),
        vehicle.mileage ? `${vehicle.mileage.toLocaleString("pt-BR")} km` : null,
        vehicle.fuel_type,
        vehicle.transmission,
      ].filter(Boolean).join(" • ")
      ctx.fillText(specs, 60, 930)

      // Preço
      ctx.fillStyle = "#dc2626"
      roundRect(ctx, 60, 960, 400, 70, 10)
      ctx.fill()
      ctx.font = "bold 36px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(formatPrice(vehicle.price), 260, 1008)

      // CTA
      ctx.textAlign = "right"
      ctx.font = "20px Arial"
      ctx.fillStyle = "#a3a3a3"
      ctx.fillText("Link na bio", 1020, 1008)

      // Converter para blob URL
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
      })
      const url = URL.createObjectURL(blob)
      setGeneratedImageUrl(url)
      toast.success("Imagem gerada com sucesso!")
    } catch (err) {
      console.error("Erro ao gerar imagem:", err)
      toast.error("Erro ao gerar imagem para Instagram")
    } finally {
      setGeneratingImage(false)
    }
  }

  // Helper para desenhar retângulo com bordas arredondadas
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  async function handleDownloadImage() {
    if (!generatedImageUrl) return

    try {
      const response = await fetch(generatedImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${vehicle.name.replace(/\s+/g, "-").toLowerCase()}-instagram.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Imagem baixada!")
    } catch {
      toast.error("Erro ao baixar imagem")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" title="Compartilhar no Instagram">
            <Instagram className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="size-5" />
            Compartilhar no Instagram
          </DialogTitle>
          <DialogDescription>
            Gere uma imagem otimizada e copie a legenda pronta para postar no Instagram
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Imagem */}
          <div className="space-y-3">
            <Label>Imagem para o Feed (1080x1080)</Label>
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="Preview Instagram"
                  className="size-full object-cover"
                />
              ) : vehicle.image_url ? (
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="size-full object-cover opacity-50"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-12" />
                  <p className="mt-2 text-sm">Sem imagem</p>
                </div>
              )}
              
              {!generatedImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className="gap-2"
                  >
                    {generatingImage ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="size-4" />
                        Gerar Imagem
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {generatedImageUrl && (
              <div className="flex gap-2">
                <Button onClick={handleDownloadImage} className="flex-1 gap-2">
                  <Download className="size-4" />
                  Baixar Imagem
                </Button>
                <Button 
                  onClick={() => { setGeneratedImageUrl(null); handleGenerateImage() }} 
                  variant="outline"
                  disabled={generatingImage}
                >
                  {generatingImage ? <Loader2 className="size-4 animate-spin" /> : "Regenerar"}
                </Button>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Legenda</Label>
              <span className="text-xs text-muted-foreground">
                {caption.length}/2200 caracteres
              </span>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={12}
              className="resize-none font-mono text-sm"
              maxLength={2200}
            />
            <Button onClick={handleCopyCaption} variant="outline" className="w-full gap-2">
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copiar Legenda
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Como publicar:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Clique em "Gerar Imagem" para criar a imagem otimizada</li>
            <li>Baixe a imagem gerada</li>
            <li>Copie a legenda</li>
            <li>Abra o Instagram e crie um novo post</li>
            <li>Selecione a imagem baixada e cole a legenda</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}
