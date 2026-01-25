import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { sql } from "@/lib/db"
import { 
  MessageSquare,
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Reply,
  Archive,
  Trash2,
  Car,
  User,
  Filter,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

async function getInquiries() {
  const inquiries = await sql`
    SELECT i.*, v.name as vehicle_name, v.price as vehicle_price
    FROM inquiries i
    LEFT JOIN vehicles v ON i.vehicle_id = v.id
    ORDER BY i.created_at DESC
  `
  
  const stats = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'new') as new_count,
      COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
      COUNT(*) FILTER (WHERE status = 'closed') as closed
    FROM inquiries
  `

  return { inquiries, stats: stats[0] }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function getStatusInfo(status: string) {
  const statuses: Record<string, { label: string; icon: any; className: string }> = {
    new: { label: "Novo", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
    contacted: { label: "Contatado", icon: AlertCircle, className: "bg-blue-100 text-blue-700 border-blue-200" },
    closed: { label: "Fechado", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  }
  return statuses[status] || statuses.new
}

export default async function InquiriesPage() {
  const { inquiries, stats } = await getInquiries()

  const statCards = [
    { title: "Total de Contatos", value: stats.total, icon: MessageSquare, color: "from-blue-500 to-blue-700" },
    { title: "Novos", value: stats.new_count, icon: Clock, color: "from-amber-500 to-amber-700" },
    { title: "Em Atendimento", value: stats.contacted, icon: AlertCircle, color: "from-violet-500 to-violet-700" },
    { title: "Finalizados", value: stats.closed, icon: CheckCircle2, color: "from-emerald-500 to-emerald-700" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Contatos</h1>
          <p className="text-slate-500">Gerencie as mensagens e solicitacoes de clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 size-4" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Archive className="mr-2 size-4" />
            Arquivados
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg`}>
                <stat.icon className="size-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inquiries Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Mensagens Recebidas</CardTitle>
            <CardDescription>{inquiries.length} contatos no total</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contatados</SelectItem>
                <SelectItem value="closed">Fechados</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Buscar..." className="w-48 pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veiculo de Interesse</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="mb-2 size-12 text-slate-300" />
                        <p className="text-slate-500">Nenhum contato recebido ainda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inquiry: any) => {
                    const statusInfo = getStatusInfo(inquiry.status)
                    const StatusIcon = statusInfo.icon

                    return (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="size-4 text-slate-400" />
                              <span className="font-medium text-slate-900">{inquiry.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Mail className="size-3" />
                              {inquiry.email}
                            </div>
                            {inquiry.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="size-3" />
                                {inquiry.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {inquiry.vehicle_name ? (
                            <div className="flex items-center gap-2">
                              <Car className="size-4 text-blue-500" />
                              <div>
                                <p className="font-medium text-slate-900">{inquiry.vehicle_name}</p>
                                {inquiry.vehicle_price && (
                                  <p className="text-sm text-emerald-600">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(Number(inquiry.vehicle_price))}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Contato geral</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="max-w-xs truncate text-sm text-slate-600">
                            {inquiry.message || "Sem mensagem"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusInfo.className}>
                            <StatusIcon className="mr-1 size-3" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="size-3" />
                            {formatDate(inquiry.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 size-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="mr-2 size-4" />
                                Responder
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marcar como Fechado
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Archive className="mr-2 size-4" />
                                Arquivar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 size-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
