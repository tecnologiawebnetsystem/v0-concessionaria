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
import Link from "next/link"

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
    new: { label: "Novo", icon: Clock, className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    contacted: { label: "Contatado", icon: AlertCircle, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    closed: { label: "Fechado", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  }
  return statuses[status] || statuses.new
}

export default async function InquiriesPage() {
  const { inquiries, stats } = await getInquiries()

  const statCards = [
    { title: "Total de Contatos", value: stats.total, icon: MessageSquare, color: "from-blue-500 to-blue-700", shadow: "shadow-blue-500/25" },
    { title: "Novos", value: stats.new_count, icon: Clock, color: "from-amber-500 to-amber-700", shadow: "shadow-amber-500/25" },
    { title: "Em Atendimento", value: stats.contacted, icon: AlertCircle, color: "from-violet-500 to-violet-700", shadow: "shadow-violet-500/25" },
    { title: "Finalizados", value: stats.closed, icon: CheckCircle2, color: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-500/25" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Contatos</h1>
          <p className="text-slate-400">Gerencie as mensagens e solicitacoes de clientes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`bg-gradient-to-br ${stat.color} border-0 shadow-lg ${stat.shadow}`}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-white/20 p-3">
                <stat.icon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inquiries Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700">
          <div>
            <CardTitle className="text-white">Mensagens Recebidas</CardTitle>
            <CardDescription className="text-slate-400">{inquiries.length} contatos no total</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-300">Todos</SelectItem>
                <SelectItem value="new" className="text-slate-300">Novos</SelectItem>
                <SelectItem value="contacted" className="text-slate-300">Contatados</SelectItem>
                <SelectItem value="closed" className="text-slate-300">Fechados</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input placeholder="Buscar..." className="w-48 pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Veiculo de Interesse</TableHead>
                  <TableHead className="text-slate-400">Mensagem</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Data</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="mb-2 size-12 text-slate-600" />
                        <p className="text-slate-400">Nenhum contato recebido ainda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inquiry: any) => {
                    const statusInfo = getStatusInfo(inquiry.status)
                    const StatusIcon = statusInfo.icon

                    return (
                      <TableRow key={inquiry.id} className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="size-4 text-slate-500" />
                              <span className="font-medium text-white">{inquiry.name}</span>
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
                              <Car className="size-4 text-blue-400" />
                              <div>
                                <p className="font-medium text-white">{inquiry.vehicle_name}</p>
                                {inquiry.vehicle_price && (
                                  <p className="text-sm text-emerald-400">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(Number(inquiry.vehicle_price))}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">Contato geral</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="max-w-xs truncate text-sm text-slate-400">
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
                              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-slate-700">
                                <Eye className="mr-2 size-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-slate-700">
                                <Reply className="mr-2 size-4" />
                                Responder
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-slate-700">
                                <CheckCircle2 className="mr-2 size-4" />
                                Marcar como Fechado
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-700" />
                              <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-slate-700">
                                <Archive className="mr-2 size-4" />
                                Arquivar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 focus:bg-slate-700 focus:text-red-400">
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
