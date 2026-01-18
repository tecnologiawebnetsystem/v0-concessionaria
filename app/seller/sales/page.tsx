import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Filter
} from "lucide-react"
import Link from "next/link"

async function getSellerSales(userId: string) {
  const [seller] = await sql`SELECT id FROM sellers WHERE user_id = ${userId}`
  
  if (!seller) return { sales: [], summary: null }

  const sales = await sql`
    SELECT s.*, v.name as vehicle_name, v.year as vehicle_year
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    WHERE s.seller_id = ${seller.id}
    ORDER BY s.sale_date DESC
  `

  const [summary] = await sql`
    SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(final_price), 0) as total_value,
      COALESCE(SUM(commission_value), 0) as total_commission,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sales,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_sales
    FROM sales 
    WHERE seller_id = ${seller.id}
  `

  return { sales, summary }
}

export default async function SellerSalesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { sales, summary } = await getSellerSales(session.userId)

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Vendas</h1>
        <p className="text-gray-600">Histórico completo de todas as suas vendas</p>
      </div>

      {/* Cards Resumo */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Vendas</CardTitle>
              <Car className="size-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_sales}</div>
              <p className="text-xs text-gray-500">{summary.completed_sales} concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
              <DollarSign className="size-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(Number(summary.total_value))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Comissões Totais</CardTitle>
              <DollarSign className="size-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(Number(summary.total_commission))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
              <Calendar className="size-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{summary.pending_sales}</div>
              <p className="text-xs text-gray-500">aguardando</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico de Vendas</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="size-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-12">
              <Car className="size-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhuma venda registrada ainda</p>
              <p className="text-sm text-gray-400">Suas vendas aparecerão aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor Final</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Pagamento</TableHead>
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
                      <TableCell className="font-semibold text-emerald-600">
                        {formatCurrency(Number(sale.final_price))}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-amber-600">
                            {formatCurrency(Number(sale.commission_value))}
                          </p>
                          <p className="text-xs text-gray-500">{sale.commission_rate}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sale.payment_method === 'cash' ? 'À Vista' :
                           sale.payment_method === 'financing' ? 'Financiamento' :
                           sale.payment_method === 'consortium' ? 'Consórcio' :
                           sale.payment_method === 'trade_in' ? 'Troca' : 
                           sale.payment_method === 'mixed' ? 'Misto' : sale.payment_method}
                        </Badge>
                        {sale.has_trade_in && (
                          <Badge variant="secondary" className="ml-1 text-xs">+Troca</Badge>
                        )}
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
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/seller/sales/${sale.id}`}>
                            <Eye className="size-4" />
                          </Link>
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
