import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sql } from "@/lib/db"
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
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Calendar,
  BarChart3
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

async function getFinanceData() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Resumo do fluxo de caixa
  const [monthSummary] = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
    FROM cash_flow
    WHERE EXTRACT(MONTH FROM date) = ${currentMonth}
    AND EXTRACT(YEAR FROM date) = ${currentYear}
  `

  // Vendas do mês
  const [salesSummary] = await sql`
    SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(final_price), 0) as total_value,
      COALESCE(SUM(commission_value), 0) as total_commissions
    FROM sales
    WHERE EXTRACT(MONTH FROM sale_date) = ${currentMonth}
    AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
    AND status IN ('approved', 'completed')
  `

  // Comissões pendentes
  const [pendingCommissions] = await sql`
    SELECT COALESCE(SUM(commission_value), 0) as total
    FROM sales
    WHERE commission_paid = false
    AND status IN ('approved', 'completed')
  `

  // Últimas transações
  const recentTransactions = await sql`
    SELECT * FROM cash_flow
    ORDER BY date DESC, created_at DESC
    LIMIT 20
  `

  // Últimas vendas
  const recentSales = await sql`
    SELECT s.*, v.name as vehicle_name, u.name as seller_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    LEFT JOIN sellers sl ON s.seller_id = sl.id
    LEFT JOIN users u ON sl.user_id = u.id
    ORDER BY s.sale_date DESC
    LIMIT 10
  `

  // Resumo por categoria de despesa
  const expensesByCategory = await sql`
    SELECT category, SUM(amount) as total
    FROM cash_flow
    WHERE type = 'expense'
    AND EXTRACT(MONTH FROM date) = ${currentMonth}
    AND EXTRACT(YEAR FROM date) = ${currentYear}
    GROUP BY category
    ORDER BY total DESC
    LIMIT 10
  `

  // Faturamento dos últimos 6 meses
  const monthlyRevenue = await sql`
    SELECT 
      EXTRACT(YEAR FROM sale_date) as year,
      EXTRACT(MONTH FROM sale_date) as month,
      COUNT(*) as sales_count,
      COALESCE(SUM(final_price), 0) as revenue
    FROM sales
    WHERE sale_date >= CURRENT_DATE - INTERVAL '6 months'
    AND status IN ('approved', 'completed')
    GROUP BY EXTRACT(YEAR FROM sale_date), EXTRACT(MONTH FROM sale_date)
    ORDER BY year DESC, month DESC
  `

  return {
    monthSummary: {
      income: Number(monthSummary?.income) || 0,
      expense: Number(monthSummary?.expense) || 0
    },
    salesSummary: {
      total: Number(salesSummary?.total_sales) || 0,
      value: Number(salesSummary?.total_value) || 0,
      commissions: Number(salesSummary?.total_commissions) || 0
    },
    pendingCommissions: Number(pendingCommissions?.total) || 0,
    recentTransactions,
    recentSales,
    expensesByCategory,
    monthlyRevenue
  }
}

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default async function AdminFinancePage() {
  const data = await getFinanceData()

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  const balance = data.monthSummary.income - data.monthSummary.expense

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle de fluxo de caixa e vendas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/admin/finance/new">
              <Plus className="size-4 mr-2" />
              Nova Transação
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas do Mês</CardTitle>
            <TrendingUp className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(data.monthSummary.income)}
            </div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="size-4" />
              Entradas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas do Mês</CardTitle>
            <TrendingDown className="size-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.monthSummary.expense)}
            </div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <ArrowDownRight className="size-4" />
              Saídas
            </div>
          </CardContent>
        </Card>

        <Card className={balance >= 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo do Mês</CardTitle>
            <Wallet className={`size-5 ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vendas do Mês</CardTitle>
            <DollarSign className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.salesSummary.value)}
            </div>
            <p className="text-xs text-gray-500 mt-1">{data.salesSummary.total} veículos vendidos</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Comissões Pendentes</CardTitle>
            <CreditCard className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {formatCurrency(data.pendingCommissions)}
            </div>
            <p className="text-xs text-amber-600 mt-1">A pagar para vendedores</p>
          </CardContent>
        </Card>
      </div>

      {/* Faturamento Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Faturamento Mensal
          </CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {data.monthlyRevenue.map((month: any) => (
              <div key={`${month.year}-${month.month}`} className="p-4 border rounded-lg text-center">
                <p className="text-sm font-medium text-gray-600">
                  {monthNames[month.month - 1]}/{month.year}
                </p>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(Number(month.revenue))}
                </p>
                <p className="text-xs text-gray-500">{month.sales_count} vendas</p>
              </div>
            ))}
            {data.monthlyRevenue.length === 0 && (
              <div className="col-span-6 text-center py-8 text-gray-500">
                Nenhuma venda nos últimos 6 meses
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Despesas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            {data.expensesByCategory.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Nenhuma despesa este mês</p>
            ) : (
              <div className="space-y-3">
                {data.expensesByCategory.map((expense: any, index: number) => {
                  const maxValue = Number(data.expensesByCategory[0]?.total) || 1
                  const percentage = (Number(expense.total) / maxValue) * 100
                  
                  return (
                    <div key={expense.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{expense.category}</span>
                        <span className="font-medium">{formatCurrency(Number(expense.total))}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vendas Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vendas Recentes</CardTitle>
              <CardDescription>Últimas vendas realizadas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/sales">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Nenhuma venda registrada</p>
            ) : (
              <div className="space-y-3">
                {data.recentSales.slice(0, 5).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{sale.vehicle_name || 'Veículo'}</p>
                      <p className="text-sm text-gray-500">
                        {sale.customer_name} - {sale.seller_name || 'Sem vendedor'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        {formatCurrency(Number(sale.final_price))}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Todas as entradas e saídas</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="size-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="size-4 mr-2" />
              Período
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="size-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhuma transação registrada</p>
              <Button asChild className="mt-4">
                <Link href="/admin/finance/new">
                  <Plus className="size-4 mr-2" />
                  Adicionar Transação
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentTransactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <Badge className={transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}>
                        {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                    <TableCell className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={transaction.is_paid ? 'border-emerald-500 text-emerald-600' : 'border-amber-500 text-amber-600'}>
                        {transaction.is_paid ? 'Pago' : 'Pendente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
