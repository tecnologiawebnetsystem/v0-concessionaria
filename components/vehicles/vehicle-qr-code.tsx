"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Download, Share2, Copy, Check, Printer } from "lucide-react"
import { toast } from "sonner"

interface VehicleQRCodeProps {
  vehicleId: string
  vehicleName: string
  vehicleSlug: string
  variant?: 'button' | 'card' | 'inline'
}

export function VehicleQRCode({ vehicleId, vehicleName, vehicleSlug, variant = 'button' }: VehicleQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const vehicleUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/veiculos/${vehicleSlug}`
    : `/veiculos/${vehicleSlug}`

  async function generateQR() {
    if (qrDataUrl) return
    
    setLoading(true)
    try {
      // Usar API para gerar QR code
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(vehicleUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
      setQrDataUrl(url)
    } catch (error) {
      // Fallback: usar API externa
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vehicleUrl)}`
      setQrDataUrl(qrUrl)
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(vehicleUrl)
    setCopied(true)
    toast.success('Link copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadQR() {
    if (!qrDataUrl) return
    
    const link = document.createElement('a')
    link.download = `qr-${vehicleSlug}.png`
    link.href = qrDataUrl
    link.click()
    toast.success('QR Code baixado!')
  }

  async function shareVehicle() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicleName,
          text: `Confira este veiculo: ${vehicleName}`,
          url: vehicleUrl
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyLink()
        }
      }
    } else {
      copyLink()
    }
  }

  function printQR() {
    if (!qrDataUrl) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${vehicleName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: system-ui, sans-serif;
              }
              img { max-width: 300px; }
              h2 { margin: 20px 0 5px; font-size: 18px; }
              p { margin: 5px 0; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <img src="${qrDataUrl}" alt="QR Code" />
            <h2>${vehicleName}</h2>
            <p>Escaneie para ver detalhes</p>
            <p style="font-size: 10px; color: #999;">${vehicleUrl}</p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Botao simples
  if (variant === 'button') {
    return (
      <Dialog onOpenChange={(open) => open && generateQR()}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <QrCode className="size-4" />
            QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Veiculo</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code ou compartilhe o link
            </DialogDescription>
          </DialogHeader>
          <QRCodeContent
            vehicleName={vehicleName}
            vehicleUrl={vehicleUrl}
            qrDataUrl={qrDataUrl}
            loading={loading}
            copied={copied}
            onCopy={copyLink}
            onDownload={downloadQR}
            onShare={shareVehicle}
            onPrint={printQR}
          />
        </DialogContent>
      </Dialog>
    )
  }

  // Gerar QR automaticamente para variant card
  useEffect(() => {
    if (variant === 'card') {
      generateQR()
    }
  }, [variant])

  // Card completo
  if (variant === 'card') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="size-5" />
            Compartilhar
          </CardTitle>
          <CardDescription>
            Mostre este QR Code para compartilhar rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QRCodeContent
            vehicleName={vehicleName}
            vehicleUrl={vehicleUrl}
            qrDataUrl={qrDataUrl}
            loading={loading}
            copied={copied}
            onCopy={copyLink}
            onDownload={downloadQR}
            onShare={shareVehicle}
            onPrint={printQR}
          />
        </CardContent>
      </Card>
    )
  }

  // Inline
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={shareVehicle}>
        <Share2 className="size-4" />
      </Button>
      <Dialog onOpenChange={(open) => open && generateQR()}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <QrCode className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <QRCodeContent
            vehicleName={vehicleName}
            vehicleUrl={vehicleUrl}
            qrDataUrl={qrDataUrl}
            loading={loading}
            copied={copied}
            onCopy={copyLink}
            onDownload={downloadQR}
            onShare={shareVehicle}
            onPrint={printQR}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QRCodeContent({
  vehicleName,
  vehicleUrl,
  qrDataUrl,
  loading,
  copied,
  onCopy,
  onDownload,
  onShare,
  onPrint
}: {
  vehicleName: string
  vehicleUrl: string
  qrDataUrl: string | null
  loading: boolean
  copied: boolean
  onCopy: () => void
  onDownload: () => void
  onShare: () => void
  onPrint: () => void
}) {
  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="flex justify-center">
        {loading ? (
          <div className="size-64 bg-muted animate-pulse rounded-lg" />
        ) : qrDataUrl ? (
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <img 
              src={qrDataUrl} 
              alt={`QR Code para ${vehicleName}`}
              className="size-56"
            />
          </div>
        ) : (
          <div className="size-64 bg-muted flex items-center justify-center rounded-lg">
            <QrCode className="size-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Nome do veiculo */}
      <div className="text-center">
        <p className="font-medium">{vehicleName}</p>
        <p className="text-xs text-muted-foreground truncate">{vehicleUrl}</p>
      </div>

      {/* Link para copiar */}
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <input
          type="text"
          value={vehicleUrl}
          readOnly
          className="flex-1 bg-transparent text-sm outline-none truncate"
        />
        <Button variant="ghost" size="sm" onClick={onCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>

      {/* Acoes */}
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="gap-2" onClick={onDownload} disabled={!qrDataUrl}>
          <Download className="size-4" />
          Baixar
        </Button>
        <Button variant="outline" className="gap-2" onClick={onShare}>
          <Share2 className="size-4" />
          Enviar
        </Button>
        <Button variant="outline" className="gap-2" onClick={onPrint} disabled={!qrDataUrl}>
          <Printer className="size-4" />
          Imprimir
        </Button>
      </div>
    </div>
  )
}
