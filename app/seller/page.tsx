import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { 
  DollarSign, 
  Car, 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Zap,
  ChevronRight,
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getSellerStats(userId: string) {
  const [seller] = await sql`
    SELECT * FROM sellers WHERE user_id = ${userId}
  `
  
  if (!seller) return null

  const sellerId = seller.id
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [monthSales] = await sql`
    SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(final_price), 0) as total_value,
      COALESCE(SUM(commission_value), 0) as total_commission
    FROM sales 
    WHERE seller_id = ${sellerId}
    AND EXTRACT(MONTH FROM sale_date) = ${currentMonth}
    AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
    AND status IN ('approved', 'completed')
  `

  const [pendingCommissions] = await sql`
    SELECT COALESCE(SUM(commission_value), 0) as total
    FROM sales 
    WHERE seller_id = ${sellerId}
    AND commission_paid = false
    AND status IN ('approved', 'completed')
  `

  const [monthGoal] = await sql`
    SELECT * FROM sales_goals 
    WHERE seller_id = ${sellerId}
    AND month = ${currentMonth}
    AND year = ${currentYear}
  `

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
  
  const [lastMonthSales] = await sql`
    SELECT COUNT(*) as total_sales, COALESCE(SUM(final_price), 0) as total_value
    FROM sales 
    WHERE seller_id = ${sellerId}
    AND EXTRACT(MONTH FROM sale_date) = ${lastMonth}
    AND EXTRACT(YEAR FROM sale_date) = ${lastMonthYear}
    AND status IN ('approved', 'completed')
  `

  const recentSales = await sql`
    SELECT s.*, v.name as vehicle_name, b.name as brand_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    LEFT JOIN brands b ON v.brand_id = b.id
    WHERE s.seller_id = ${sellerId}
    ORDER BY s.sale_date DESC
    LIMIT 5
  `

  const upcomingAppointments = await sql`
    SELECT * FROM test_drives
    WHERE preferred_date >= CURRENT_DATE
    ORDER BY preferred_date, preferred_time
    LIMIT 5
  `

  const ranking = await sql`
    SELECT 
      s.id,
      u.name,
      COUNT(sa.id) as total_sales,
      COALESCE(SUM(sa.final_price), 0) as total_value
    FROM sellers s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN sales sa ON sa.seller_id = s.id 
      AND EXTRACT(MONTH FROM sa.sale_date) = ${currentMonth}
      AND EXTRACT(YEAR FROM sa.sale_date) = ${currentYear}
      AND sa.status IN ('approved', 'completed')
    WHERE s.is_active = true
    GROUP BY s.id, u.name
    ORDER BY total_sales DESC, total_value DESC
    LIMIT 5
  `

  const sellerPosition = ranking.findIndex((r: any) => r.id === sellerId) + 1

  return {
    seller,
    monthSales: {
      count: Number(monthSales.total_sales) || 0,
      value: Number(monthSales.total_value) || 0,
      commission: Number(monthSales.total_commission) || 0
    },
    lastMonthSales: {
      count: Number(lastMonthSales?.total_sales) || 0,
      value: Number(lastMonthSales?.total_value) || 0
    },
    pendingCommissions: Number(pendingCommissions.total) || 0,
    monthGoal,
    recentSales,
    upcomingAppointments,
    ranking,
    sellerPosition
  }
}

export default async function SellerDashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const stats = await getSellerStats(session.userId)

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Conta nao configurada</h2>
          <p className="text-slate-400 mb-6">
            Seu perfil de vendedor ainda nao foi configurado. Entre em contato com o administrador.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/">Voltar para o site</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { monthSales, lastMonthSales, pendingCommissions, monthGoal, recentSales, upcomingAppointments, ranking, sellerPosition, seller } = stats

  const salesVariation = lastMonthSales.count > 0 
    ? ((monthSales.count - lastMonthSales.count) / lastMonthSales.count * 100).toFixed(1)
    : 0

  const goalProgress = monthGoal?.goal_quantity > 0 
    ? (monthSales.count / monthGoal.goal_quantity * 100)
    : 0

  const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  const formatCompact = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">
            Ola, {session.name.split(" ")[0]}! Aqui esta o resumo do seu desempenho.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5">
            <Zap className="h-3 w-3 mr-1" />
            {sellerPosition > 0 ? `${sellerPosition}o no ranking` : "Novo vendedor"}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Vendas do Mes",
            value: monthSales.count.toString(),
            subtitle: `${Number(salesVariation) >= 0 ? "+" : ""}${salesVariation}% vs mes anterior`,
            icon: Car,
            color: "emerald",
            trend: Number(salesVariation) >= 0 ? "up" : "down"
          },
          {
            title: "Valor Vendido",
            value: formatCompact(monthSales.value),
            subtitle: "Este mes",
            icon: DollarSign,
            color: "blue",
            trend: "up"
          },
          {
            title: "Comissoes do Mes",
            value: formatCurrency(monthSales.commission),
            subtitle: `Taxa: ${seller.commission_rate}%`,
            icon: TrendingUp,
            color: "amber",
            trend: "up"
          },
          {
            title: "Comissoes Pendentes",
            value: formatCurrency(pendingCommissions),
            subtitle: "Aguardando pagamento",
            icon: Clock,
            color: "violet",
            trend: "neutral"
          }
        ].map((stat, idx) => (
          <Card key={idx} className={`bg-slate-900/50 border-slate-800 hover:border-${stat.color}-500/30 transition-all`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                {stat.trend !== "neutral" && (
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meta do Mes */}
      {monthGoal && (
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Meta do Mes</h3>
                  <p className="text-sm text-slate-400">{monthSales.count} de {monthGoal.goal_quantity} veiculos</p>
                </div>
              </div>
              <Badge className={goalProgress >= 100 ? "bg-emerald-500" : "bg-slate-700 text-slate-300"}>
                {goalProgress >= 100 ? "Meta Atingida!" : `${goalProgress.toFixed(0)}%`}
              </Badge>
            </div>
            <Progress value={Math.min(goalProgress, 100)} className="h-3 bg-slate-700" />
            {monthGoal.bonus_percentage > 0 && (
              <p className="text-xs text-emerald-400 mt-3">
                <Star className="inline h-3 w-3 mr-1" />
                Bonus de {monthGoal.bonus_percentage}% ao atingir a meta
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vendas Recentes */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Vendas Recentes</CardTitle>
            <Link href="/seller/sales">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Ver todas <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Nenhuma venda registrada ainda</p>
                </div>
              ) : (
                recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{sale.brand_name} {sale.vehicle_name}</p>
                        <p className="text-sm text-slate-500">{sale.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{formatCurrency(Number(sale.final_price))}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          sale.status === 'completed' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                          sale.status === 'approved' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' :
                          sale.status === 'cancelled' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                          'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        }
                      >
                        {sale.status === 'completed' ? 'Concluida' :
                         sale.status === 'approved' ? 'Aprovada' :
                         sale.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Ranking do Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.map((r: any, index: number) => (
                <div 
                  key={r.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    r.id === stats.seller.id 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.total_sales} vendas</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-400">{formatCompact(Number(r.total_value))}</p>
                </div>
              ))}
              {sellerPosition > 5 && (
                <div className="text-center pt-3 border-t border-slate-700">
                  <p className="text-sm text-slate-400">Sua posicao: <span className="font-bold text-emerald-400">{sellerPosition}o</span></p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proximos Agendamentos */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Proximos Agendamentos
          </CardTitle>
          <Link href="/seller/appointments">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Nenhum agendamento proximo</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((apt: any) => (
                <div key={apt.id} className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">{apt.customer_name}</p>
                      <p className="text-sm text-slate-500">{apt.customer_phone}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        apt.status === 'confirmed' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                        apt.status === 'completed' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' :
                        'border-amber-500/50 text-amber-400 bg-amber-500/10'
                      }
                    >
                      {apt.status === 'confirmed' ? 'Confirmado' :
                       apt.status === 'completed' ? 'Realizado' : 'Pendente'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(apt.preferred_date).toLocaleDateString('pt-BR')} as {apt.preferred_time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
