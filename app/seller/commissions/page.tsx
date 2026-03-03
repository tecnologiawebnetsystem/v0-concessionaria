"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Clock, CheckCircle, Wallet } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const monthNames = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR")

export default function SellerCommissionsPage() {
  const { data, isLoading } = useSWR("/api/seller/commissions", fetcher)

  const seller   = data?.seller   ?? {}
  const totals   = data?.totals   ?? {}
  const pending  = data?.pending  ?? []
  const paid     = data?.paid     ?? []
  const monthly  = data?.monthly  ?? []

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Comissoes</h1>
        <p className="text-slate-400">Acompanhe suas comissoes e pagamentos</p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Taxa de Comissao", value: `${seller.commission_rate ?? 0}%`, sub: "Sobre cada venda", icon: TrendingUp, from: "from-blue-600", to: "to-blue-700", shadow: "shadow-blue-500/20" },
          { label: "Total Ganho",      value: fmt(Number(totals.total_earned) || 0),  sub: "Desde o inicio",   icon: Wallet,    from: "from-emerald-500", to: "to-green-600", shadow: "shadow-emerald-500/20" },
          { label: "Ja Recebido",      value: fmt(Number(totals.total_paid) || 0),    sub: "Comissoes pagas",  icon: CheckCircle,from:"from-cyan-500",to:"to-blue-600",shadow:"shadow-cyan-500/20" },
          { label: "Pendente",         value: fmt(Number(totals.total_pending) || 0), sub: `${pending.length} vendas`, icon: Clock, from: "from-amber-500", to: "to-orange-600", shadow: "shadow-amber-500/20" },
        ].map((c, i) => (
          <Card key={i} className={`bg-gradient-to-br ${c.from} ${c.to} border-0 shadow-lg ${c.shadow}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">{c.label}</CardTitle>
              <div className="rounded-lg bg-white/20 p-2"><c.icon className="size-5 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{c.value}</div>
              <p className="text-sm text-white/70">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historico mensal */}
      {monthly.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Historico Mensal</CardTitle>
            <CardDescription className="text-slate-400">Comissoes dos ultimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {monthly.map((m: any) => (
                <div key={`${m.year}-${m.month}`} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-blue-500/50 transition-colors">
                  <p className="text-sm font-medium text-slate-400">{monthNames[m.month - 1]}/{m.year}</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{fmt(Number(m.total_commission))}</p>
                  <p className="text-xs text-slate-500">{m.sales_count} vendas</p>
                  {Number(m.paid_commission) > 0 && (
                    <Badge className="mt-2 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Pago: {fmt(Number(m.paid_commission))}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <Clock className="size-4 mr-2" /> Pendentes ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <CheckCircle className="size-4 mr-2" /> Pagas ({paid.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Comissoes Pendentes</CardTitle>
              <CardDescription className="text-slate-400">Aguardando pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle className="size-12 text-emerald-600 mx-auto mb-3" />
                  <p className="text-slate-400">Nenhuma comissao pendente. Tudo em dia!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">Data da Venda</TableHead>
                        <TableHead className="text-slate-400">Veiculo</TableHead>
                        <TableHead className="text-slate-400">Cliente</TableHead>
                        <TableHead className="text-slate-400">Valor da Venda</TableHead>
                        <TableHead className="text-slate-400">Taxa</TableHead>
                        <TableHead className="text-slate-400">Comissao</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.map((s: any) => (
                        <TableRow key={s.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell className="text-slate-300">{fmtDate(s.sale_date)}</TableCell>
                          <TableCell className="font-medium text-white">{s.brand_name} {s.vehicle_name}</TableCell>
                          <TableCell className="text-slate-300">{s.customer_name}</TableCell>
                          <TableCell className="text-slate-300">{fmt(Number(s.final_price))}</TableCell>
                          <TableCell className="text-slate-300">{s.commission_rate}%</TableCell>
                          <TableCell className="font-semibold text-amber-400">{fmt(Number(s.commission_value))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald-400">Comissoes Pagas</CardTitle>
              <CardDescription className="text-slate-400">Historico de pagamentos recebidos</CardDescription>
            </CardHeader>
            <CardContent>
              {paid.length === 0 ? (
                <div className="text-center py-10">
                  <DollarSign className="size-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Nenhuma comissao paga registrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400">Pago em</TableHead>
                        <TableHead className="text-slate-400">Venda em</TableHead>
                        <TableHead className="text-slate-400">Veiculo</TableHead>
                        <TableHead className="text-slate-400">Cliente</TableHead>
                        <TableHead className="text-slate-400">Comissao</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paid.map((s: any) => (
                        <TableRow key={s.id} className="border-slate-700 hover:bg-slate-800/50">
                          <TableCell className="text-slate-300">{s.commission_paid_at ? fmtDate(s.commission_paid_at) : "—"}</TableCell>
                          <TableCell className="text-slate-300">{fmtDate(s.sale_date)}</TableCell>
                          <TableCell className="font-medium text-white">{s.brand_name} {s.vehicle_name}</TableCell>
                          <TableCell className="text-slate-300">{s.customer_name}</TableCell>
                          <TableCell className="font-semibold text-emerald-400">{fmt(Number(s.commission_value))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
