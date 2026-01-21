import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
  DollarSign,
  Car,
  Gauge,
  Fuel,
} from "lucide-react"

async function getUserEvaluations(userEmail: string) {
  try {
    const result = await sql`
      SELECT * FROM vehicle_evaluations 
      WHERE customer_email = ${userEmail}
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

export default async function CustomerEvaluationsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await getUserInfo(session.userId)
  if (!user) redirect("/login")

  const evaluations = await getUserEvaluations(user.email)

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Em Análise" },
    evaluated: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Avaliado" },
    rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Não Aceito" },
  }

  const conditionLabels: Record<string, string> = {
    excellent: "Excelente",
    good: "Bom",
    fair: "Regular",
    poor: "Ruim",
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
          <h1 className="text-2xl font-bold">Minhas Avaliações</h1>
          <p className="text-muted-foreground">Veículos que você enviou para avaliação de troca</p>
        </div>
        <Link href="/veiculos">
          <Button>
            <ClipboardList className="mr-2 h-4 w-4" />
            Avaliar Outro
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{evaluations.length}</p>
              <p className="text-sm text-muted-foreground">Total de Avaliações</p>
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
                {evaluations.filter((e: any) => e.status === "pending").length}
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
                {evaluations.filter((e: any) => e.status === "evaluated").length}
              </p>
              <p className="text-sm text-muted-foreground">Avaliados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations List */}
      {evaluations.length > 0 ? (
        <div className="space-y-4">
          {evaluations.map((evaluation: any) => {
            const status = statusConfig[evaluation.status] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <Card key={evaluation.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                          <Car className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {evaluation.brand} {evaluation.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {evaluation.version} - {evaluation.year}
                          </p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span>{evaluation.mileage?.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <span>{evaluation.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(evaluation.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cor:</span> {evaluation.color}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Condição:</span>
                        <Badge variant="outline">{conditionLabels[evaluation.condition] || evaluation.condition}</Badge>
                      </div>

                      {evaluation.message && (
                        <p className="mt-3 text-sm text-muted-foreground italic">"{evaluation.message}"</p>
                      )}
                    </div>

                    {evaluation.status === "evaluated" && evaluation.estimated_value && (
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-xl text-center min-w-[200px]">
                        <p className="text-sm text-muted-foreground mb-1">Valor Estimado</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(evaluation.estimated_value)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          *Sujeito a vistoria presencial
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação solicitada</h3>
            <p className="text-muted-foreground mb-4">
              Descubra quanto vale seu carro usado e use como entrada na compra de um novo!
            </p>
            <Link href="/veiculos">
              <Button>
                Avaliar Meu Carro
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
