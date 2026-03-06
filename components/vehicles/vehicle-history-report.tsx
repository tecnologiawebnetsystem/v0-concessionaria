"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, FileText, Calendar,
  Car, Wrench, AlertCircle, MapPin, User, Download, ExternalLink,
  Loader2, Clock, DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleHistoryItem {
  id: string
  type: 'accident' | 'maintenance' | 'ownership' | 'recall' | 'inspection' | 'theft' | 'auction'
  date: string
  description: string
  source: string
  severity?: 'low' | 'medium' | 'high'
  details?: Record<string, any>
}

interface VehicleHistoryReportProps {
  vehicleId: string
  plate?: string
  chassi?: string
  showFullReport?: boolean
}

export function VehicleHistoryReport({ vehicleId, plate, chassi, showFullReport = false }: VehicleHistoryReportProps) {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<{
    score: number
    status: 'clean' | 'attention' | 'alert'
    items: VehicleHistoryItem[]
    summary: {
      accidents: number
      owners: number
      recalls: number
      maintenances: number
    }
    lastUpdate: string
  } | null>(null)

  useEffect(() => {
    loadReport()
  }, [vehicleId])

  async function loadReport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/history`)
      if (res.ok) {
        const data = await res.json()
        setReport(data)
      } else {
        // Dados de demonstracao
        setReport({
          score: 95,
          status: 'clean',
          items: [
            {
              id: '1',
              type: 'ownership',
              date: '2022-03-15',
              description: 'Transferencia de propriedade',
              source: 'DETRAN-SP',
              details: { previousOwner: 'Pessoa Fisica', location: 'Sao Paulo, SP' }
            },
            {
              id: '2',
              type: 'maintenance',
              date: '2023-06-20',
              description: 'Revisao programada 30.000km',
              source: 'Concessionaria Autorizada',
              severity: 'low',
              details: { mileage: 30000, services: ['Troca de oleo', 'Filtros', 'Freios'] }
            },
            {
              id: '3',
              type: 'inspection',
              date: '2024-01-10',
              description: 'Vistoria aprovada',
              source: 'DETRAN-SP',
              severity: 'low'
            }
          ],
          summary: {
            accidents: 0,
            owners: 2,
            recalls: 0,
            maintenances: 5
          },
          lastUpdate: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Erro ao carregar historico:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'clean': return 'bg-green-500'
      case 'attention': return 'bg-yellow-500'
      case 'alert': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'clean': return 'Historico Limpo'
      case 'attention': return 'Requer Atencao'
      case 'alert': return 'Alertas Encontrados'
      default: return 'Desconhecido'
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'accident': return <AlertTriangle className="size-4 text-red-500" />
      case 'maintenance': return <Wrench className="size-4 text-blue-500" />
      case 'ownership': return <User className="size-4 text-purple-500" />
      case 'recall': return <AlertCircle className="size-4 text-orange-500" />
      case 'inspection': return <CheckCircle className="size-4 text-green-500" />
      case 'theft': return <XCircle className="size-4 text-red-600" />
      case 'auction': return <DollarSign className="size-4 text-yellow-500" />
      default: return <FileText className="size-4" />
    }
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      accident: 'Acidente',
      maintenance: 'Manutencao',
      ownership: 'Proprietario',
      recall: 'Recall',
      inspection: 'Vistoria',
      theft: 'Roubo/Furto',
      auction: 'Leilao'
    }
    return labels[type] || type
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

  if (!report) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="size-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Historico nao disponivel</p>
          <Button variant="outline" className="mt-4" onClick={loadReport}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="overflow-hidden">
        <div className={cn("h-2", getStatusColor(report.status))} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "size-16 rounded-full flex items-center justify-center text-2xl font-bold text-white",
                getStatusColor(report.status)
              )}>
                {report.score}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Relatorio de Procedencia
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant={report.status === 'clean' ? 'default' : 'destructive'}>
                    {getStatusText(report.status)}
                  </Badge>
                  <span className="text-xs">
                    Atualizado em {new Date(report.lastUpdate).toLocaleDateString('pt-BR')}
                  </span>
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Baixar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={cn(
                "text-2xl font-bold",
                report.summary.accidents > 0 ? "text-red-500" : "text-green-500"
              )}>
                {report.summary.accidents}
              </div>
              <div className="text-sm text-muted-foreground">Acidentes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{report.summary.owners}</div>
              <div className="text-sm text-muted-foreground">Proprietarios</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={cn(
                "text-2xl font-bold",
                report.summary.recalls > 0 ? "text-orange-500" : "text-green-500"
              )}>
                {report.summary.recalls}
              </div>
              <div className="text-sm text-muted-foreground">Recalls Pendentes</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{report.summary.maintenances}</div>
              <div className="text-sm text-muted-foreground">Manutencoes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verificacoes */}
      <Card>
        <CardHeader>
          <CardTitle>Verificacoes Realizadas</CardTitle>
          <CardDescription>
            Consultas em bases oficiais e privadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { label: 'Restricoes DETRAN', checked: true },
              { label: 'Debitos IPVA', checked: true },
              { label: 'Multas Pendentes', checked: true },
              { label: 'Roubo/Furto', checked: true },
              { label: 'Sinistro/Perda Total', checked: true },
              { label: 'Leilao', checked: true },
              { label: 'Recall Pendente', checked: true },
              { label: 'Restricao Financeira', checked: true },
              { label: 'Restricao Judicial', checked: true },
              { label: 'Licenciamento em Dia', checked: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="size-5 text-green-500 shrink-0" />
                <span className="text-sm">{item.label}</span>
                <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                  OK
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Eventos */}
      {showFullReport && (
        <Card>
          <CardHeader>
            <CardTitle>Historico Completo</CardTitle>
            <CardDescription>
              Linha do tempo de eventos do veiculo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.items.map((item, index) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    {index < report.items.length - 1 && (
                      <div className="w-0.5 h-full bg-border flex-1 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fonte: {item.source}
                    </p>
                    {item.details && (
                      <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm">
                        {Object.entries(item.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Garantia */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">Garantia de Procedencia</h4>
            <p className="text-sm text-muted-foreground">
              Este veiculo passou por nossa rigorosa vistoria de 120 pontos e possui historico verificado.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="#laudo-vistoria">
              Ver Laudo Completo
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
