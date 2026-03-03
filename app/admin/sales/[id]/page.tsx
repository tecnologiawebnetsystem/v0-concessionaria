import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Car, User, CreditCard, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { SaleStatusButton } from "./sale-status-button"

async function getSale(id: string) {
  const [sale] = await sql`
    SELECT s.*,
      v.name as vehicle_name, v.year as vehicle_year, v.slug as vehicle_slug,
      u.name as seller_name, u.email as seller_email, u.phone as seller_phone
    FROM sales s
    LEFT JOIN vehicles v ON s.vehicle_id = v.id
    LEFT JOIN sellers sl ON s.seller_id = sl.id
    LEFT JOIN users u ON sl.user_id = u.id
    WHERE s.id = ${id}
  `
  return sale
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  approved: { label: "Aprovada", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  completed: { label: "Concluída", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Cancelada", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

const paymentMap: Record<string, string> = {
  cash: "À Vista",
  financing: "Financiamento",
  consortium: "Consórcio",
  transfer: "Transferência",
  trade_in: "Troca + Complemento",
}

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sale = await getSale(id)
  if (!sale) notFound()

  const status = statusMap[sale.status] || statusMap.pending
  const discount = Number(sale.original_price) - Number(sale.final_price)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/sales">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalhe da Venda</h1>
            <p className="text-slate-400 text-sm font-mono">{sale.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={status.className}>{status.label}</Badge>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/admin/sales/${id}/edit`}>
              <Edit className="size-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Veículo */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="size-5 text-blue-400" />
              Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sale.vehicle_name ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nome</span>
                  <span className="text-white font-medium">{sale.vehicle_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ano</span>
                  <span className="text-white">{sale.vehicle_year}</span>
                </div>
                {sale.vehicle_slug && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Link</span>
                    <Link href={`/veiculos/${sale.vehicle_slug}`} target="_blank"
                      className="text-blue-400 hover:underline text-sm">
                      Ver no site
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-sm">Veículo não vinculado</p>
            )}
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="size-5 text-blue-400" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Nome</span>
              <span className="text-white font-medium">{sale.customer_name}</span>
            </div>
            {sale.customer_cpf && (
              <div className="flex justify-between">
                <span className="text-slate-400">CPF</span>
                <span className="text-white">{sale.customer_cpf}</span>
              </div>
            )}
            {sale.customer_email && (
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-white">{sale.customer_email}</span>
              </div>
            )}
            {sale.customer_phone && (
              <div className="flex justify-between">
                <span className="text-slate-400">Telefone</span>
                <span className="text-white">{sale.customer_phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financeiro */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="size-5 text-blue-400" />
              Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Valor de Venda</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(Number(sale.final_price))}</span>
            </div>
            {sale.original_price && Number(sale.original_price) !== Number(sale.final_price) && (
              <div className="flex justify-between">
                <span className="text-slate-400">Desconto</span>
                <span className="text-red-400">- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Pagamento</span>
              <span className="text-white">{paymentMap[sale.payment_method] || sale.payment_method || "—"}</span>
            </div>
            {sale.down_payment && (
              <div className="flex justify-between">
                <span className="text-slate-400">Entrada</span>
                <span className="text-white">{formatCurrency(Number(sale.down_payment))}</span>
              </div>
            )}
            {sale.installments && (
              <div className="flex justify-between">
                <span className="text-slate-400">Parcelas</span>
                <span className="text-white">{sale.installments}x</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span className="text-slate-400">Comissão ({sale.commission_rate}%)</span>
              <div className="text-right">
                <p className="text-amber-400 font-medium">{formatCurrency(Number(sale.commission_value))}</p>
                <Badge variant="outline" className={sale.commission_paid
                  ? "text-xs border-emerald-500 text-emerald-400"
                  : "text-xs border-amber-500 text-amber-400"}>
                  {sale.commission_paid ? "Paga" : "Pendente"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendedor e Datas */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="size-5 text-blue-400" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sale.seller_name && (
              <div className="flex justify-between">
                <span className="text-slate-400">Vendedor</span>
                <span className="text-white">{sale.seller_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Data da Venda</span>
              <span className="text-white">{formatDate(sale.sale_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cadastrado em</span>
              <span className="text-white">{formatDate(sale.created_at)}</span>
            </div>
            {sale.notes && (
              <div className="pt-2 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Observações</p>
                <p className="text-slate-300 text-sm">{sale.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações de Status */}
      <SaleStatusButton saleId={id} currentStatus={sale.status} commissionPaid={sale.commission_paid} />
    </div>
  )
}
