"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Monitor,
  Smartphone,
  Download,
  CheckCircle2,
  Chrome,
  Globe,
  ArrowRight,
  Wifi,
  Shield,
  Zap,
  LayoutDashboard,
} from "lucide-react"
import Image from "next/image"

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [browser, setBrowser] = useState<"chrome" | "edge" | "safari" | "other">("other")

  useEffect(() => {
    // Detectar browser
    const ua = navigator.userAgent
    if (ua.includes("Edg/")) setBrowser("edge")
    else if (ua.includes("Chrome")) setBrowser("chrome")
    else if (ua.includes("Safari")) setBrowser("safari")

    // Captura o evento de instalação do PWA
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler)

    // Detecta se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setInstalled(true)
    setDeferredPrompt(null)
  }

  const steps = {
    chrome: [
      { step: 1, text: 'Clique no ícone de instalação na barra de endereço (ícone de monitor com seta)' },
      { step: 2, text: 'Ou acesse o menu (3 pontos) → "Instalar GT Veículos Admin"' },
      { step: 3, text: 'Clique em "Instalar" na janela que aparecer' },
      { step: 4, text: 'O ícone GT Admin aparecerá na área de trabalho' },
    ],
    edge: [
      { step: 1, text: 'Clique no ícone de aplicativo na barra de endereço' },
      { step: 2, text: 'Ou acesse o menu (...) → Aplicativos → "Instalar este site como aplicativo"' },
      { step: 3, text: 'Confirme em "Instalar"' },
      { step: 4, text: 'O ícone GT Admin aparecerá no menu Iniciar' },
    ],
    safari: [
      { step: 1, text: 'Toque no botão de compartilhar (quadrado com seta para cima)' },
      { step: 2, text: 'Role para baixo e toque em "Adicionar à Tela de Início"' },
      { step: 3, text: 'Toque em "Adicionar" no canto superior direito' },
      { step: 4, text: 'O ícone GT Admin aparecerá na sua tela de início' },
    ],
    other: [
      { step: 1, text: 'Use Google Chrome ou Microsoft Edge para melhor experiência' },
      { step: 2, text: 'Acesse as configurações do seu browser' },
      { step: 3, text: 'Procure a opção "Instalar aplicativo" ou "Adicionar à área de trabalho"' },
      { step: 4, text: 'Confirme a instalação' },
    ],
  }

  const currentSteps = steps[browser]

  const BrowserIcon = browser === "edge" ? Globe : Chrome

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <img src="/images/logo-gt-veiculos.png" alt="GT Veículos" className="h-16 w-auto" />
        <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs tracking-wider uppercase">
          Painel Administrativo
        </Badge>
      </div>

      {/* Título */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Instale o App GT Admin
        </h1>
        <p className="text-gray-400 text-base max-w-md">
          Acesse o painel direto da sua área de trabalho, sem precisar abrir o browser.
        </p>
      </div>

      {/* Cards de benefícios */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 w-full max-w-2xl">
        {[
          { icon: Zap, label: "Acesso rápido", sub: "Sem digitar URL" },
          { icon: Wifi, label: "Funciona offline", sub: "Cache local" },
          { icon: Shield, label: "Sessão salva", sub: "Login automático" },
          { icon: LayoutDashboard, label: "Tela cheia", sub: "Sem barra do browser" },
        ].map(({ icon: Icon, label, sub }) => (
          <Card key={label} className="bg-gray-800/40 border-gray-700/50">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="size-9 rounded-lg bg-red-600/20 flex items-center justify-center">
                <Icon className="size-4 text-red-400" />
              </div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status / botão de instalação */}
      <div className="w-full max-w-md mb-8">
        {installed ? (
          <div className="flex items-center justify-center gap-3 bg-green-600/20 border border-green-500/30 rounded-xl p-4">
            <CheckCircle2 className="size-6 text-green-400" />
            <div>
              <p className="text-green-300 font-semibold">App instalado com sucesso!</p>
              <p className="text-green-500 text-sm">Abra o ícone GT Admin na sua área de trabalho</p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <Button
            onClick={handleInstall}
            size="lg"
            className="w-full bg-red-600 hover:bg-red-500 text-white text-base h-14 gap-3 shadow-lg shadow-red-600/30"
          >
            <Download className="size-5" />
            Instalar GT Admin agora
          </Button>
        ) : (
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">
              Use o guia abaixo para instalar manualmente no seu browser
            </p>
          </div>
        )}
      </div>

      {/* Guia passo a passo */}
      <Card className="w-full max-w-md bg-gray-800/40 border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <BrowserIcon className="size-5 text-blue-400" />
            <h2 className="text-white font-semibold capitalize">
              Instalação manual — {browser === "other" ? "Outro browser" : browser.charAt(0).toUpperCase() + browser.slice(1)}
            </h2>
          </div>
          <ol className="space-y-3">
            {currentSteps.map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="size-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-5 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="size-4 text-gray-500" />
              <p className="text-xs text-gray-500">Compatível com</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Chrome 73+", "Edge 79+", "Safari 14+", "Firefox 116+"].map((b) => (
                <Badge key={b} variant="outline" className="border-gray-700 text-gray-400 text-xs">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voltar ao painel */}
      <div className="mt-8">
        <a
          href="/admin"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          <ArrowRight className="size-4 rotate-180" />
          Voltar ao painel
        </a>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-gray-600">
        GT Veículos Taubaté — Painel Administrativo v1.0
      </p>
    </div>
  )
}
