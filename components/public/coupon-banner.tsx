"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Tag, Copy, Check, Gift, Clock, Sparkles, X, ChevronRight, Loader2, Percent
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'gift'
  value: number
  description: string
  minValue?: number
  maxDiscount?: number
  expiresAt: string
  usageLimit?: number
  usageCount: number
}

interface CouponBannerProps {
  position?: 'top' | 'floating' | 'inline'
  vehiclePrice?: number
}

export function CouponBanner({ position = 'inline', vehiclePrice }: CouponBannerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadCoupons()
  }, [])

  async function loadCoupons() {
    try {
      const res = await fetch('/api/coupons/available')
      if (res.ok) {
        const data = await res.json()
        setCoupons(data.coupons)
      } else {
        // Dados de demonstracao
        setCoupons([
          {
            id: '1',
            code: 'PRIMEIRA10',
            type: 'percentage',
            value: 10,
            description: 'Desconto de 10% na sua primeira compra',
            maxDiscount: 5000,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 45
          },
          {
            id: '2',
            code: 'SEMANA500',
            type: 'fixed',
            value: 500,
            description: 'R$ 500 OFF em qualquer veiculo',
            minValue: 30000,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 12
          },
          {
            id: '3',
            code: 'IPVAGRATIS',
            type: 'gift',
            value: 0,
            description: 'IPVA 2024 por nossa conta!',
            minValue: 50000,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 8
          },
        ])
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error)
    } finally {
      setLoading(false)
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    toast.success(`Cupom ${code} copiado!`)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatValue(coupon: Coupon) {
    if (coupon.type === 'percentage') return `${coupon.value}% OFF`
    if (coupon.type === 'fixed') return `R$ ${coupon.value} OFF`
    return 'BRINDE'
  }

  function getTimeRemaining(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`
    return 'Expirando!'
  }

  function calculateDiscount(coupon: Coupon, price: number) {
    if (coupon.type === 'percentage') {
      const discount = price * (coupon.value / 100)
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
    }
    if (coupon.type === 'fixed') return coupon.value
    return 0
  }

  if (loading || coupons.length === 0 || dismissed) return null

  const mainCoupon = coupons[0]

  // Banner topo fixo
  if (position === 'top') {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 px-4">
        <div className="container flex items-center justify-center gap-4">
          <Sparkles className="size-4 animate-pulse" />
          <span className="text-sm font-medium">
            Use o cupom <strong>{mainCoupon.code}</strong> e ganhe {formatValue(mainCoupon)}!
          </span>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-7 gap-1"
            onClick={() => copyCode(mainCoupon.code)}
          >
            {copied === mainCoupon.code ? <Check className="size-3" /> : <Copy className="size-3" />}
            Copiar
          </Button>
          <button onClick={() => setDismissed(true)} className="ml-2">
            <X className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  // Banner flutuante
  if (position === 'floating') {
    return (
      <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-right">
        <Card className="w-72 shadow-lg border-primary/20">
          <button 
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 size-6 bg-background border rounded-full flex items-center justify-center"
          >
            <X className="size-3" />
          </button>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-primary">{formatValue(mainCoupon)}</div>
                <div className="text-xs text-muted-foreground">{mainCoupon.description}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input value={mainCoupon.code} readOnly className="font-mono text-center" />
              <Button size="icon" onClick={() => copyCode(mainCoupon.code)}>
                {copied === mainCoupon.code ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                Expira em {getTimeRemaining(mainCoupon.expiresAt)}
              </span>
              <Dialog open={showAll} onOpenChange={setShowAll}>
                <DialogTrigger asChild>
                  <button className="text-primary hover:underline">
                    Ver todos ({coupons.length})
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cupons Disponiveis</DialogTitle>
                    <DialogDescription>
                      Use estes codigos para obter descontos
                    </DialogDescription>
                  </DialogHeader>
                  <CouponList coupons={coupons} onCopy={copyCode} copied={copied} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Banner inline
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="size-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-primary">{formatValue(mainCoupon)}</span>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="size-3" />
                  {getTimeRemaining(mainCoupon.expiresAt)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{mainCoupon.description}</p>
              {vehiclePrice && (
                <p className="text-xs text-green-600 mt-1">
                  Voce economiza R$ {calculateDiscount(mainCoupon, vehiclePrice).toLocaleString('pt-BR')} neste veiculo!
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Input 
                value={mainCoupon.code} 
                readOnly 
                className="border-0 w-32 font-mono text-center bg-background" 
              />
              <Button 
                variant="ghost" 
                className="rounded-none border-l h-10"
                onClick={() => copyCode(mainCoupon.code)}
              >
                {copied === mainCoupon.code ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            {coupons.length > 1 && (
              <Dialog open={showAll} onOpenChange={setShowAll}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    +{coupons.length - 1} cupons
                    <ChevronRight className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Todos os Cupons</DialogTitle>
                    <DialogDescription>
                      Escolha o melhor cupom para sua compra
                    </DialogDescription>
                  </DialogHeader>
                  <CouponList coupons={coupons} onCopy={copyCode} copied={copied} vehiclePrice={vehiclePrice} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CouponList({ 
  coupons, 
  onCopy, 
  copied,
  vehiclePrice 
}: { 
  coupons: Coupon[]
  onCopy: (code: string) => void
  copied: string | null
  vehiclePrice?: number
}) {
  function formatValue(coupon: Coupon) {
    if (coupon.type === 'percentage') return `${coupon.value}% OFF`
    if (coupon.type === 'fixed') return `R$ ${coupon.value} OFF`
    return 'BRINDE'
  }

  function getTimeRemaining(expiresAt: string) {
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`
    return 'Hoje'
  }

  return (
    <div className="space-y-3 mt-4">
      {coupons.map((coupon) => (
        <div 
          key={coupon.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className={cn(
            "size-12 rounded-full flex items-center justify-center",
            coupon.type === 'percentage' && "bg-blue-100 text-blue-600",
            coupon.type === 'fixed' && "bg-green-100 text-green-600",
            coupon.type === 'gift' && "bg-purple-100 text-purple-600"
          )}>
            {coupon.type === 'percentage' && <Percent className="size-5" />}
            {coupon.type === 'fixed' && <Tag className="size-5" />}
            {coupon.type === 'gift' && <Gift className="size-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatValue(coupon)}</span>
              <Badge variant="outline" className="text-xs">
                {getTimeRemaining(coupon.expiresAt)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{coupon.description}</p>
            {coupon.minValue && (
              <p className="text-xs text-muted-foreground">
                Min: R$ {coupon.minValue.toLocaleString('pt-BR')}
              </p>
            )}
          </div>
          <Button onClick={() => onCopy(coupon.code)} variant="outline" className="gap-2">
            <span className="font-mono">{coupon.code}</span>
            {copied === coupon.code ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      ))}
    </div>
  )
}

// Componente para aplicar cupom no checkout
export function CouponInput({ 
  onApply,
  appliedCoupon 
}: { 
  onApply: (coupon: Coupon | null) => void
  appliedCoupon?: Coupon | null
}) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleApply() {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() })
      })
      const data = await res.json()
      if (data.valid) {
        onApply(data.coupon)
        toast.success('Cupom aplicado!')
        setCode('')
      } else {
        setError(data.error || 'Cupom invalido')
      }
    } catch {
      setError('Erro ao validar cupom')
    } finally {
      setLoading(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-600" />
          <span className="text-sm">
            Cupom <strong>{appliedCoupon.code}</strong> aplicado
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onApply(null)}>
          Remover
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Codigo do cupom"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="font-mono"
        />
        <Button onClick={handleApply} disabled={loading || !code}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : 'Aplicar'}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
