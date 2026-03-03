import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Clock, Car, DollarSign, TrendingUp, User } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

async function getSellerHistory(userId: string) {
  try {
    const [seller] = await sql`SELECT id FROM sellers WHERE user_id = ${userId}`
    if (!seller) return []

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
        b.name as brand_name,
        s.customer_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE s.seller_id = ${seller.id}
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
  cash: "A Vista", financing: "Financiamento", consortium: "Consorcio", trade_in: "Troca", mixed: "Misto",
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:   { label: "Pendente",  className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    approved:  { label: "Aprovada",  className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    completed: { label: "Concluida", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    cancelled: { label: "Cancelada", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  }
  const s = map[status] ?? { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
  return <Badge className={`border ${s.className}`}>{s.label}</Badge>
}

export default async function SellerHistoryPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const sales = await getSellerHistory(session.userId)

  const totalValue       = sales.reduce((a: number, s: any) => a + Number(s.final_price   || 0), 0)
  const totalCommissions = sales.reduce((a: number, s: any) => a + Number(s.commission_value || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Historico de Vendas</h1>
        <p className="text-gray-400 mt-1">Todas as suas negociacoes registradas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Car,        color: "red",     label: "Total de Vendas",    value: sales.length },
          { icon: DollarSign, color: "emerald", label: "Volume Total",       value: formatCurrency(totalValue) },
          { icon: TrendingUp, color: "amber",   label: "Total em Comissoes", value: formatCurrency(totalCommissions) },
        ].map((c, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${c.color}-500/10`}>
                  <c.icon className={`size-6 text-${c.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{c.value}</p>
                  <p className="text-sm text-gray-400">{c.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="size-5 text-red-400" /> Historico Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="size-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg font-medium">Nenhuma venda registrada</p>
              <p className="text-gray-600 text-sm mt-1">As suas vendas aparecerao aqui</p>
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
                      <TableCell className="text-gray-300 text-sm">{s.sale_date ? formatDate(s.sale_date) : "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="size-4 text-gray-500 shrink-0" />
                          <span className="text-white font-medium">
                            {s.brand_name ? `${s.brand_name} ${s.vehicle_name} ${s.vehicle_year ?? ""}` : "—"}
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
                      <TableCell><StatusBadge status={s.status} /></TableCell>
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
