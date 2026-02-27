import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Car,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react"

async function getUserTestDrives(userEmail: string) {
  try {
    const result = await sql`
      SELECT * FROM test_drives 
      WHERE customer_email = ${userEmail}
      ORDER BY preferred_date DESC
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

export default async function CustomerTestDrivesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await getUserInfo(session.userId)
  if (!user) redirect("/login")

  const testDrives = await getUserTestDrives(user.email)

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Aguardando Confirmação" },
    confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Confirmado" },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Realizado" },
    cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelado" },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Test Drives</h1>
          <p className="text-muted-foreground">Acompanhe seus agendamentos de test drive</p>
        </div>
        <Link href="/veiculos">
          <Button>
            <Car className="mr-2 h-4 w-4" />
            Agendar Novo
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{testDrives.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
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
                {testDrives.filter((td: any) => td.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {testDrives.filter((td: any) => td.status === "confirmed").length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmados</p>
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
                {testDrives.filter((td: any) => td.status === "completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Realizados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Drives List */}
      {testDrives.length > 0 ? (
        <div className="space-y-4">
          {testDrives.map((td: any) => {
            const status = statusConfig[td.status] || statusConfig.pending
            const StatusIcon = status.icon
            const isUpcoming = new Date(td.preferred_date) >= new Date()

            return (
              <Card key={td.id} className={`overflow-hidden ${isUpcoming && td.status === "confirmed" ? "border-blue-500 border-2" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${td.status === "confirmed" ? "bg-blue-100" : "bg-slate-100"}`}>
                          <Car className={`h-6 w-6 ${td.status === "confirmed" ? "text-blue-600" : "text-slate-600"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {td.message?.includes("Interesse em:") 
                              ? td.message.split("Interesse em:")[1]?.split(".")[0]?.trim() 
                              : "Test Drive Agendado"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(td.preferred_date).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {td.preferred_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              GT Veículos - Taubaté
                            </span>
                          </div>
                          {td.message && !td.message.includes("Interesse em:") && (
                            <p className="mt-2 text-sm text-muted-foreground italic">"{td.message}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  {td.status === "confirmed" && isUpcoming && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Seu test drive está confirmado! Lembre-se de trazer sua CNH válida.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhum test drive agendado</h3>
            <p className="text-muted-foreground mb-4">
              Agende um test drive e experimente o carro dos seus sonhos!
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
