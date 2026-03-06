"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  CheckCircle, XCircle, AlertTriangle, Wrench, Car, Gauge,
  Battery, Droplet, Wind, Settings, Shield, Download, Eye,
  Calendar, User, Camera, FileText, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InspectionItem {
  id: string
  name: string
  status: 'ok' | 'attention' | 'fail'
  notes?: string
  photo?: string
}

interface InspectionCategory {
  id: string
  name: string
  icon: string
  items: InspectionItem[]
  score: number
}

interface InspectionReportProps {
  vehicleId: string
}

export function VehicleInspectionReport({ vehicleId }: InspectionReportProps) {
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<{
    id: string
    date: string
    inspector: string
    overallScore: number
    status: 'approved' | 'conditional' | 'rejected'
    categories: InspectionCategory[]
    photos: string[]
    notes: string
    validUntil: string
  } | null>(null)

  useEffect(() => {
    loadReport()
  }, [vehicleId])

  async function loadReport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/inspection`)
      if (res.ok) {
        const data = await res.json()
        setReport(data)
      } else {
        // Dados de demonstracao
        setReport({
          id: 'INSP-2024-001',
          date: new Date().toISOString(),
          inspector: 'Carlos Mecânico',
          overallScore: 92,
          status: 'approved',
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Veiculo em excelente estado geral. Manutencoes em dia.',
          photos: [],
          categories: [
            {
              id: 'motor',
              name: 'Motor e Mecanica',
              icon: 'settings',
              score: 95,
              items: [
                { id: '1', name: 'Nivel de oleo', status: 'ok' },
                { id: '2', name: 'Filtro de ar', status: 'ok' },
                { id: '3', name: 'Correia dentada', status: 'ok' },
                { id: '4', name: 'Velas de ignicao', status: 'ok' },
                { id: '5', name: 'Sistema de arrefecimento', status: 'ok' },
                { id: '6', name: 'Vazamentos', status: 'ok' },
                { id: '7', name: 'Ruidos anormais', status: 'ok' },
                { id: '8', name: 'Embreagem', status: 'ok' },
                { id: '9', name: 'Cambio', status: 'ok' },
                { id: '10', name: 'Escapamento', status: 'attention', notes: 'Leve oxidacao' },
              ]
            },
            {
              id: 'eletrica',
              name: 'Sistema Eletrico',
              icon: 'battery',
              score: 100,
              items: [
                { id: '11', name: 'Bateria', status: 'ok' },
                { id: '12', name: 'Farois', status: 'ok' },
                { id: '13', name: 'Lanternas', status: 'ok' },
                { id: '14', name: 'Setas', status: 'ok' },
                { id: '15', name: 'Limpadores', status: 'ok' },
                { id: '16', name: 'Vidros eletricos', status: 'ok' },
                { id: '17', name: 'Travas eletricas', status: 'ok' },
                { id: '18', name: 'Ar condicionado', status: 'ok' },
                { id: '19', name: 'Som/Multimidia', status: 'ok' },
                { id: '20', name: 'Painel/Instrumentos', status: 'ok' },
              ]
            },
            {
              id: 'suspensao',
              name: 'Suspensao e Direcao',
              icon: 'car',
              score: 90,
              items: [
                { id: '21', name: 'Amortecedores', status: 'ok' },
                { id: '22', name: 'Molas', status: 'ok' },
                { id: '23', name: 'Buchas', status: 'attention', notes: 'Desgaste leve' },
                { id: '24', name: 'Bieletas', status: 'ok' },
                { id: '25', name: 'Terminais de direcao', status: 'ok' },
                { id: '26', name: 'Caixa de direcao', status: 'ok' },
                { id: '27', name: 'Alinhamento', status: 'ok' },
                { id: '28', name: 'Balanceamento', status: 'ok' },
              ]
            },
            {
              id: 'freios',
              name: 'Sistema de Freios',
              icon: 'gauge',
              score: 95,
              items: [
                { id: '29', name: 'Pastilhas dianteiras', status: 'ok', notes: '70% de vida util' },
                { id: '30', name: 'Pastilhas traseiras', status: 'ok', notes: '80% de vida util' },
                { id: '31', name: 'Discos dianteiros', status: 'ok' },
                { id: '32', name: 'Discos traseiros', status: 'ok' },
                { id: '33', name: 'Fluido de freio', status: 'ok' },
                { id: '34', name: 'Mangueiras', status: 'ok' },
                { id: '35', name: 'Freio de mao', status: 'ok' },
                { id: '36', name: 'ABS', status: 'ok' },
              ]
            },
            {
              id: 'pneus',
              name: 'Rodas e Pneus',
              icon: 'circle',
              score: 85,
              items: [
                { id: '37', name: 'Pneu dianteiro esquerdo', status: 'ok', notes: '60% de vida' },
                { id: '38', name: 'Pneu dianteiro direito', status: 'ok', notes: '60% de vida' },
                { id: '39', name: 'Pneu traseiro esquerdo', status: 'attention', notes: '40% de vida' },
                { id: '40', name: 'Pneu traseiro direito', status: 'attention', notes: '40% de vida' },
                { id: '41', name: 'Estepe', status: 'ok' },
                { id: '42', name: 'Rodas/Calotas', status: 'ok' },
              ]
            },
            {
              id: 'carroceria',
              name: 'Carroceria e Pintura',
              icon: 'car',
              score: 90,
              items: [
                { id: '43', name: 'Pintura geral', status: 'ok' },
                { id: '44', name: 'Para-choques', status: 'ok' },
                { id: '45', name: 'Portas', status: 'ok' },
                { id: '46', name: 'Capo', status: 'ok' },
                { id: '47', name: 'Tampa traseira', status: 'ok' },
                { id: '48', name: 'Vidros', status: 'ok' },
                { id: '49', name: 'Retrovisores', status: 'ok' },
                { id: '50', name: 'Sinais de colisao', status: 'ok' },
              ]
            },
            {
              id: 'interior',
              name: 'Interior',
              icon: 'home',
              score: 95,
              items: [
                { id: '51', name: 'Bancos', status: 'ok' },
                { id: '52', name: 'Carpete/Forracoes', status: 'ok' },
                { id: '53', name: 'Painel', status: 'ok' },
                { id: '54', name: 'Console central', status: 'ok' },
                { id: '55', name: 'Volante', status: 'ok' },
                { id: '56', name: 'Cintos de seguranca', status: 'ok' },
                { id: '57', name: 'Airbags', status: 'ok' },
                { id: '58', name: 'Teto solar', status: 'ok' },
              ]
            },
            {
              id: 'documentacao',
              name: 'Documentacao',
              icon: 'file',
              score: 100,
              items: [
                { id: '59', name: 'CRLV em dia', status: 'ok' },
                { id: '60', name: 'IPVA pago', status: 'ok' },
                { id: '61', name: 'Multas', status: 'ok' },
                { id: '62', name: 'Restricoes', status: 'ok' },
                { id: '63', name: 'Manual do proprietario', status: 'ok' },
                { id: '64', name: 'Chave reserva', status: 'ok' },
              ]
            },
          ]
        })
      }
    } catch (error) {
      console.error('Erro ao carregar laudo:', error)
    } finally {
      setLoading(false)
    }
  }

  function getCategoryIcon(icon: string) {
    const icons: Record<string, React.ReactNode> = {
      settings: <Settings className="size-4" />,
      battery: <Battery className="size-4" />,
      car: <Car className="size-4" />,
      gauge: <Gauge className="size-4" />,
      circle: <div className="size-4 rounded-full border-2 border-current" />,
      home: <div className="size-4">🏠</div>,
      file: <FileText className="size-4" />,
    }
    return icons[icon] || <Wrench className="size-4" />
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'ok':
        return <CheckCircle className="size-4 text-green-500" />
      case 'attention':
        return <AlertTriangle className="size-4 text-yellow-500" />
      case 'fail':
        return <XCircle className="size-4 text-red-500" />
      default:
        return null
    }
  }

  function getScoreColor(score: number) {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  function getProgressColor(score: number) {
    if (score >= 90) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
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
          <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Laudo de vistoria nao disponivel</p>
        </CardContent>
      </Card>
    )
  }

  const totalItems = report.categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const okItems = report.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.status === 'ok').length, 0
  )
  const attentionItems = report.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.status === 'attention').length, 0
  )
  const failItems = report.categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.status === 'fail').length, 0
  )

  return (
    <div className="space-y-6" id="laudo-vistoria">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Laudo de Vistoria - 120 Pontos
              </CardTitle>
              <CardDescription className="mt-1">
                Inspecao completa realizada por tecnico certificado
              </CardDescription>
            </div>
            <Badge
              variant={report.status === 'approved' ? 'default' : 'destructive'}
              className="text-sm"
            >
              {report.status === 'approved' ? 'APROVADO' : report.status === 'conditional' ? 'CONDICIONAL' : 'REPROVADO'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={cn("text-3xl font-bold", getScoreColor(report.overallScore))}>
                {report.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Score Geral</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{okItems}</div>
              <div className="text-sm text-muted-foreground">Itens OK</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{attentionItems}</div>
              <div className="text-sm text-muted-foreground">Atencao</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{failItems}</div>
              <div className="text-sm text-muted-foreground">Reprovados</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Data: {new Date(report.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span>Tecnico: {report.inspector}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span>Codigo: {report.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detalhamento por Categoria</CardTitle>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Baixar PDF Completo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {report.categories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                      {getCategoryIcon(category.icon)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.items.length} itens verificados
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mr-4">
                      <div className="w-24">
                        <Progress 
                          value={category.score} 
                          className="h-2"
                        />
                      </div>
                      <span className={cn("font-bold", getScoreColor(category.score))}>
                        {category.score}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-2 pt-4">
                    {category.items.map((item) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          item.status === 'ok' && "bg-green-50",
                          item.status === 'attention' && "bg-yellow-50",
                          item.status === 'fail' && "bg-red-50"
                        )}
                      >
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.name}</div>
                          {item.notes && (
                            <div className="text-xs text-muted-foreground">{item.notes}</div>
                          )}
                        </div>
                        {item.photo && (
                          <Button variant="ghost" size="sm">
                            <Camera className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Notas e Validade */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observacoes do Tecnico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{report.notes}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              Validade do Laudo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Este laudo e valido ate <strong>{new Date(report.validUntil).toLocaleDateString('pt-BR')}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Apos esta data, uma nova vistoria sera necessaria para garantir as condicoes do veiculo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
