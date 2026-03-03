"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, Car, TrendingUp, Clock, Eye, ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const paymentLabels: Record<string, string> = {
  cash: "A Vista",
  financing: "Financiamento",
  consortium: "Consorcio",
  trade_in: "Troca",
  mixed: "Misto",
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    approved:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
    pending:   "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  }
  const labels: Record<string, string> = { completed: "Concluida", approved: "Aprovada", pending: "Pendente", cancelled: "Cancelada" }
  return <Badge className={`border ${map[status] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>{labels[status] ?? status}</Badge>
}

export default function SellerSalesPage() {
  const { data, isLoading } = useSWR("/api/seller/sales", fetcher)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR")

  const allSales = data?.sales ?? []
  const filtered = allSales.filter((s: any) => {
    const matchSearch =
      s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicle_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.brand_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const allTime = data?.allTimeStats
  const month = data?.monthStats
  const lastMonth = data?.lastMonthStats
  const salesVariation = Number(lastMonth?.total_sales) > 0
    ? ((Number(month?.total_sales) - Number(lastMonth.total_sales)) / Number(lastMonth.total_sales) * 100).toFixed(1)
    : "0"

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-slate-800 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Minhas Vendas</h1>
        <p className="text-slate-400">Historico completo de todas as suas vendas</p>
      </div>

      {/* Cards Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total de Vendas</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><Car className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{Number(allTime?.total_sales) || 0}</div>
            <p className="text-sm text-blue-200">{Number(allTime?.completed_sales) || 0} concluidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Valor Total</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><DollarSign className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{formatCurrency(Number(allTime?.total_value) || 0)}</div>
            <p className="text-sm text-emerald-200">em vendas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Comissoes Totais</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><TrendingUp className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{formatCurrency(Number(allTime?.total_commission) || 0)}</div>
            <p className="text-sm text-amber-200">ganhos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-0 shadow-lg shadow-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Mes Atual</CardTitle>
            <div className="rounded-lg bg-white/20 p-2"><Clock className="size-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{Number(month?.total_sales) || 0}</span>
              <span className={`flex items-center text-sm font-medium ${Number(salesVariation) >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                {Number(salesVariation) >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                {salesVariation}%
              </span>
            </div>
            <p className="text-sm text-purple-200">vendas este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                placeholder="Buscar por cliente, veiculo ou marca..."
                className="pl-9 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovada</SelectItem>
                <SelectItem value="completed">Concluida</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">
            Historico de Vendas
            <span className="ml-2 text-sm font-normal text-slate-500">({filtered.length} registros)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Car className="size-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhuma venda encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead className="text-slate-400">Veiculo</TableHead>
                    <TableHead className="text-slate-400">Cliente</TableHead>
                    <TableHead className="text-slate-400">Valor Final</TableHead>
                    <TableHead className="text-slate-400">Comissao</TableHead>
                    <TableHead className="text-slate-400">Pagamento</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sale: any) => (
                    <TableRow key={sale.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300 whitespace-nowrap">{formatDate(sale.sale_date)}</TableCell>
                      <TableCell>
                        <p className="font-medium text-white">{sale.brand_name} {sale.vehicle_name}</p>
                        <p className="text-xs text-slate-500">{sale.vehicle_year}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-white">{sale.customer_name}</p>
                        <p className="text-xs text-slate-500">{sale.customer_phone}</p>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-400">{formatCurrency(Number(sale.final_price))}</TableCell>
                      <TableCell>
                        <p className="font-medium text-amber-400">{formatCurrency(Number(sale.commission_value))}</p>
                        <p className="text-xs text-slate-500">{sale.commission_rate}%</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {paymentLabels[sale.payment_method] ?? sale.payment_method}
                        </Badge>
                        {sale.has_trade_in && <Badge className="ml-1 text-xs bg-slate-700 text-slate-300">+Troca</Badge>}
                      </TableCell>
                      <TableCell><StatusBadge status={sale.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
