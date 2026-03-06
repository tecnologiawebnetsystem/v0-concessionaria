"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, Gift, Copy, Check, Share2, Mail, MessageCircle,
  DollarSign, Trophy, Clock, ChevronRight, Loader2, Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  convertedReferrals: number
  totalEarned: number
  pendingReward: number
  referralCode: string
  referralLink: string
  nextReward: {
    referralsNeeded: number
    currentReferrals: number
    rewardAmount: number
  }
}

interface Referral {
  id: string
  name: string
  email: string
  status: 'pending' | 'registered' | 'converted' | 'paid'
  date: string
  reward?: number
}

export function ReferralProgram() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [statsRes, referralsRes] = await Promise.all([
        fetch('/api/referrals/stats'),
        fetch('/api/referrals')
      ])
      
      if (statsRes.ok && referralsRes.ok) {
        setStats(await statsRes.json())
        setReferrals(await referralsRes.json())
      } else {
        // Dados de demonstracao
        setStats({
          totalReferrals: 5,
          pendingReferrals: 2,
          convertedReferrals: 3,
          totalEarned: 1500,
          pendingReward: 500,
          referralCode: 'JOAO500',
          referralLink: `${window.location.origin}?ref=JOAO500`,
          nextReward: {
            referralsNeeded: 5,
            currentReferrals: 3,
            rewardAmount: 500
          }
        })
        setReferrals([
          { id: '1', name: 'Maria Silva', email: 'm***@email.com', status: 'converted', date: '2024-01-15', reward: 500 },
          { id: '2', name: 'Pedro Santos', email: 'p***@email.com', status: 'converted', date: '2024-02-10', reward: 500 },
          { id: '3', name: 'Ana Costa', email: 'a***@email.com', status: 'converted', date: '2024-03-05', reward: 500 },
          { id: '4', name: 'Carlos Oliveira', email: 'c***@email.com', status: 'registered', date: '2024-03-15' },
          { id: '5', name: 'Julia Lima', email: 'j***@email.com', status: 'pending', date: '2024-03-20' },
        ])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    if (stats) {
      navigator.clipboard.writeText(stats.referralLink)
      setCopied(true)
      toast.success('Link copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function copyCode() {
    if (stats) {
      navigator.clipboard.writeText(stats.referralCode)
      toast.success('Codigo copiado!')
    }
  }

  async function sendInvite() {
    if (!inviteEmail) return
    setSending(true)
    try {
      const res = await fetch('/api/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      })
      if (res.ok) {
        toast.success('Convite enviado!')
        setInviteEmail('')
      } else {
        toast.error('Erro ao enviar convite')
      }
    } catch {
      toast.error('Erro ao enviar')
    } finally {
      setSending(false)
    }
  }

  function shareWhatsApp() {
    if (stats) {
      const text = encodeURIComponent(
        `Compre seu carro com desconto! Use meu codigo ${stats.referralCode} e ganhe R$ 500 de desconto. Acesse: ${stats.referralLink}`
      )
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }
  }

  function getStatusBadge(status: string) {
    const badges = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      registered: { label: 'Cadastrado', variant: 'outline' as const },
      converted: { label: 'Convertido', variant: 'default' as const },
      paid: { label: 'Pago', variant: 'default' as const }
    }
    const badge = badges[status as keyof typeof badges] || badges.pending
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Erro ao carregar programa de indicacao</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <CardContent className="py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">Programa de Indicacao</Badge>
              <h2 className="text-3xl font-bold mb-2">Indique e Ganhe R$ 500</h2>
              <p className="text-white/80 mb-6">
                Para cada amigo que comprar um veiculo usando seu codigo, voce ganha R$ 500 em dinheiro 
                e seu amigo ganha R$ 500 de desconto!
              </p>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Gift className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ {stats.totalEarned.toLocaleString('pt-BR')}</div>
                  <div className="text-sm text-white/70">Total ganho</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <label className="text-sm text-white/70">Seu codigo de indicacao</label>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 font-mono text-xl font-bold tracking-wider">
                  {stats.referralCode}
                </div>
                <Button variant="secondary" onClick={copyCode}>
                  <Copy className="size-4" />
                </Button>
              </div>
              <div className="mt-4">
                <label className="text-sm text-white/70">Ou compartilhe seu link</label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    value={stats.referralLink} 
                    readOnly 
                    className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button variant="secondary" onClick={copyLink}>
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" className="flex-1 gap-2" onClick={shareWhatsApp}>
                  <MessageCircle className="size-4" />
                  WhatsApp
                </Button>
                <Button variant="secondary" className="flex-1 gap-2">
                  <Mail className="size-4" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="size-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                <div className="text-sm text-muted-foreground">Total de indicacoes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="size-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="size-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.convertedReferrals}</div>
                <div className="text-sm text-muted-foreground">Convertidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="size-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">R$ {stats.pendingReward}</div>
                <div className="text-sm text-muted-foreground">A receber</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso para proxima recompensa */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="size-5 text-yellow-500" />
              <span className="font-medium">Proxima meta de bonus</span>
            </div>
            <Badge variant="secondary">
              R$ {stats.nextReward.rewardAmount} bonus
            </Badge>
          </div>
          <Progress 
            value={(stats.nextReward.currentReferrals / stats.nextReward.referralsNeeded) * 100} 
            className="h-3"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {stats.nextReward.currentReferrals} de {stats.nextReward.referralsNeeded} indicacoes convertidas. 
            Faltam apenas {stats.nextReward.referralsNeeded - stats.nextReward.currentReferrals}!
          </p>
        </CardContent>
      </Card>

      {/* Convidar por email e lista de indicacoes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Convidar por Email</CardTitle>
            <CardDescription>
              Envie um convite personalizado para seus amigos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={sendInvite} disabled={sending || !inviteEmail}>
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suas Indicacoes</CardTitle>
            <CardDescription>
              Acompanhe o status de cada indicacao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {referrals.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma indicacao ainda. Comece a compartilhar seu codigo!
                </p>
              ) : (
                referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{referral.name}</div>
                      <div className="text-xs text-muted-foreground">{referral.email}</div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(referral.status)}
                      {referral.reward && (
                        <div className="text-xs text-green-600 mt-1">
                          +R$ {referral.reward}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Como funciona */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Share2 className="size-8 text-primary" />
              </div>
              <h4 className="font-medium mb-2">1. Compartilhe</h4>
              <p className="text-sm text-muted-foreground">
                Envie seu codigo ou link para amigos e familiares
              </p>
            </div>
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="size-8 text-primary" />
              </div>
              <h4 className="font-medium mb-2">2. Amigo Compra</h4>
              <p className="text-sm text-muted-foreground">
                Seu amigo usa o codigo e ganha R$ 500 de desconto
              </p>
            </div>
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="size-8 text-primary" />
              </div>
              <h4 className="font-medium mb-2">3. Voce Ganha</h4>
              <p className="text-sm text-muted-foreground">
                Receba R$ 500 em dinheiro apos a compra ser finalizada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
