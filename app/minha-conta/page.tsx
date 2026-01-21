import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Heart,
  FileText,
  Car,
  ClipboardList,
  Bell,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react"

async function getCustomerData(userEmail: string) {
  try {
    const [proposals, testDrives, evaluations] = await Promise.all([
      sql`SELECT id, vehicle_name, status, created_at FROM proposals WHERE email = ${userEmail} ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT id, customer_name, preferred_date, preferred_time, status, message FROM test_drives WHERE customer_email = ${userEmail} ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT id, brand, model, year, status, created_at FROM vehicle_evaluations WHERE customer_email = ${userEmail} ORDER BY created_at DESC LIMIT 5`,
    ])

    const proposalStats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
      FROM proposals WHERE email = ${userEmail}
    `

    const testDriveStats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed
      FROM test_drives WHERE customer_email = ${userEmail}
    `

    return {
      proposals,
      testDrives,
      evaluations,
      stats: {
        proposals: proposalStats[0],
        testDrives: testDriveStats[0],
      },
    }
  } catch (error) {
    console.error("Error fetching customer data:", error)
    return {
      proposals: [],
      testDrives: [],
      evaluations: [],
      stats: {
        proposals: { total: 0, pending: 0, approved: 0 },
        testDrives: { total: 0, pending: 0, confirmed: 0 },
      },
    }
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

export default async function CustomerDashboard() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await getUserInfo(session.userId)
  if (!user) redirect("/login")

  const data = await getCustomerData(user.email)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    evaluated: "bg-green-100 text-green-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Rejeitada",
    confirmed: "Confirmado",
    completed: "Concluído",
    evaluated: "Avaliado",
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Olá, {user.name?.split(" ")[0]}!
        </h1>
        <p className="text-blue-100">
          Bem-vindo ao seu painel. Aqui você pode acompanhar suas propostas,
          test drives e muito mais.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Propostas</p>
                <p className="text-2xl font-bold">{Number(data.stats.proposals.total) || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {Number(data.stats.proposals.pending) || 0} pendente(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl">
                <Car className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Drives</p>
                <p className="text-2xl font-bold">{Number(data.stats.testDrives.total) || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {Number(data.stats.testDrives.confirmed) || 0} confirmado(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-xl">
                <ClipboardList className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avaliações</p>
                <p className="text-2xl font-bold">{data.evaluations.length}</p>
                <p className="text-xs text-muted-foreground">de veículos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-xl">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">veículos salvos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Minhas Propostas</CardTitle>
            <Link href="/minha-conta/propostas">
              <Button variant="ghost" size="sm">
                Ver todas <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.proposals.length > 0 ? (
              <div className="space-y-4">
                {data.proposals.map((proposal: any) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{proposal.vehicle_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(proposal.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className={statusColors[proposal.status]}>
                      {statusLabels[proposal.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhuma proposta enviada</p>
                <Link href="/veiculos">
                  <Button variant="link" className="mt-2">
                    Explorar veículos
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Test Drives */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Meus Test Drives</CardTitle>
            <Link href="/minha-conta/test-drives">
              <Button variant="ghost" size="sm">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.testDrives.length > 0 ? (
              <div className="space-y-4">
                {data.testDrives.map((td: any) => (
                  <div
                    key={td.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{td.message?.split(":")[1]?.trim() || "Test Drive"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(td.preferred_date).toLocaleDateString("pt-BR")} às {td.preferred_time}
                      </p>
                    </div>
                    <Badge className={statusColors[td.status]}>
                      {statusLabels[td.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum test drive agendado</p>
                <Link href="/veiculos">
                  <Button variant="link" className="mt-2">
                    Agendar test drive
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/veiculos">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <Car className="h-6 w-6" />
                <span className="text-xs">Ver Veículos</span>
              </Button>
            </Link>
            <Link href="/minha-conta/favoritos">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <Heart className="h-6 w-6" />
                <span className="text-xs">Favoritos</span>
              </Button>
            </Link>
            <Link href="/minha-conta/avaliacoes">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Avaliar Meu Carro</span>
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <Bell className="h-6 w-6" />
                <span className="text-xs">Falar Conosco</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
