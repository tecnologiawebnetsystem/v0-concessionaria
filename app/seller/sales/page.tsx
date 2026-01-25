"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Calendar, 
  Car,
  Eye,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function SellerSalesPage() {
  // Dados mockados para demonstracao
  const sales = [
    {
      id: 1,
      sale_date: "2024-01-15",
      vehicle_name: "Honda Civic EXL",
      vehicle_year: "2023",
      customer_name: "Joao Silva",
      customer_phone: "(11) 99999-9999",
      final_price: 145000,
      commission_value: 4350,
      commission_rate: 3,
      payment_method: "financing",
      has_trade_in: true,
      status: "completed"
    },
    {
      id: 2,
      sale_date: "2024-01-10",
      vehicle_name: "Toyota Corolla XEi",
      vehicle_year: "2024",
      customer_name: "Maria Santos",
      customer_phone: "(11) 98888-8888",
      final_price: 165000,
      commission_value: 4950,
      commission_rate: 3,
      payment_method: "cash",
      has_trade_in: false,
      status: "approved"
    },
    {
      id: 3,
      sale_date: "2024-01-05",
      vehicle_name: "Volkswagen T-Cross",
      vehicle_year: "2023",
      customer_name: "Pedro Oliveira",
      customer_phone: "(11) 97777-7777",
      final_price: 125000,
      commission_value: 3750,
      commission_rate: 3,
      payment_method: "financing",
      has_trade_in: false,
      status: "pending"
    }
  ]

  const summary = {
    total_sales: 15,
    total_value: 1850000,
    total_commission: 55500,
    completed_sales: 12,
    pending_sales: 3
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Minhas Vendas</h1>
          <p className="text-slate-400">Historico completo de todas as suas vendas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Filter className="size-4 mr-2" />
          Filtrar
        </Button>
      </div>

      {/* Cards Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total de Vendas</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Car className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{summary.total_sales}</div>
            <p className="text-sm text-blue-200">{summary.completed_sales} concluidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Valor Total</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <DollarSign className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(summary.total_value)}
            </div>
            <p className="text-sm text-emerald-200">em vendas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Comissoes Totais</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <TrendingUp className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(summary.total_commission)}
            </div>
            <p className="text-sm text-amber-200">ganhos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 border-0 shadow-lg shadow-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Pendentes</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Clock className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{summary.pending_sales}</div>
            <p className="text-sm text-purple-200">aguardando</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Vendas */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Historico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-12">
              <Car className="size-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhuma venda registrada ainda</p>
              <p className="text-sm text-slate-500">Suas vendas aparecerao aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead className="text-slate-400">Veiculo</TableHead>
                    <TableHead className="text-slate-400">Cliente</TableHead>
                    <TableHead className="text-slate-400">Valor Final</TableHead>
                    <TableHead className="text-slate-400">Comissao</TableHead>
                    <TableHead className="text-slate-400">Pagamento</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="whitespace-nowrap text-slate-300">
                        {formatDate(sale.sale_date)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{sale.vehicle_name}</p>
                          <p className="text-xs text-slate-500">{sale.vehicle_year}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{sale.customer_name}</p>
                          <p className="text-xs text-slate-500">{sale.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-400">
                        {formatCurrency(sale.final_price)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-amber-400">
                            {formatCurrency(sale.commission_value)}
                          </p>
                          <p className="text-xs text-slate-500">{sale.commission_rate}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {sale.payment_method === 'cash' ? 'A Vista' :
                           sale.payment_method === 'financing' ? 'Financiamento' :
                           sale.payment_method === 'consortium' ? 'Consorcio' :
                           sale.payment_method === 'trade_in' ? 'Troca' : 
                           sale.payment_method === 'mixed' ? 'Misto' : sale.payment_method}
                        </Badge>
                        {sale.has_trade_in && (
                          <Badge className="ml-1 text-xs bg-slate-700 text-slate-300">+Troca</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          sale.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          sale.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          sale.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }>
                          {sale.status === 'completed' ? 'Concluida' :
                           sale.status === 'approved' ? 'Aprovada' :
                           sale.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
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
