"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X, Smartphone, Zap, Bell, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Verificar se ja esta instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)
    if (standalone) return

    // Verificar se e iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Verificar se ja foi dispensado recentemente
    const dismissed = localStorage.getItem('pwa_install_dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) return
    }

    // Capturar evento de instalacao
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Mostrar apos um delay
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Para iOS, mostrar prompt customizado
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 5000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  function dismiss() {
    setShowPrompt(false)
    localStorage.setItem('pwa_install_dismissed', new Date().toISOString())
  }

  if (isStandalone || !showPrompt) return null

  // Prompt para iOS
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom">
        <Card className="shadow-lg border-primary/20">
          <CardContent className="p-4">
            <button onClick={dismiss} className="absolute top-2 right-2">
              <X className="size-4 text-muted-foreground" />
            </button>
            <div className="flex gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="size-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Instale nosso app</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Adicione a tela inicial para acesso rapido
                </p>
                <ol className="text-xs text-muted-foreground space-y-1">
                  <li>1. Toque no botao <strong>Compartilhar</strong></li>
                  <li>2. Role e toque em <strong>Adicionar a Tela de Inicio</strong></li>
                  <li>3. Toque em <strong>Adicionar</strong></li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prompt padrao
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-lg border-primary/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-4">
          <button onClick={dismiss} className="absolute top-3 right-3">
            <X className="size-4 text-muted-foreground" />
          </button>
          
          <div className="flex gap-4 mb-4">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Download className="size-7 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Instale o App</h4>
              <p className="text-sm text-muted-foreground">
                Tenha acesso rapido aos melhores veiculos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <Zap className="size-4 mx-auto mb-1 text-yellow-500" />
              <span className="text-xs">Mais rapido</span>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <Bell className="size-4 mx-auto mb-1 text-blue-500" />
              <span className="text-xs">Notificacoes</span>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <Wifi className="size-4 mx-auto mb-1 text-green-500" />
              <span className="text-xs">Offline</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1 gap-2">
              <Download className="size-4" />
              Instalar Agora
            </Button>
            <Button variant="ghost" onClick={dismiss}>
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
