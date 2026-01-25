import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
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
    SELECT v.*, b.name as brand_name, 
    (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count
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

  const mainStats = [
    {
      title: "Vendas do Mes",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.monthlySales),
      subtitle: `${stats.monthlySalesCount} vendas realizadas`,
      icon: DollarSign,
      trend: "+12%",
      trendUp: true,
      color: "from-emerald-500 to-emerald-700",
      shadowColor: "shadow-emerald-500/30",
    },
    {
      title: "Veiculos em Estoque",
      value: stats.vehicles.toString(),
      subtitle: "Disponiveis para venda",
      icon: Car,
      trend: "+3",
      trendUp: true,
      color: "from-blue-500 to-blue-700",
      shadowColor: "shadow-blue-500/30",
    },
    {
      title: "Propostas Pendentes",
      value: stats.pendingProposals.toString(),
      subtitle: "Aguardando analise",
      icon: ShoppingCart,
      trend: stats.pendingProposals > 5 ? "Atencao" : "Normal",
      trendUp: stats.pendingProposals <= 5,
      color: "from-amber-500 to-amber-700",
      shadowColor: "shadow-amber-500/30",
    },
    {
      title: "Test Drives Agendados",
      value: stats.scheduledTestDrives.toString(),
      subtitle: "Proximos dias",
      icon: Calendar,
      trend: "Esta semana",
      trendUp: true,
      color: "from-violet-500 to-violet-700",
      shadowColor: "shadow-violet-500/30",
    },
  ]

  const quickStats = [
    { title: "Usuarios Ativos", value: stats.users, icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "Posts no Blog", value: stats.blogPosts, icon: FileText, color: "text-purple-600 bg-purple-50" },
    { title: "Novos Contatos", value: stats.newInquiries, icon: MessageSquare, color: "text-orange-600 bg-orange-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Dashboard</h1>
          <p className="text-slate-500">Bem-vindo ao painel administrativo da Nacional Veiculos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/reports">
              Ver Relatorios
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30">
            <Link href="/admin/vehicles/new">
              Adicionar Veiculo
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg ${stat.shadowColor}`}>
                  <stat.icon className="size-6 text-white" />
                </div>
                <Badge 
                  variant={stat.trendUp ? "default" : "destructive"} 
                  className={stat.trendUp ? "bg-emerald-100 text-emerald-700" : ""}
                >
                  {stat.trendUp ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Vehicles */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Veiculos Recentes</CardTitle>
              <CardDescription>Ultimos veiculos cadastrados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/vehicles" className="text-blue-600">
                Ver todos
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Car className="mb-2 size-12 text-slate-300" />
                  <p className="text-sm text-slate-500">Nenhum veiculo cadastrado ainda</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/admin/vehicles/new">Cadastrar primeiro veiculo</Link>
                  </Button>
                </div>
              ) : (
                stats.recentVehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                        <Car className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{vehicle.name}</p>
                        <p className="text-sm text-slate-500">
                          {vehicle.brand_name} - {vehicle.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(vehicle.price))}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                        <Eye className="size-3" />
                        {vehicle.views_count} views
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Contatos Recentes</CardTitle>
              <CardDescription>Ultimas mensagens recebidas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/inquiries" className="text-blue-600">
                Ver todos
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="mb-2 size-12 text-slate-300" />
                  <p className="text-sm text-slate-500">Nenhum contato recebido ainda</p>
                </div>
              ) : (
                stats.recentInquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="flex items-start justify-between rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-1.5 ${
                        inquiry.status === "new" 
                          ? "bg-amber-100 text-amber-600" 
                          : inquiry.status === "contacted"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-emerald-100 text-emerald-600"
                      }`}>
                        {inquiry.status === "new" ? (
                          <Clock className="size-4" />
                        ) : inquiry.status === "contacted" ? (
                          <AlertCircle className="size-4" />
                        ) : (
                          <CheckCircle2 className="size-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{inquiry.name}</p>
                        <p className="text-sm text-slate-500">{inquiry.email}</p>
                        {inquiry.vehicle_name && (
                          <p className="mt-1 text-xs text-blue-600">Interesse: {inquiry.vehicle_name}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        inquiry.status === "new"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : inquiry.status === "contacted"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }
                    >
                      {inquiry.status === "new" ? "Novo" : inquiry.status === "contacted" ? "Contatado" : "Fechado"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Acoes Rapidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcoes mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Novo Veiculo", href: "/admin/vehicles/new", icon: Car, color: "from-blue-500 to-blue-600" },
              { title: "Nova Venda", href: "/admin/sales", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
              { title: "Ver Propostas", href: "/admin/proposals", icon: ShoppingCart, color: "from-amber-500 to-amber-600" },
              { title: "Test Drives", href: "/admin/test-drives", icon: Calendar, color: "from-violet-500 to-violet-600" },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className={`rounded-lg bg-gradient-to-br ${action.color} p-2.5 text-white shadow-lg`}>
                  <action.icon className="size-5" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">{action.title}</span>
                <ArrowUpRight className="ml-auto size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
