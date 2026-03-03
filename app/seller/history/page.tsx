import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Clock,
  Car,
  DollarSign,
  TrendingUp,
  CheckCircle,
  User,
} from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

async function getSellerHistory(sellerUserId: string) {
  try {
    const sales = await sql`
      SELECT 
        s.id,
        s.sale_date,
        s.final_price,
        s.commission_value,
        s.payment_method,
        s.status,
        v.name as vehicle_name,
        v.year as vehicle_year,
        u.name as customer_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN sellers sl ON s.seller_id = sl.id
      LEFT JOIN users u ON sl.user_id = u.id
      ORDER BY s.sale_date DESC
      LIMIT 200
    `
    return sales
  } catch {
    return []
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date))
}

const paymentLabels: Record<string, string> = {
  cash: "A Vista",
  financing: "Financiamento",
  consortium: "Consorcio",
  trade_in: "Troca",
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:   { label: "Pendente",   className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    approved:  { label: "Aprovada",   className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    completed: { label: "Concluida",  className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    cancelled: { label: "Cancelada",  className: "bg-red-500/10 text-red-400 border-red-500/20" },
  }
  const s = map[status] ?? { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
  return <Badge className={`border ${s.className}`}>{s.label}</Badge>
}

export default async function SellerHistoryPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const sales = await getSellerHistory(session.userId)

  const totalValue = sales.reduce((acc: number, s: any) => acc + Number(s.final_price || 0), 0)
  const totalCommissions = sales.reduce((acc: number, s: any) => acc + Number(s.commission_value || 0), 0)
  const completed = sales.filter((s: any) => s.status === "completed").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Historico de Vendas</h1>
        <p className="text-gray-400 mt-1">Todas as suas negociacoes registradas</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10">
                <Car className="size-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{sales.length}</p>
                <p className="text-sm text-gray-400">Total de Vendas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <DollarSign className="size-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-gray-400">Volume Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <TrendingUp className="size-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalCommissions)}</p>
                <p className="text-sm text-gray-400">Total em Comissoes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="size-5 text-red-400" />
            Historico Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="size-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg font-medium">Nenhuma venda registrada</p>
              <p className="text-gray-600 text-sm mt-1">As suas vendas aparecerão aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Veiculo</TableHead>
                    <TableHead className="text-gray-400">Cliente</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Comissao</TableHead>
                    <TableHead className="text-gray-400">Pagamento</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((s: any) => (
                    <TableRow key={s.id} className="border-gray-800 hover:bg-gray-800/40">
                      <TableCell className="text-gray-300 text-sm">
                        {s.sale_date ? formatDate(s.sale_date) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="size-4 text-gray-500 shrink-0" />
                          <span className="text-white font-medium">
                            {s.vehicle_name ? `${s.vehicle_name} ${s.vehicle_year ?? ""}` : "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="size-4 text-gray-500" />
                          {s.customer_name ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-emerald-400 font-semibold">
                        {s.final_price ? formatCurrency(Number(s.final_price)) : "—"}
                      </TableCell>
                      <TableCell className="text-amber-400 font-medium">
                        {s.commission_value ? formatCurrency(Number(s.commission_value)) : "—"}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {paymentLabels[s.payment_method] ?? s.payment_method ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
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
