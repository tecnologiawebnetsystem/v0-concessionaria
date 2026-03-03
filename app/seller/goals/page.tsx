"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Award, Calendar, Trophy, Star, Zap } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
const monthNames = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]

export default function SellerGoalsPage() {
  const { data, isLoading } = useSWR("/api/seller/goals", fetcher)

  const currentGoal  = data?.currentGoal  ?? null
  const currentSales = data?.currentSales ?? { count: "0", value: "0" }
  const history      = data?.history      ?? []
  const stats        = data?.stats        ?? { total: 0, achieved: 0 }

  const salesCount = Number(currentSales.count) || 0
  const salesValue = Number(currentSales.value) || 0
  const goalQty    = currentGoal?.goal_quantity ?? 0
  const goalValue  = Number(currentGoal?.goal_value) || 0

  const qtyProgress   = goalQty   > 0 ? Math.min((salesCount / goalQty) * 100, 100)   : 0
  const valueProgress = goalValue > 0 ? Math.min((salesValue / goalValue) * 100, 100) : 0

  const now = new Date()
  const currentMonthName = monthNames[now.getMonth()]
  const currentYear = now.getFullYear()

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-10 w-40 bg-slate-800 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Metas</h1>
        <p className="text-slate-400">Acompanhe seu progresso e conquistas</p>
      </div>

      {/* Cards resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Metas Batidas</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><Trophy className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{Number(stats.achieved)}</div>
            <p className="text-sm text-amber-200">de {Number(stats.total)} metas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Taxa de Sucesso</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><Star className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Number(stats.total) > 0 ? ((Number(stats.achieved) / Number(stats.total)) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-sm text-emerald-200">Metas atingidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Vendas no Mes</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><Calendar className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{salesCount}</div>
            <p className="text-sm text-blue-200">{currentMonthName}/{currentYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta do mes atual */}
      {currentGoal ? (
        <Card className="bg-gradient-to-r from-slate-800 to-slate-800/50 border-2 border-emerald-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="size-6 text-emerald-400" />
                  Meta de {currentMonthName} {currentYear}
                </CardTitle>
                <CardDescription className="text-slate-400">Seu progresso no mes atual</CardDescription>
              </div>
              {qtyProgress >= 100 && (
                <Badge className="bg-emerald-500 text-white text-base px-4 py-2">
                  <Trophy className="size-4 mr-2" /> Meta Atingida!
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantidade */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Meta de Vendas</span>
                <span className="text-sm font-bold text-white">{salesCount} / {goalQty} veiculos</span>
              </div>
              <Progress value={qtyProgress} className="h-4 bg-slate-700" />
              <p className="text-xs text-slate-500 mt-2">
                {qtyProgress >= 100
                  ? `Parabens! Voce atingiu a meta com ${salesCount - goalQty} vendas a mais!`
                  : `Faltam ${goalQty - salesCount} vendas para bater a meta`}
              </p>
            </div>

            {/* Valor */}
            {goalValue > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Meta de Faturamento</span>
                  <span className="text-sm font-bold text-white">{fmt(salesValue)} / {fmt(goalValue)}</span>
                </div>
                <Progress value={valueProgress} className="h-4 bg-slate-700" />
                <p className="text-xs text-slate-500 mt-2">
                  {valueProgress >= 100
                    ? `Parabens! Meta de faturamento atingida!`
                    : `Faltam ${fmt(goalValue - salesValue)} para bater a meta de faturamento`}
                </p>
              </div>
            )}

            {/* Bonus */}
            {Number(currentGoal.bonus_percentage) > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-amber-400" />
                  <span className="font-medium text-amber-400">Bonus Disponivel</span>
                </div>
                <p className="text-sm text-amber-200/80 mt-1">
                  Ao atingir a meta, voce recebera um bonus de{" "}
                  <strong className="text-amber-300">{currentGoal.bonus_percentage}%</strong> sobre suas comissoes do mes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-10 text-center">
            <Target className="size-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Nenhuma meta definida para {currentMonthName}/{currentYear}.</p>
            <p className="text-sm text-slate-500 mt-1">O administrador pode configurar sua meta mensal.</p>
          </CardContent>
        </Card>
      )}

      {/* Historico */}
      {history.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Historico de Metas</CardTitle>
            <CardDescription className="text-slate-400">Desempenho nos meses anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {history.map((g: any) => {
                const achieved = Number(g.actual_sales) >= Number(g.goal_quantity)
                const pct = g.goal_quantity > 0 ? Math.min((Number(g.actual_sales) / Number(g.goal_quantity)) * 100, 100) : 0
                return (
                  <div key={`${g.year}-${g.month}`} className={`p-4 rounded-lg border transition-all ${achieved ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/50 border-slate-700"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-300">{monthNames[g.month - 1]}/{g.year}</span>
                      {achieved
                        ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><Trophy className="size-3 mr-1" />Atingida</Badge>
                        : <Badge className="bg-slate-700 text-slate-400">Nao atingida</Badge>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Vendas</span>
                        <span className="font-medium text-white">{g.actual_sales} / {g.goal_quantity}</span>
                      </div>
                      <Progress value={pct} className="h-2 bg-slate-700" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Faturamento</span>
                        <span className="font-medium text-emerald-400">{fmt(Number(g.actual_value))}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
