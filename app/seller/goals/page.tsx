import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  TrendingUp,
  Award,
  Calendar,
  Trophy,
  Star
} from "lucide-react"

async function getSellerGoals(userId: string) {
  const [seller] = await sql`SELECT * FROM sellers WHERE user_id = ${userId}`
  
  if (!seller) return null

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Meta atual
  const [currentGoal] = await sql`
    SELECT * FROM sales_goals 
    WHERE seller_id = ${seller.id}
    AND month = ${currentMonth}
    AND year = ${currentYear}
  `

  // Vendas do mês atual
  const [currentSales] = await sql`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(final_price), 0) as value
    FROM sales
    WHERE seller_id = ${seller.id}
    AND EXTRACT(MONTH FROM sale_date) = ${currentMonth}
    AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
    AND status IN ('approved', 'completed')
  `

  // Histórico de metas (últimos 12 meses)
  const goalsHistory = await sql`
    SELECT sg.*, 
      (SELECT COUNT(*) FROM sales WHERE seller_id = sg.seller_id 
       AND EXTRACT(MONTH FROM sale_date) = sg.month 
       AND EXTRACT(YEAR FROM sale_date) = sg.year
       AND status IN ('approved', 'completed')) as actual_sales,
      (SELECT COALESCE(SUM(final_price), 0) FROM sales WHERE seller_id = sg.seller_id 
       AND EXTRACT(MONTH FROM sale_date) = sg.month 
       AND EXTRACT(YEAR FROM sale_date) = sg.year
       AND status IN ('approved', 'completed')) as actual_value
    FROM sales_goals sg
    WHERE sg.seller_id = ${seller.id}
    ORDER BY sg.year DESC, sg.month DESC
    LIMIT 12
  `

  // Estatísticas gerais
  const [stats] = await sql`
    SELECT 
      COUNT(CASE WHEN achieved_quantity >= goal_quantity THEN 1 END) as goals_achieved,
      COUNT(*) as total_goals
    FROM sales_goals
    WHERE seller_id = ${seller.id}
    AND goal_quantity > 0
  `

  return {
    seller,
    currentGoal,
    currentSales: {
      count: Number(currentSales?.count) || 0,
      value: Number(currentSales?.value) || 0
    },
    goalsHistory,
    stats: {
      achieved: Number(stats?.goals_achieved) || 0,
      total: Number(stats?.total_goals) || 0
    }
  }
}

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default async function SellerGoalsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const data = await getSellerGoals(session.userId)

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Perfil de vendedor não encontrado</p>
      </div>
    )
  }

  const { currentGoal, currentSales, goalsHistory, stats } = data

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const quantityProgress = currentGoal?.goal_quantity > 0 
    ? (currentSales.count / currentGoal.goal_quantity * 100) 
    : 0

  const valueProgress = currentGoal?.goal_value > 0 
    ? (currentSales.value / Number(currentGoal.goal_value) * 100) 
    : 0

  const currentMonth = monthNames[new Date().getMonth()]
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
        <p className="text-gray-600">Acompanhe seu progresso e conquistas</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Metas Batidas</CardTitle>
            <Trophy className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.achieved}</div>
            <p className="text-xs text-gray-500">de {stats.total} metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Sucesso</CardTitle>
            <Star className="size-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {stats.total > 0 ? ((stats.achieved / stats.total) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-gray-500">Metas atingidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vendas Hoje</CardTitle>
            <Calendar className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentSales.count}</div>
            <p className="text-xs text-gray-500">{currentMonth}/{currentYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta do Mês Atual */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-6 text-emerald-600" />
                Meta de {currentMonth} {currentYear}
              </CardTitle>
              <CardDescription>Seu progresso no mês atual</CardDescription>
            </div>
            {quantityProgress >= 100 && (
              <Badge className="bg-emerald-500 text-lg px-4 py-1">
                <Trophy className="size-4 mr-2" />
                Meta Atingida!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentGoal ? (
            <>
              {/* Meta de Quantidade */}
              {currentGoal.goal_quantity > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Meta de Vendas</span>
                    <span className="text-sm font-bold">
                      {currentSales.count} / {currentGoal.goal_quantity} veículos
                    </span>
                  </div>
                  <Progress value={Math.min(quantityProgress, 100)} className="h-4" />
                  <p className="text-xs text-gray-500 mt-1">
                    {quantityProgress >= 100 
                      ? `Parabéns! Você ultrapassou a meta em ${(quantityProgress - 100).toFixed(0)}%!`
                      : `Faltam ${currentGoal.goal_quantity - currentSales.count} vendas para bater a meta`
                    }
                  </p>
                </div>
              )}

              {/* Meta de Valor */}
              {Number(currentGoal.goal_value) > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Meta de Faturamento</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(currentSales.value)} / {formatCurrency(Number(currentGoal.goal_value))}
                    </span>
                  </div>
                  <Progress value={Math.min(valueProgress, 100)} className="h-4" />
                  <p className="text-xs text-gray-500 mt-1">
                    {valueProgress >= 100 
                      ? `Parabéns! Você ultrapassou a meta em ${(valueProgress - 100).toFixed(0)}%!`
                      : `Faltam ${formatCurrency(Number(currentGoal.goal_value) - currentSales.value)} para bater a meta`
                    }
                  </p>
                </div>
              )}

              {/* Bônus */}
              {Number(currentGoal.bonus_percentage) > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Bônus Disponível</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Ao atingir a meta, você receberá um bônus de <strong>{currentGoal.bonus_percentage}%</strong> sobre suas comissões do mês.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Target className="size-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhuma meta definida para este mês</p>
              <p className="text-sm text-gray-400">Entre em contato com o administrador</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Metas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Metas</CardTitle>
          <CardDescription>Desempenho nos meses anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          {goalsHistory.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="size-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum histórico de metas</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goalsHistory.map((goal: any) => {
                const achieved = Number(goal.actual_sales) >= goal.goal_quantity
                const progress = goal.goal_quantity > 0 
                  ? (Number(goal.actual_sales) / goal.goal_quantity * 100) 
                  : 0

                return (
                  <div 
                    key={`${goal.year}-${goal.month}`} 
                    className={`p-4 border rounded-lg ${achieved ? 'bg-emerald-50 border-emerald-200' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">
                        {monthNames[goal.month - 1]}/{goal.year}
                      </span>
                      {achieved ? (
                        <Badge className="bg-emerald-500">
                          <Trophy className="size-3 mr-1" />
                          Atingida
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Não atingida</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vendas</span>
                        <span className="font-medium">{goal.actual_sales} / {goal.goal_quantity}</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Faturamento</span>
                        <span className="font-medium">{formatCurrency(Number(goal.actual_value))}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
