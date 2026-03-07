"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, RefreshCw, Check, X, AlertTriangle, ExternalLink,
  Loader2, Settings, Download, Clock, Globe, Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface MarketplaceListing {
  id: string
  marketplace: 'olx' | 'webmotors' | 'mercadolivre' | 'icarros'
  externalId?: string
  status: 'pending' | 'active' | 'paused' | 'error' | 'removed'
  lastSync?: string
  errorMessage?: string
  url?: string
}

interface MarketplaceManagerProps {
  vehicleId: string
  vehicleName: string
}

const MARKETPLACES = [
  { 
    id: 'olx', 
    name: 'OLX', 
    logo: '/images/marketplaces/olx.png',
    color: 'bg-purple-500',
    description: 'Maior marketplace de classificados do Brasil'
  },
  { 
    id: 'webmotors', 
    name: 'Webmotors', 
    logo: '/images/marketplaces/webmotors.png',
    color: 'bg-orange-500',
    description: 'Portal especializado em veiculos'
  },
  { 
    id: 'mercadolivre', 
    name: 'Mercado Livre', 
    logo: '/images/marketplaces/mercadolivre.png',
    color: 'bg-yellow-500',
    description: 'Maior e-commerce da America Latina'
  },
  { 
    id: 'icarros', 
    name: 'iCarros', 
    logo: '/images/marketplaces/icarros.png',
    color: 'bg-blue-500',
    description: 'Portal de veiculos da Itau'
  }
]

export function MarketplaceManager({ vehicleId, vehicleName }: MarketplaceManagerProps) {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadListings()
  }, [vehicleId])

  async function loadListings() {
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/marketplaces`)
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings)
      } else {
        // Dados de demonstracao
        setListings([
          { id: '1', marketplace: 'olx', status: 'active', lastSync: new Date().toISOString(), externalId: 'OLX123456' },
          { id: '2', marketplace: 'webmotors', status: 'pending' },
        ])
      }
    } catch (error) {
      console.error('Erro ao carregar listings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleMarketplace(marketplace: string, enabled: boolean) {
    setSyncing(marketplace)
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/marketplaces`, {
        method: enabled ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketplace })
      })

      if (res.ok) {
        toast.success(enabled ? 'Veiculo publicado!' : 'Anuncio removido')
        loadListings()
      } else {
        toast.error('Erro ao atualizar')
      }
    } catch {
      toast.error('Erro ao atualizar')
    } finally {
      setSyncing(null)
    }
  }

  async function syncMarketplace(marketplace: string) {
    setSyncing(marketplace)
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/marketplaces/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketplace })
      })

      if (res.ok) {
        toast.success('Sincronizado!')
        loadListings()
      } else {
        toast.error('Erro ao sincronizar')
      }
    } catch {
      toast.error('Erro ao sincronizar')
    } finally {
      setSyncing(null)
    }
  }

  async function syncAll() {
    setSyncing('all')
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/marketplaces/sync-all`, {
        method: 'POST'
      })

      if (res.ok) {
        toast.success('Todos os marketplaces sincronizados!')
        loadListings()
      } else {
        toast.error('Erro ao sincronizar')
      }
    } catch {
      toast.error('Erro ao sincronizar')
    } finally {
      setSyncing(null)
    }
  }

  function getListing(marketplace: string) {
    return listings.find(l => l.marketplace === marketplace)
  }

  function getStatusBadge(status?: string) {
    const badges: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Ativo', variant: 'default' },
      pending: { label: 'Pendente', variant: 'secondary' },
      paused: { label: 'Pausado', variant: 'outline' },
      error: { label: 'Erro', variant: 'destructive' },
      removed: { label: 'Removido', variant: 'outline' }
    }
    const badge = badges[status || 'pending'] || badges.pending
    return <Badge variant={badge.variant}>{badge.label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              Marketplaces
            </CardTitle>
            <CardDescription>
              Publique este veiculo em multiplos marketplaces
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncAll}
              disabled={syncing !== null}
            >
              {syncing === 'all' ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="size-4 mr-2" />
              )}
              Sincronizar Todos
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configuracoes de Marketplaces</DialogTitle>
                  <DialogDescription>
                    Configure as credenciais de cada marketplace
                  </DialogDescription>
                </DialogHeader>
                <MarketplaceSettings />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MARKETPLACES.map((mp) => {
            const listing = getListing(mp.id)
            const isActive = listing?.status === 'active'
            const isSyncing = syncing === mp.id

            return (
              <div 
                key={mp.id}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg transition-colors",
                  isActive && "border-green-200 bg-green-50/50"
                )}
              >
                {/* Logo/Icon */}
                <div className={cn(
                  "size-12 rounded-lg flex items-center justify-center text-white font-bold",
                  mp.color
                )}>
                  {mp.name.substring(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{mp.name}</span>
                    {listing && getStatusBadge(listing.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{mp.description}</p>
                  {listing?.lastSync && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="size-3" />
                      Sincronizado: {new Date(listing.lastSync).toLocaleString('pt-BR')}
                    </p>
                  )}
                  {listing?.errorMessage && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertTriangle className="size-3" />
                      {listing.errorMessage}
                    </p>
                  )}
                </div>

                {/* Acoes */}
                <div className="flex items-center gap-3">
                  {listing?.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={listing.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                  
                  {listing && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => syncMarketplace(mp.id)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <RefreshCw className="size-4" />
                      )}
                    </Button>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      id={`mp-${mp.id}`}
                      checked={isActive}
                      onCheckedChange={(checked) => toggleMarketplace(mp.id, checked)}
                      disabled={isSyncing}
                    />
                    <Label htmlFor={`mp-${mp.id}`} className="sr-only">
                      {isActive ? 'Desativar' : 'Ativar'}
                    </Label>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumo */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {listings.filter(l => l.status === 'active').length} de {MARKETPLACES.length} marketplaces ativos
            </span>
            <Button variant="link" size="sm" className="gap-1">
              <Eye className="size-3" />
              Pre-visualizar anuncio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MarketplaceSettings() {
  return (
    <Tabs defaultValue="olx" className="mt-4">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="olx">OLX</TabsTrigger>
        <TabsTrigger value="webmotors">Webmotors</TabsTrigger>
        <TabsTrigger value="mercadolivre">ML</TabsTrigger>
        <TabsTrigger value="icarros">iCarros</TabsTrigger>
      </TabsList>
      
      {MARKETPLACES.map((mp) => (
        <TabsContent key={mp.id} value={mp.id} className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label>API Key / Token</Label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Insira sua API key"
              />
            </div>
            <div>
              <Label>ID da Conta / Loja</Label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="ID da sua conta no marketplace"
              />
            </div>
            <Button className="w-full">Salvar Configuracoes</Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

// Componente para exportar em lote
export function MarketplaceBulkExport() {
  const [exporting, setExporting] = useState<string | null>(null)

  async function exportFeed(marketplace: string) {
    setExporting(marketplace)
    try {
      const res = await fetch(`/api/admin/marketplaces/feed?marketplace=${marketplace}`)
      if (res.ok) {
        const data = await res.json()
        // Download como arquivo
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `feed-${marketplace}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        toast.success('Feed exportado!')
      } else {
        toast.error('Erro ao exportar')
      }
    } catch {
      toast.error('Erro ao exportar')
    } finally {
      setExporting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Feed de Veiculos</CardTitle>
        <CardDescription>
          Exporte todos os veiculos para integracao em lote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {MARKETPLACES.map((mp) => (
            <Button
              key={mp.id}
              variant="outline"
              className="justify-start gap-3"
              onClick={() => exportFeed(mp.id)}
              disabled={exporting !== null}
            >
              {exporting === mp.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Exportar para {mp.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
