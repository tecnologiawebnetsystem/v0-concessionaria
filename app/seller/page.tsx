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
  ArrowDownRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getSellerStats(userId: string) {
  // Buscar seller_id pelo user_id
  const [seller] = await sql`
    SELECT * FROM sellers WHERE user_id = ${userId}
  `
  
  if (!seller) {
    return null
  }

  const sellerId = seller.id
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Vendas do mês
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

  // Comissões pendentes
  const [pendingCommissions] = await sql`
    SELECT COALESCE(SUM(commission_value), 0) as total
    FROM sales 
    WHERE seller_id = ${sellerId}
    AND commission_paid = false
    AND status IN ('approved', 'completed')
  `

  // Meta do mês
  const [monthGoal] = await sql`
    SELECT * FROM sales_goals 
    WHERE seller_id = ${sellerId}
    AND month = ${currentMonth}
    AND year = ${currentYear}
  `

  // Vendas do mês anterior para comparação
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

  // Vendas recentes
  const recentSales = await sql`
    SELECT s.*, v.name as vehicle_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    WHERE s.seller_id = ${sellerId}
    ORDER BY s.sale_date DESC
    LIMIT 5
  `

  // Próximos agendamentos (test drives)
  const upcomingAppointments = await sql`
    SELECT * FROM test_drives
    WHERE preferred_date >= CURRENT_DATE
    ORDER BY preferred_date, preferred_time
    LIMIT 5
  `

  // Ranking do mês
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

  // Encontrar posição do vendedor no ranking
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

  // Se não encontrou vendedor, mostrar mensagem
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-amber-50 p-8 rounded-xl border border-amber-200 max-w-md">
          <Award className="size-16 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta não configurada</h2>
          <p className="text-gray-600 mb-4">
            Seu perfil de vendedor ainda não foi configurado. Entre em contato com o administrador.
          </p>
          <Button asChild>
            <Link href="/">Voltar para o site</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { monthSales, lastMonthSales, pendingCommissions, monthGoal, recentSales, upcomingAppointments, ranking, sellerPosition, seller } = stats

  // Calcular variação
  const salesVariation = lastMonthSales.count > 0 
    ? ((monthSales.count - lastMonthSales.count) / lastMonthSales.count * 100).toFixed(1)
    : 0

  // Calcular progresso da meta
  const goalProgress = monthGoal?.goal_quantity > 0 
    ? (monthSales.count / monthGoal.goal_quantity * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Olá, {session.name.split(" ")[0]}! Aqui está o resumo do seu desempenho.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vendas do Mês</CardTitle>
            <Car className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{monthSales.count}</div>
            <div className="flex items-center mt-1">
              {Number(salesVariation) >= 0 ? (
                <ArrowUpRight className="size-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="size-4 text-red-500" />
              )}
              <span className={`text-sm ${Number(salesVariation) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {salesVariation}% vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Vendido</CardTitle>
            <DollarSign className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(monthSales.value)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comissões do Mês</CardTitle>
            <TrendingUp className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(monthSales.commission)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Taxa: {seller.commission_rate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comissões Pendentes</CardTitle>
            <Clock className="size-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pendingCommissions)}
            </div>
            <p className="mt-1 text-xs text-gray-500">Aguardando pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta do Mês */}
      {monthGoal && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5 text-emerald-600" />
                Meta do Mês
              </CardTitle>
              <Badge variant={goalProgress >= 100 ? "default" : "secondary"} className={goalProgress >= 100 ? "bg-emerald-500" : ""}>
                {goalProgress >= 100 ? "Meta Atingida!" : `${goalProgress.toFixed(0)}%`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium">{monthSales.count} de {monthGoal.goal_quantity} veículos</span>
              </div>
              <Progress value={Math.min(goalProgress, 100)} className="h-3" />
              {monthGoal.bonus_percentage > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Bônus de {monthGoal.bonus_percentage}% ao atingir a meta
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Vendas Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vendas Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/sales">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Nenhuma venda registrada ainda</p>
              ) : (
                recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{sale.vehicle_name || 'Veículo'}</p>
                      <p className="text-sm text-gray-500">{sale.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(sale.final_price))}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={
                          sale.status === 'completed' ? 'border-emerald-500 text-emerald-600' :
                          sale.status === 'approved' ? 'border-blue-500 text-blue-600' :
                          sale.status === 'cancelled' ? 'border-red-500 text-red-600' :
                          'border-amber-500 text-amber-600'
                        }
                      >
                        {sale.status === 'completed' ? 'Concluída' :
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-amber-500" />
              Ranking do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.map((r: any, index: number) => (
                <div 
                  key={r.id} 
                  className={`flex items-center gap-3 p-2 rounded-lg ${r.id === stats.seller.id ? 'bg-emerald-50 border border-emerald-200' : ''}`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.total_sales} vendas</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(Number(r.total_value))}
                  </p>
                </div>
              ))}
              {sellerPosition > 5 && (
                <div className="text-center pt-2 border-t">
                  <p className="text-sm text-gray-500">Sua posição: <span className="font-bold">{sellerPosition}º</span></p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-blue-600" />
            Próximos Agendamentos
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seller/appointments">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-full text-center py-8">Nenhum agendamento próximo</p>
            ) : (
              upcomingAppointments.map((apt: any) => (
                <div key={apt.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{apt.customer_name}</p>
                      <p className="text-sm text-gray-500">{apt.customer_phone}</p>
                    </div>
                    <Badge variant="outline" className={
                      apt.status === 'confirmed' ? 'border-emerald-500 text-emerald-600' :
                      apt.status === 'completed' ? 'border-blue-500 text-blue-600' :
                      'border-amber-500 text-amber-600'
                    }>
                      {apt.status === 'confirmed' ? 'Confirmado' :
                       apt.status === 'completed' ? 'Realizado' : 'Pendente'}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="size-4" />
                    {new Date(apt.preferred_date).toLocaleDateString('pt-BR')} às {apt.preferred_time}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
