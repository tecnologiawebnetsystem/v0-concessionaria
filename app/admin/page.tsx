import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { 
  Car, 
  FileText, 
  Users, 
  MessageSquare, 
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Zap,
  BarChart3,
  Activity,
  Sparkles,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"

async function getStats() {
  const [vehicles, users, blogPosts, inquiries, sales] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM vehicles WHERE published = true`,
    sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`,
    sql`SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'`,
    sql`SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'`,
    sql`SELECT COALESCE(SUM(sale_price), 0) as total, COUNT(*) as count FROM sales WHERE status = 'completed' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`.catch(() => [{ total: 0, count: 0 }]),
  ])

  const recentVehicles = await sql`
    SELECT v.*, b.name as brand_name
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    ORDER BY v.created_at DESC
    LIMIT 5
  `

  const recentInquiries = await sql`
    SELECT i.*, v.name as vehicle_name
    FROM inquiries i
    LEFT JOIN vehicles v ON i.vehicle_id = v.id
    ORDER BY i.created_at DESC
    LIMIT 5
  `

  const pendingProposals = await sql`
    SELECT COUNT(*) as count FROM proposals WHERE status = 'pending'
  `.catch(() => [{ count: 0 }])

  const scheduledTestDrives = await sql`
    SELECT COUNT(*) as count FROM test_drives WHERE status = 'scheduled' AND scheduled_date >= CURRENT_DATE
  `.catch(() => [{ count: 0 }])

  return {
    vehicles: Number(vehicles[0].count),
    users: Number(users[0].count),
    blogPosts: Number(blogPosts[0].count),
    newInquiries: Number(inquiries[0].count),
    monthlySales: Number(sales[0]?.total || 0),
    monthlySalesCount: Number(sales[0]?.count || 0),
    pendingProposals: Number(pendingProposals[0]?.count || 0),
    scheduledTestDrives: Number(scheduledTestDrives[0]?.count || 0),
    recentVehicles,
    recentInquiries,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen">
      {/* Header com efeito de luz */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="relative px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-cyan-400" />
                Dashboard
              </h1>
              <p className="text-blue-200/70 mt-1">Bem-vindo ao painel de controle da Nacional Veiculos</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse inline-block" />
                Sistema Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cards de Metricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vendas do Mes */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-2xl shadow-blue-500/25 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100/80 text-sm font-medium">Vendas do Mes</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.monthlySalesCount}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-300" />
                    <span className="text-emerald-300 text-sm font-medium">+23%</span>
                    <span className="text-blue-200/60 text-xs">vs mes anterior</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Veiculos em Estoque */}
          <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 border-0 shadow-2xl shadow-cyan-500/25 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100/80 text-sm font-medium">Veiculos em Estoque</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.vehicles}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-cyan-200/80 text-xs">Disponiveis para venda</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Car className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Propostas Pendentes */}
          <Card className="bg-gradient-to-br from-violet-600 to-violet-700 border-0 shadow-2xl shadow-violet-500/25 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100/80 text-sm font-medium">Propostas Pendentes</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.pendingProposals}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {stats.pendingProposals > 0 && (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-300" />
                        <span className="text-amber-300 text-xs">Aguardando analise</span>
                      </>
                    )}
                    {stats.pendingProposals === 0 && (
                      <span className="text-violet-200/80 text-xs">Nenhuma pendente</span>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ShoppingCart className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Drives */}
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 shadow-2xl shadow-emerald-500/25 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100/80 text-sm font-medium">Test Drives Agendados</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats.scheduledTestDrives}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                    <span className="text-emerald-200/80 text-xs">Proximos dias</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Usuarios Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.users}</p>
                </div>
                <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-0">
                  Clientes
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Novos Contatos</p>
                  <p className="text-2xl font-bold text-white">{stats.newInquiries}</p>
                </div>
                {stats.newInquiries > 0 && (
                  <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-0">
                    Pendentes
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Receita do Mes</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.monthlySales)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Veiculos Recentes */}
          <Card className="lg:col-span-2 bg-slate-900/60 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Car className="h-5 w-5 text-cyan-400" />
                  Veiculos Recentes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" asChild>
                  <Link href="/admin/vehicles">
                    Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700/50">
                {stats.recentVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Car className="mb-3 h-12 w-12 text-slate-600" />
                    <p className="text-slate-400">Nenhum veiculo cadastrado ainda</p>
                    <Button variant="link" asChild className="mt-2 text-cyan-400">
                      <Link href="/admin/vehicles/new">Cadastrar primeiro veiculo</Link>
                    </Button>
                  </div>
                ) : (
                  stats.recentVehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                          <Car className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{vehicle.name}</p>
                          <p className="text-slate-400 text-sm">{vehicle.brand_name} - {vehicle.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white font-semibold">{formatCurrency(Number(vehicle.price))}</p>
                          <div className="flex items-center gap-1 text-slate-400 text-sm justify-end">
                            <Eye className="h-3 w-3" />
                            {vehicle.views_count || 0}
                          </div>
                        </div>
                        <Badge className={
                          vehicle.status === "available" ? "bg-emerald-500/20 text-emerald-400 border-0" :
                          vehicle.status === "reserved" ? "bg-amber-500/20 text-amber-400 border-0" :
                          "bg-blue-500/20 text-blue-400 border-0"
                        }>
                          {vehicle.status === "available" ? "Disponivel" :
                           vehicle.status === "reserved" ? "Reservado" : "Vendido"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acoes Rapidas */}
          <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Acoes Rapidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-0 text-white shadow-lg shadow-blue-500/25" asChild>
                <Link href="/admin/vehicles/new">
                  <Car className="h-4 w-4 mr-2" />
                  Cadastrar Veiculo
                </Link>
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 border-0 text-white shadow-lg shadow-cyan-500/25" asChild>
                <Link href="/admin/proposals">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Propostas
                </Link>
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 border-0 text-white shadow-lg shadow-violet-500/25" asChild>
                <Link href="/admin/test-drives">
                  <Calendar className="h-4 w-4 mr-2" />
                  Test Drives
                </Link>
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border-0 text-white shadow-lg shadow-emerald-500/25" asChild>
                <Link href="/admin/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatorios
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent" asChild>
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuarios
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contatos Recentes */}
        <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                Contatos Recentes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10" asChild>
                <Link href="/admin/inquiries">
                  Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-700/50">
              {stats.recentInquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="mb-3 h-12 w-12 text-slate-600" />
                  <p className="text-slate-400">Nenhum contato recebido ainda</p>
                </div>
              ) : (
                stats.recentInquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-violet-400 font-semibold">
                          {(inquiry.name || "C")[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{inquiry.name}</p>
                        <p className="text-slate-400 text-sm">{inquiry.email}</p>
                        {inquiry.vehicle_name && (
                          <p className="text-cyan-400 text-xs mt-0.5">Interesse: {inquiry.vehicle_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(inquiry.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <Badge className={
                        inquiry.status === "new" ? "bg-amber-500/20 text-amber-400 border-0" :
                        inquiry.status === "contacted" ? "bg-blue-500/20 text-blue-400 border-0" :
                        "bg-emerald-500/20 text-emerald-400 border-0"
                      }>
                        {inquiry.status === "new" ? "Novo" : 
                         inquiry.status === "contacted" ? "Contatado" : "Fechado"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-5 w-5 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">Tempo Real</Badge>
              </div>
              <p className="text-slate-400 text-sm">Posts no Blog</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.blogPosts}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-5 w-5 text-emerald-400" />
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm">Taxa de Conversao</p>
              <p className="text-2xl font-bold text-white mt-1">4.8%</p>
              <p className="text-emerald-400 text-sm mt-1">+0.6% esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-5 w-5 text-violet-400" />
                <ArrowUpRight className="h-4 w-4 text-violet-400" />
              </div>
              <p className="text-slate-400 text-sm">Visualizacoes Hoje</p>
              <p className="text-2xl font-bold text-white mt-1">2.847</p>
              <p className="text-violet-400 text-sm mt-1">+12% vs ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-5 w-5 text-amber-400" />
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm">Ticket Medio</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.monthlySales / Math.max(stats.monthlySalesCount, 1))}</p>
              <p className="text-emerald-400 text-sm mt-1">Por venda</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
