"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  Wallet,
  Calendar
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SellerCommissionsPage() {
  // Dados mockados
  const seller = { commission_rate: 3 }
  const totals = { total_earned: 55500, total_paid: 42000, total_pending: 13500 }
  
  const pendingCommissions = [
    { id: 1, sale_date: "2024-01-15", vehicle_name: "Honda Civic EXL", customer_name: "Joao Silva", final_price: 145000, commission_rate: 3, commission_value: 4350 },
    { id: 2, sale_date: "2024-01-10", vehicle_name: "Toyota Corolla XEi", customer_name: "Maria Santos", final_price: 165000, commission_rate: 3, commission_value: 4950 },
    { id: 3, sale_date: "2024-01-05", vehicle_name: "VW T-Cross", customer_name: "Pedro Oliveira", final_price: 125000, commission_rate: 3, commission_value: 3750 },
  ]
  
  const paidCommissions = [
    { id: 4, sale_date: "2023-12-20", commission_paid_at: "2024-01-05", vehicle_name: "Fiat Pulse", customer_name: "Ana Costa", commission_value: 3200 },
    { id: 5, sale_date: "2023-12-15", commission_paid_at: "2024-01-05", vehicle_name: "Jeep Renegade", customer_name: "Carlos Lima", commission_value: 4800 },
  ]

  const monthlyCommissions = [
    { year: 2024, month: 1, sales_count: 5, total_commission: 21000, paid_commission: 8000, pending_commission: 13000 },
    { year: 2023, month: 12, sales_count: 4, total_commission: 16500, paid_commission: 16500, pending_commission: 0 },
    { year: 2023, month: 11, sales_count: 3, total_commission: 12000, paid_commission: 12000, pending_commission: 0 },
  ]

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Comissoes</h1>
        <p className="text-slate-400">Acompanhe suas comissoes e pagamentos</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Taxa de Comissao</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <TrendingUp className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{seller.commission_rate}%</div>
            <p className="text-sm text-blue-200">Sobre cada venda</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Total Ganho</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Wallet className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totals.total_earned)}
            </div>
            <p className="text-sm text-emerald-200">Desde o inicio</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 shadow-lg shadow-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-cyan-100">Recebido</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <CheckCircle className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totals.total_paid)}
            </div>
            <p className="text-sm text-cyan-200">Ja pago</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Pendente</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Clock className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totals.total_pending)}
            </div>
            <p className="text-sm text-amber-200">{pendingCommissions.length} vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Mes */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Historico Mensal</CardTitle>
          <CardDescription className="text-slate-400">Comissoes dos ultimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {monthlyCommissions.map((month) => (
              <div key={`${month.year}-${month.month}`} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center hover:border-blue-500/50 transition-colors">
                <p className="text-sm font-medium text-slate-400">
                  {monthNames[month.month - 1]}/{month.year}
                </p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {formatCurrency(month.total_commission)}
                </p>
                <p className="text-xs text-slate-500">{month.sales_count} vendas</p>
                {month.paid_commission > 0 && (
                  <Badge className="mt-2 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Pago: {formatCurrency(month.paid_commission)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Comissoes */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <Clock className="size-4 mr-2" />
            Pendentes ({pendingCommissions.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <CheckCircle className="size-4 mr-2" />
            Pagas ({paidCommissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Comissoes Pendentes</CardTitle>
              <CardDescription className="text-slate-400">Aguardando pagamento</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {pendingCommissions.map((sale) => (
                    <TableRow key={sale.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{formatDate(sale.sale_date)}</TableCell>
                      <TableCell className="font-medium text-white">{sale.vehicle_name}</TableCell>
                      <TableCell className="text-slate-300">{sale.customer_name}</TableCell>
                      <TableCell className="text-slate-300">{formatCurrency(sale.final_price)}</TableCell>
                      <TableCell className="text-slate-300">{sale.commission_rate}%</TableCell>
                      <TableCell className="font-semibold text-amber-400">
                        {formatCurrency(sale.commission_value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-emerald-400">Comissoes Pagas</CardTitle>
              <CardDescription className="text-slate-400">Historico de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {paidCommissions.map((sale) => (
                    <TableRow key={sale.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">
                        {sale.commission_paid_at ? formatDate(sale.commission_paid_at) : '-'}
                      </TableCell>
                      <TableCell className="text-slate-300">{formatDate(sale.sale_date)}</TableCell>
                      <TableCell className="font-medium text-white">{sale.vehicle_name}</TableCell>
                      <TableCell className="text-slate-300">{sale.customer_name}</TableCell>
                      <TableCell className="font-semibold text-emerald-400">
                        {formatCurrency(sale.commission_value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
