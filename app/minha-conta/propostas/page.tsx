import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  DollarSign,
  Calendar,
  ArrowRight,
  Eye,
} from "lucide-react"

async function getUserProposals(userEmail: string) {
  try {
    const result = await sql`
      SELECT * FROM proposals 
      WHERE email = ${userEmail}
      ORDER BY created_at DESC
    `
    return result
  } catch {
    return []
  }
}

async function getUserInfo(userId: string) {
  try {
    const result = await sql`SELECT name, email FROM users WHERE id = ${userId}`
    return result[0]
  } catch {
    return null
  }
}

export default async function CustomerProposalsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await getUserInfo(session.userId)
  if (!user) redirect("/login")

  const proposals = await getUserProposals(user.email)

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pendente" },
    approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Aprovada" },
    rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejeitada" },
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Propostas</h1>
          <p className="text-muted-foreground">Acompanhe todas as suas propostas de compra</p>
        </div>
        <Link href="/veiculos">
          <Button>
            <Car className="mr-2 h-4 w-4" />
            Ver Veículos
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{proposals.length}</p>
              <p className="text-sm text-muted-foreground">Total de Propostas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-xl">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {proposals.filter((p: any) => p.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Em Análise</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {proposals.filter((p: any) => p.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Aprovadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal: any) => {
            const status = statusConfig[proposal.status] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <Card key={proposal.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{proposal.vehicle_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Enviada em {new Date(proposal.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Valor do Veículo</p>
                        <p className="font-semibold">{formatCurrency(proposal.vehicle_price)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sua Proposta</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(proposal.proposed_price)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Forma de Pagamento</p>
                        <p className="font-semibold capitalize">{proposal.payment_method === "cash" ? "À Vista" : proposal.payment_method === "financing" ? "Financiamento" : proposal.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Veículo na Troca</p>
                        <p className="font-semibold">{proposal.has_trade_in ? "Sim" : "Não"}</p>
                      </div>
                    </div>

                    {proposal.has_trade_in && proposal.trade_in_brand && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm font-medium mb-1">Veículo para troca:</p>
                        <p className="text-sm text-muted-foreground">
                          {proposal.trade_in_brand} {proposal.trade_in_model} {proposal.trade_in_year}
                          {proposal.trade_in_mileage && ` - ${proposal.trade_in_mileage.toLocaleString()} km`}
                        </p>
                      </div>
                    )}

                    {proposal.message && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground italic">"{proposal.message}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 md:w-40">
                    <Link href={`/veiculos/${proposal.vehicle_slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Veículo
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma proposta enviada</h3>
            <p className="text-muted-foreground mb-4">
              Explore nosso estoque e envie sua primeira proposta!
            </p>
            <Link href="/veiculos">
              <Button>
                Ver Veículos Disponíveis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
