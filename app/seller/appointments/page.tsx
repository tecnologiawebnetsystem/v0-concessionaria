import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Calendar, Clock, Car, User, Phone, CheckCircle, AlertCircle,
} from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { SellerAppointmentActions } from "@/components/seller/seller-appointment-actions"

async function getAppointments() {
  try {
    return await sql`
      SELECT 
        td.id,
        td.customer_name,
        td.customer_phone,
        td.customer_email,
        td.preferred_date,
        td.preferred_time,
        td.status,
        td.message,
        td.notes,
        td.created_at,
        v.name as vehicle_name,
        v.year as vehicle_year,
        b.name as brand_name
      FROM test_drives td
      LEFT JOIN vehicles v ON td.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      ORDER BY 
        CASE WHEN td.preferred_date >= CURRENT_DATE THEN 0 ELSE 1 END,
        td.preferred_date ASC,
        td.preferred_time ASC
      LIMIT 100
    `
  } catch {
    return []
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending:   { label: "Pendente",   className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    confirmed: { label: "Confirmado", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    completed: { label: "Realizado",  className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelled: { label: "Cancelado",  className: "bg-red-500/10 text-red-400 border-red-500/20" },
  }
  const s = map[status] ?? { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
  return <Badge className={`border ${s.className}`}>{s.label}</Badge>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date))
}

export default async function SellerAppointmentsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const appointments = await getAppointments()

  const pending   = appointments.filter((a: any) => a.status === "pending").length
  const confirmed = appointments.filter((a: any) => a.status === "confirmed").length
  const today = new Date().toISOString().split("T")[0]
  const todayCount = appointments.filter((a: any) => String(a.preferred_date).startsWith(today)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
        <p className="text-gray-400 mt-1">Test drives agendados pelos clientes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: AlertCircle, color: "amber",   label: "Pendentes",   value: pending },
          { icon: CheckCircle, color: "emerald", label: "Confirmados", value: confirmed },
          { icon: Calendar,    color: "blue",    label: "Hoje",        value: todayCount },
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
            <Calendar className="size-5 text-red-400" />
            Lista de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="size-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg font-medium">Nenhum agendamento</p>
              <p className="text-gray-600 text-sm mt-1">Os test drives solicitados aparecerao aqui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Cliente</TableHead>
                    <TableHead className="text-gray-400">Veiculo</TableHead>
                    <TableHead className="text-gray-400">Data / Hora</TableHead>
                    <TableHead className="text-gray-400">Contato</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((a: any) => (
                    <TableRow key={a.id} className="border-gray-800 hover:bg-gray-800/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-gray-500" />
                          <span className="text-white font-medium">{a.customer_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="size-4 text-gray-500" />
                          <span className="text-gray-300">
                            {a.vehicle_name ? `${a.brand_name ?? ""} ${a.vehicle_name} ${a.vehicle_year ?? ""}`.trim() : "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white text-sm flex items-center gap-1">
                            <Calendar className="size-3 text-gray-500" />
                            {a.preferred_date ? formatDate(a.preferred_date) : "—"}
                          </span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock className="size-3 text-gray-500" />
                            {a.preferred_time ?? "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                          <Phone className="size-3 text-gray-500" />
                          {a.customer_phone}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell>
                        <SellerAppointmentActions id={a.id} status={a.status} />
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
