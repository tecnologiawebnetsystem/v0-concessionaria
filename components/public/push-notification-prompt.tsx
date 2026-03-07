"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, Check, TrendingDown, Car, Clock, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PushNotificationPromptProps {
  variant?: 'banner' | 'modal' | 'inline'
  vehicleId?: string
}

export function PushNotificationPrompt({ variant = 'banner', vehicleId }: PushNotificationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Verificar se notificacoes sao suportadas
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported')
      return
    }

    setPermission(Notification.permission)

    // Mostrar prompt apos delay se ainda nao foi decidido
    if (Notification.permission === 'default') {
      const dismissed = localStorage.getItem('push_dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  async function requestPermission() {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        // Registrar service worker e subscription
        await registerPushSubscription()
        toast.success('Notificacoes ativadas!')
        setShowPrompt(false)
      } else {
        toast.error('Permissao negada')
      }
    } catch (error) {
      console.error('Erro ao solicitar permissao:', error)
      toast.error('Erro ao ativar notificacoes')
    }
  }

  async function registerPushSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Buscar VAPID public key do servidor
      const res = await fetch('/api/push/vapid-key')
      const { publicKey } = await res.json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      })

      // Enviar subscription para o servidor
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          vehicleId
        })
      })
    } catch (error) {
      console.error('Erro ao registrar subscription:', error)
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  function dismiss() {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('push_dismissed', 'true')
  }

  if (permission === 'unsupported' || permission === 'denied' || dismissed || !showPrompt) {
    return null
  }

  if (permission === 'granted') {
    return null
  }

  // Banner no topo
  if (variant === 'banner') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4 animate-in slide-in-from-top">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="font-medium">Ative as notificacoes</p>
              <p className="text-sm text-white/80">
                Receba alertas de queda de preco e novos veiculos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={requestPermission}>
              Ativar
            </Button>
            <Button variant="ghost" size="icon" onClick={dismiss}>
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Card inline
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Bell className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">Nao perca nenhuma oportunidade!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ative as notificacoes para receber:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="size-4 text-green-500" />
                <span>Queda de preco</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="size-4 text-blue-500" />
                <span>Novos veiculos</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-orange-500" />
                <span>Promocoes relampago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gift className="size-4 text-purple-500" />
                <span>Cupons exclusivos</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={requestPermission} className="gap-2">
                <Bell className="size-4" />
                Ativar Notificacoes
              </Button>
              <Button variant="ghost" onClick={dismiss}>
                Agora nao
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar na pagina do veiculo
export function VehiclePriceAlert({ vehicleId, currentPrice }: { vehicleId: string; currentPrice: number }) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function subscribe() {
    setLoading(true)
    try {
      // Primeiro verificar permissao de notificacao
      if (Notification.permission !== 'granted') {
        const result = await Notification.requestPermission()
        if (result !== 'granted') {
          toast.error('Ative as notificacoes primeiro')
          setLoading(false)
          return
        }
      }

      // Registrar alerta de preco
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, targetPrice: currentPrice * 0.95 })
      })

      if (res.ok) {
        setSubscribed(true)
        toast.success('Voce sera notificado quando o preco baixar!')
      } else {
        toast.error('Erro ao criar alerta')
      }
    } catch {
      toast.error('Erro ao criar alerta')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
        <Check className="size-4" />
        Alerta de preco ativado
      </div>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={subscribe}
      disabled={loading}
    >
      <Bell className="size-4" />
      Avisar quando baixar
    </Button>
  )
}
