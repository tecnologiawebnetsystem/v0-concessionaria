import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
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
  Calendar,
  Wallet
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getSellerCommissions(userId: string) {
  const [seller] = await sql`SELECT * FROM sellers WHERE user_id = ${userId}`
  
  if (!seller) return null

  // Comissões pendentes
  const pendingCommissions = await sql`
    SELECT s.*, v.name as vehicle_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    WHERE s.seller_id = ${seller.id}
    AND s.commission_paid = false
    AND s.status IN ('approved', 'completed')
    ORDER BY s.sale_date DESC
  `

  // Comissões pagas
  const paidCommissions = await sql`
    SELECT s.*, v.name as vehicle_name
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    WHERE s.seller_id = ${seller.id}
    AND s.commission_paid = true
    ORDER BY s.commission_paid_at DESC
    LIMIT 50
  `

  // Resumo por mês (últimos 6 meses)
  const monthlyCommissions = await sql`
    SELECT 
      EXTRACT(YEAR FROM sale_date) as year,
      EXTRACT(MONTH FROM sale_date) as month,
      COUNT(*) as sales_count,
      COALESCE(SUM(commission_value), 0) as total_commission,
      SUM(CASE WHEN commission_paid THEN commission_value ELSE 0 END) as paid_commission,
      SUM(CASE WHEN NOT commission_paid THEN commission_value ELSE 0 END) as pending_commission
    FROM sales
    WHERE seller_id = ${seller.id}
    AND sale_date >= CURRENT_DATE - INTERVAL '6 months'
    AND status IN ('approved', 'completed')
    GROUP BY EXTRACT(YEAR FROM sale_date), EXTRACT(MONTH FROM sale_date)
    ORDER BY year DESC, month DESC
  `

  // Totais
  const [totals] = await sql`
    SELECT 
      COALESCE(SUM(commission_value), 0) as total_earned,
      COALESCE(SUM(CASE WHEN commission_paid THEN commission_value ELSE 0 END), 0) as total_paid,
      COALESCE(SUM(CASE WHEN NOT commission_paid THEN commission_value ELSE 0 END), 0) as total_pending
    FROM sales
    WHERE seller_id = ${seller.id}
    AND status IN ('approved', 'completed')
  `

  return {
    seller,
    pendingCommissions,
    paidCommissions,
    monthlyCommissions,
    totals
  }
}

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default async function SellerCommissionsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const data = await getSellerCommissions(session.userId)

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Perfil de vendedor não encontrado</p>
      </div>
    )
  }

  const { seller, pendingCommissions, paidCommissions, monthlyCommissions, totals } = data

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Comissões</h1>
        <p className="text-gray-600">Acompanhe suas comissões e pagamentos</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Comissão</CardTitle>
            <TrendingUp className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{seller.commission_rate}%</div>
            <p className="text-xs text-gray-500">Sobre cada venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ganho</CardTitle>
            <Wallet className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(Number(totals.total_earned))}
            </div>
            <p className="text-xs text-gray-500">Desde o início</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recebido</CardTitle>
            <CheckCircle className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(Number(totals.total_paid))}
            </div>
            <p className="text-xs text-gray-500">Já pago</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Pendente</CardTitle>
            <Clock className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(Number(totals.total_pending))}
            </div>
            <p className="text-xs text-amber-600">{pendingCommissions.length} vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico Mensal</CardTitle>
          <CardDescription>Comissões dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {monthlyCommissions.map((month: any) => (
              <div key={`${month.year}-${month.month}`} className="p-4 border rounded-lg text-center">
                <p className="text-sm font-medium text-gray-600">
                  {monthNames[month.month - 1]}/{month.year}
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(Number(month.total_commission))}
                </p>
                <p className="text-xs text-gray-500">{month.sales_count} vendas</p>
                <div className="mt-2 flex justify-center gap-1">
                  {Number(month.paid_commission) > 0 && (
                    <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-600">
                      Pago: {formatCurrency(Number(month.paid_commission))}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {monthlyCommissions.length === 0 && (
              <div className="col-span-6 text-center py-8 text-gray-500">
                Nenhuma comissão nos últimos 6 meses
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Comissões */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="size-4" />
            Pendentes ({pendingCommissions.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            <CheckCircle className="size-4" />
            Pagas ({paidCommissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-700">Comissões Pendentes</CardTitle>
              <CardDescription>Aguardando pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCommissions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="size-12 mx-auto text-emerald-300 mb-4" />
                  <p className="text-gray-500">Nenhuma comissão pendente</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data da Venda</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor da Venda</TableHead>
                      <TableHead>Taxa</TableHead>
                      <TableHead>Comissão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCommissions.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell>{formatDate(sale.sale_date)}</TableCell>
                        <TableCell className="font-medium">{sale.vehicle_name || 'N/A'}</TableCell>
                        <TableCell>{sale.customer_name}</TableCell>
                        <TableCell>{formatCurrency(Number(sale.final_price))}</TableCell>
                        <TableCell>{sale.commission_rate}%</TableCell>
                        <TableCell className="font-semibold text-amber-600">
                          {formatCurrency(Number(sale.commission_value))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Comissões Pagas</CardTitle>
              <CardDescription>Histórico de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              {paidCommissions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="size-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum pagamento registrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pago em</TableHead>
                      <TableHead>Venda em</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Comissão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidCommissions.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          {sale.commission_paid_at ? formatDate(sale.commission_paid_at) : '-'}
                        </TableCell>
                        <TableCell>{formatDate(sale.sale_date)}</TableCell>
                        <TableCell className="font-medium">{sale.vehicle_name || 'N/A'}</TableCell>
                        <TableCell>{sale.customer_name}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          {formatCurrency(Number(sale.commission_value))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
