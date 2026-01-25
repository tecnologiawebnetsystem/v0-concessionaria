"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  TrendingUp,
  Award,
  Calendar,
  Trophy,
  Star,
  Zap
} from "lucide-react"

export default function SellerGoalsPage() {
  // Dados mockados
  const currentGoal = {
    goal_quantity: 8,
    goal_value: 800000,
    bonus_percentage: 5
  }
  
  const currentSales = {
    count: 5,
    value: 485000
  }

  const stats = {
    achieved: 8,
    total: 12
  }

  const goalsHistory = [
    { year: 2023, month: 12, goal_quantity: 6, actual_sales: 7, actual_value: 580000 },
    { year: 2023, month: 11, goal_quantity: 6, actual_sales: 6, actual_value: 520000 },
    { year: 2023, month: 10, goal_quantity: 5, actual_sales: 4, actual_value: 380000 },
    { year: 2023, month: 9, goal_quantity: 5, actual_sales: 6, actual_value: 490000 },
  ]

  const monthNames = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const quantityProgress = currentGoal.goal_quantity > 0 
    ? (currentSales.count / currentGoal.goal_quantity * 100) 
    : 0

  const valueProgress = currentGoal.goal_value > 0 
    ? (currentSales.value / currentGoal.goal_value * 100) 
    : 0

  const currentMonth = monthNames[new Date().getMonth()]
  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Metas</h1>
        <p className="text-slate-400">Acompanhe seu progresso e conquistas</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Metas Batidas</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Trophy className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.achieved}</div>
            <p className="text-sm text-amber-200">de {stats.total} metas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Taxa de Sucesso</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Star className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.total > 0 ? ((stats.achieved / stats.total) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-sm text-emerald-200">Metas atingidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Vendas Hoje</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Calendar className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{currentSales.count}</div>
            <p className="text-sm text-blue-200">{currentMonth}/{currentYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta do Mes Atual */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-800/50 border-2 border-emerald-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="size-6 text-emerald-400" />
                Meta de {currentMonth} {currentYear}
              </CardTitle>
              <CardDescription className="text-slate-400">Seu progresso no mes atual</CardDescription>
            </div>
            {quantityProgress >= 100 && (
              <Badge className="bg-emerald-500 text-white text-lg px-4 py-2">
                <Trophy className="size-4 mr-2" />
                Meta Atingida!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta de Quantidade */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Meta de Vendas</span>
              <span className="text-sm font-bold text-white">
                {currentSales.count} / {currentGoal.goal_quantity} veiculos
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(quantityProgress, 100)} className="h-4 bg-slate-700" />
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                style={{ width: `${Math.min(quantityProgress, 100)}%`, height: '100%', borderRadius: '9999px' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {quantityProgress >= 100 
                ? `Parabens! Voce ultrapassou a meta em ${(quantityProgress - 100).toFixed(0)}%!`
                : `Faltam ${currentGoal.goal_quantity - currentSales.count} vendas para bater a meta`
              }
            </p>
          </div>

          {/* Meta de Valor */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Meta de Faturamento</span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(currentSales.value)} / {formatCurrency(currentGoal.goal_value)}
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(valueProgress, 100)} className="h-4 bg-slate-700" />
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                style={{ width: `${Math.min(valueProgress, 100)}%`, height: '100%', borderRadius: '9999px' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {valueProgress >= 100 
                ? `Parabens! Voce ultrapassou a meta em ${(valueProgress - 100).toFixed(0)}%!`
                : `Faltam ${formatCurrency(currentGoal.goal_value - currentSales.value)} para bater a meta`
              }
            </p>
          </div>

          {/* Bonus */}
          {currentGoal.bonus_percentage > 0 && (
            <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-amber-400" />
                <span className="font-medium text-amber-400">Bonus Disponivel</span>
              </div>
              <p className="text-sm text-amber-200/80 mt-1">
                Ao atingir a meta, voce recebera um bonus de <strong className="text-amber-300">{currentGoal.bonus_percentage}%</strong> sobre suas comissoes do mes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historico de Metas */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Historico de Metas</CardTitle>
          <CardDescription className="text-slate-400">Desempenho nos meses anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {goalsHistory.map((goal) => {
              const achieved = goal.actual_sales >= goal.goal_quantity
              const progress = goal.goal_quantity > 0 
                ? (goal.actual_sales / goal.goal_quantity * 100) 
                : 0

              return (
                <div 
                  key={`${goal.year}-${goal.month}`} 
                  className={`p-4 rounded-lg border transition-all ${
                    achieved 
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' 
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-300">
                      {monthNames[goal.month - 1]}/{goal.year}
                    </span>
                    {achieved ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Trophy className="size-3 mr-1" />
                        Atingida
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-700 text-slate-400">Nao atingida</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Vendas</span>
                      <span className="font-medium text-white">{goal.actual_sales} / {goal.goal_quantity}</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2 bg-slate-700" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Faturamento</span>
                      <span className="font-medium text-emerald-400">{formatCurrency(goal.actual_value)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
