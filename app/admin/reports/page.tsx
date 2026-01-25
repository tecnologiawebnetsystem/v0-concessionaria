import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
  Percent,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

async function getReportData() {
  // Vendas do mes atual
  const currentMonthSales = await sql`
    SELECT COALESCE(SUM(sale_price), 0) as total, COUNT(*) as count
    FROM sales 
    WHERE status = 'completed' 
    AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `.catch(() => [{ total: 0, count: 0 }])

  // Vendas do mes anterior
  const lastMonthSales = await sql`
    SELECT COALESCE(SUM(sale_price), 0) as total, COUNT(*) as count
    FROM sales 
    WHERE status = 'completed' 
    AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND created_at < DATE_TRUNC('month', CURRENT_DATE)
  `.catch(() => [{ total: 0, count: 0 }])

  // Veiculos
  const vehicles = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE published = true) as published,
      COUNT(*) FILTER (WHERE status = 'available') as available,
      COUNT(*) FILTER (WHERE status = 'sold') as sold
    FROM vehicles
  `

  // Propostas
  const proposals = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'approved') as approved,
      COUNT(*) FILTER (WHERE status = 'rejected') as rejected
    FROM proposals
  `.catch(() => [{ total: 0, pending: 0, approved: 0, rejected: 0 }])

  // Top veiculos mais vistos
  const topViewed = await sql`
    SELECT v.name, v.views_count, b.name as brand_name
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    ORDER BY v.views_count DESC
    LIMIT 5
  `

  // Contatos por status
  const inquiriesByStatus = await sql`
    SELECT status, COUNT(*) as count
    FROM inquiries
    GROUP BY status
  `

  return {
    currentMonthSales: currentMonthSales[0],
    lastMonthSales: lastMonthSales[0],
    vehicles: vehicles[0],
    proposals: proposals[0],
    topViewed,
    inquiriesByStatus,
  }
}

export default async function ReportsPage() {
  const data = await getReportData()

  const currentSalesValue = Number(data.currentMonthSales?.total || 0)
  const lastSalesValue = Number(data.lastMonthSales?.total || 0)
  const salesGrowth = lastSalesValue > 0 
    ? ((currentSalesValue - lastSalesValue) / lastSalesValue * 100).toFixed(1)
    : 0

  const mainMetrics = [
    {
      title: "Faturamento do Mes",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(currentSalesValue),
      change: `${Number(salesGrowth) >= 0 ? "+" : ""}${salesGrowth}%`,
      changePositive: Number(salesGrowth) >= 0,
      subtitle: `${data.currentMonthSales?.count || 0} vendas realizadas`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Veiculos em Estoque",
      value: data.vehicles?.available || 0,
      change: `${data.vehicles?.total || 0} total`,
      changePositive: true,
      subtitle: `${data.vehicles?.sold || 0} vendidos`,
      icon: Car,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Taxa de Conversao",
      value: data.proposals?.total > 0 
        ? `${((Number(data.proposals.approved) / Number(data.proposals.total)) * 100).toFixed(1)}%`
        : "0%",
      change: `${data.proposals?.approved || 0} aprovadas`,
      changePositive: true,
      subtitle: `de ${data.proposals?.total || 0} propostas`,
      icon: Target,
      color: "from-violet-500 to-violet-700",
    },
    {
      title: "Propostas Pendentes",
      value: data.proposals?.pending || 0,
      change: "Aguardando",
      changePositive: Number(data.proposals?.pending || 0) < 10,
      subtitle: "analise da equipe",
      icon: ShoppingCart,
      color: "from-amber-500 to-amber-700",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Relatorios</h1>
          <p className="text-slate-500">Analise o desempenho da sua concessionaria</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl bg-gradient-to-br ${metric.color} p-3 shadow-lg`}>
                  <metric.icon className="size-5 text-white" />
                </div>
                <Badge 
                  variant="outline"
                  className={metric.changePositive 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                    : "border-red-200 bg-red-50 text-red-700"
                  }
                >
                  {metric.changePositive 
                    ? <ArrowUpRight className="mr-1 size-3" /> 
                    : <ArrowDownRight className="mr-1 size-3" />
                  }
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <p className="text-sm text-slate-500">{metric.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Vehicles */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5 text-blue-500" />
              Veiculos Mais Vistos
            </CardTitle>
            <CardDescription>Ranking de visualizacoes no site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topViewed.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">Nenhum dado disponivel</p>
              ) : (
                data.topViewed.map((vehicle: any, index: number) => (
                  <div key={vehicle.name} className="flex items-center gap-4">
                    <div className={`flex size-8 items-center justify-center rounded-lg font-bold ${
                      index === 0 
                        ? "bg-amber-100 text-amber-700" 
                        : index === 1 
                          ? "bg-slate-200 text-slate-700"
                          : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{vehicle.name}</p>
                      <p className="text-sm text-slate-500">{vehicle.brand_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{vehicle.views_count}</p>
                      <p className="text-xs text-slate-500">visualizacoes</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Proposals Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-violet-500" />
              Status das Propostas
            </CardTitle>
            <CardDescription>Distribuicao das propostas recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: "Aprovadas", value: data.proposals?.approved || 0, total: data.proposals?.total || 1, color: "bg-emerald-500" },
                { label: "Pendentes", value: data.proposals?.pending || 0, total: data.proposals?.total || 1, color: "bg-amber-500" },
                { label: "Rejeitadas", value: data.proposals?.rejected || 0, total: data.proposals?.total || 1, color: "bg-red-500" },
              ].map((item) => {
                const percentage = (Number(item.value) / Number(item.total)) * 100

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.value} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 border-t pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{data.proposals?.total || 0}</p>
                <p className="text-sm text-slate-500">Total de Propostas</p>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {data.proposals?.total > 0 
                    ? ((Number(data.proposals.approved) / Number(data.proposals.total)) * 100).toFixed(0)
                    : 0}%
                </p>
                <p className="text-sm text-slate-500">Taxa de Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Exportar Relatorios</CardTitle>
          <CardDescription>Baixe os dados em diferentes formatos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Relatorio de Vendas", description: "Vendas do periodo selecionado", icon: DollarSign, format: "Excel" },
              { title: "Estoque de Veiculos", description: "Lista completa do estoque", icon: Car, format: "Excel" },
              { title: "Clientes e Propostas", description: "Base de clientes e leads", icon: Users, format: "CSV" },
              { title: "Relatorio Completo", description: "Todos os dados do sistema", icon: FileText, format: "PDF" },
            ].map((report) => (
              <Button
                key={report.title}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 text-left bg-transparent"
              >
                <div className="flex w-full items-center justify-between">
                  <report.icon className="size-5 text-slate-600" />
                  <Badge variant="secondary">{report.format}</Badge>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{report.title}</p>
                  <p className="text-xs text-slate-500">{report.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
