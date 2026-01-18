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
  Car,
  Users,
  TrendingUp,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import Link from "next/link"

async function getSalesData() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Estatísticas
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(final_price), 0) as total_value,
      COALESCE(SUM(commission_value), 0) as total_commissions,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
    FROM sales
    WHERE EXTRACT(MONTH FROM sale_date) = ${currentMonth}
    AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
  `

  // Todas as vendas
  const sales = await sql`
    SELECT s.*, 
      v.name as vehicle_name, 
      v.year as vehicle_year,
      u.name as seller_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    LEFT JOIN sellers sl ON s.seller_id = sl.id
    LEFT JOIN users u ON sl.user_id = u.id
    ORDER BY s.sale_date DESC
    LIMIT 100
  `

  // Top vendedores do mês
  const topSellers = await sql`
    SELECT 
      u.name,
      COUNT(s.id) as sales_count,
      COALESCE(SUM(s.final_price), 0) as total_value
    FROM sales s
    JOIN sellers sl ON s.seller_id = sl.id
    JOIN users u ON sl.user_id = u.id
    WHERE EXTRACT(MONTH FROM s.sale_date) = ${currentMonth}
    AND EXTRACT(YEAR FROM s.sale_date) = ${currentYear}
    AND s.status IN ('approved', 'completed')
    GROUP BY u.name
    ORDER BY sales_count DESC, total_value DESC
    LIMIT 5
  `

  return {
    stats: {
      total: Number(stats?.total_sales) || 0,
      value: Number(stats?.total_value) || 0,
      commissions: Number(stats?.total_commissions) || 0,
      pending: Number(stats?.pending) || 0,
      completed: Number(stats?.completed) || 0
    },
    sales,
    topSellers
  }
}

export default async function AdminSalesPage() {
  const { stats, sales, topSellers } = await getSalesData()

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600">Gerenciamento de vendas da concessionária</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/admin/sales/new">
              <Plus className="size-4 mr-2" />
              Nova Venda
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vendas do Mês</CardTitle>
            <Car className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">veículos vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Faturamento</CardTitle>
            <DollarSign className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.value)}
            </div>
            <p className="text-xs text-gray-500">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comissões</CardTitle>
            <TrendingUp className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.commissions)}
            </div>
            <p className="text-xs text-gray-500">a pagar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Concluídas</CardTitle>
            <CheckCircle className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
            <p className="text-xs text-gray-500">finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            <Clock className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-gray-500">aguardando</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Top Vendedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Top Vendedores
            </CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            {topSellers.length === 0 ? (
              <p className="text-center py-4 text-gray-500 text-sm">Nenhuma venda este mês</p>
            ) : (
              <div className="space-y-3">
                {topSellers.map((seller: any, index: number) => (
                  <div key={seller.name} className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{seller.name}</p>
                      <p className="text-xs text-gray-500">{seller.sales_count} vendas</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(Number(seller.total_value))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Vendas */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Todas as Vendas</CardTitle>
              <CardDescription>Histórico completo de vendas</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="size-4 mr-2" />
              Filtrar
            </Button>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-12">
                <Car className="size-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma venda registrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(sale.sale_date)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.vehicle_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{sale.vehicle_year}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sale.customer_name}</p>
                            <p className="text-xs text-gray-500">{sale.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{sale.seller_name || '-'}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          {formatCurrency(Number(sale.final_price))}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-amber-600">
                              {formatCurrency(Number(sale.commission_value))}
                            </p>
                            {sale.commission_paid ? (
                              <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-600">
                                Paga
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                                Pendente
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            sale.status === 'completed' ? 'bg-emerald-500' :
                            sale.status === 'approved' ? 'bg-blue-500' :
                            sale.status === 'cancelled' ? 'bg-red-500' :
                            'bg-amber-500'
                          }>
                            {sale.status === 'completed' ? 'Concluída' :
                             sale.status === 'approved' ? 'Aprovada' :
                             sale.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/sales/${sale.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/sales/${sale.id}/edit`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                          </div>
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
    </div>
  )
}
