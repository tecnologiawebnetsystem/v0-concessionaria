"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import {
  MessageSquare, Search, Mail, Phone, Calendar, Clock, CheckCircle2,
  AlertCircle, MoreHorizontal, Eye, Archive, Trash2, Car, User, Loader2, Reply,
} from "lucide-react"

type Inquiry = {
  id: string; name: string; email: string; phone?: string; message?: string
  status: string; type?: string; vehicle_name?: string; vehicle_price?: string
  created_at: string
}

type Stats = { total: number | string; new_count: number | string; contacted: number | string; closed: number | string }

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(date))
}

const statusMap: Record<string, { label: string; icon: any; className: string }> = {
  new: { label: "Novo", icon: Clock, className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  contacted: { label: "Contatado", icon: AlertCircle, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  closed: { label: "Fechado", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
}

export function InquiriesClient({ initialInquiries, stats }: { initialInquiries: Inquiry[]; stats: Stats }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [detailInquiry, setDetailInquiry] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = initialInquiries.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.vehicle_name || "").toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || i.status === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(id: string, status: string, noteText?: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: noteText }),
      })
      if (!res.ok) throw new Error()
      toast.success("Status atualizado!")
      setDetailInquiry(null)
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar contato")
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Contato excluido!")
      setDeleteId(null)
      router.refresh()
    } catch {
      toast.error("Erro ao excluir contato")
    } finally {
      setLoading(null)
    }
  }

  const statCards = [
    { title: "Total", value: stats.total, icon: MessageSquare, color: "from-blue-500 to-blue-700" },
    { title: "Novos", value: stats.new_count, icon: Clock, color: "from-amber-500 to-amber-700" },
    { title: "Em Atendimento", value: stats.contacted, icon: AlertCircle, color: "from-violet-500 to-violet-700" },
    { title: "Finalizados", value: stats.closed, icon: CheckCircle2, color: "from-emerald-500 to-emerald-700" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Contatos</h1>
          <p className="text-slate-400">Gerencie as mensagens e solicitacoes de clientes</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} className={`bg-gradient-to-br ${s.color} border-0`}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-white/20 p-3">
                <s.icon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-white/70">{s.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700">
          <div>
            <CardTitle className="text-white">Mensagens Recebidas</CardTitle>
            <CardDescription className="text-slate-400">{filtered.length} contatos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
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
              <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-48 pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Veiculo</TableHead>
                  <TableHead className="text-slate-400">Mensagem</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Data</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="mb-2 size-12 text-slate-600" />
                        <p className="text-slate-400">Nenhum contato encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((inquiry) => {
                  const s = statusMap[inquiry.status] || statusMap.new
                  const StatusIcon = s.icon
                  return (
                    <TableRow key={inquiry.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-slate-500" />
                            <span className="font-medium text-white">{inquiry.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Mail className="size-3" />{inquiry.email}
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Phone className="size-3" />{inquiry.phone}
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
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
                                    .format(Number(inquiry.vehicle_price))}
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
                        <Badge variant="outline" className={s.className}>
                          <StatusIcon className="mr-1 size-3" />
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="size-3" />{formatDate(inquiry.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"
                              className="text-slate-400 hover:text-white hover:bg-slate-700"
                              disabled={loading === inquiry.id}>
                              {loading === inquiry.id
                                ? <Loader2 className="size-4 animate-spin" />
                                : <MoreHorizontal className="size-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem onClick={() => { setDetailInquiry(inquiry); setNotes("") }}
                              className="text-slate-300 hover:text-white focus:bg-slate-700 cursor-pointer">
                              <Eye className="mr-2 size-4" />Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "contacted")}
                              className="text-slate-300 hover:text-white focus:bg-slate-700 cursor-pointer">
                              <Reply className="mr-2 size-4" />Marcar Contatado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "closed")}
                              className="text-slate-300 hover:text-white focus:bg-slate-700 cursor-pointer">
                              <CheckCircle2 className="mr-2 size-4" />Fechar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem onClick={() => setDeleteId(inquiry.id)}
                              className="text-red-400 focus:bg-slate-700 focus:text-red-400 cursor-pointer">
                              <Trash2 className="mr-2 size-4" />Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailInquiry} onOpenChange={open => !open && setDetailInquiry(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Contato</DialogTitle>
            <DialogDescription className="text-slate-400">
              {detailInquiry?.name} — {detailInquiry && formatDate(detailInquiry.created_at)}
            </DialogDescription>
          </DialogHeader>
          {detailInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500">Email</p><p className="text-white">{detailInquiry.email}</p></div>
                {detailInquiry.phone && <div><p className="text-slate-500">Telefone</p><p className="text-white">{detailInquiry.phone}</p></div>}
                {detailInquiry.vehicle_name && <div className="col-span-2"><p className="text-slate-500">Veiculo</p><p className="text-white">{detailInquiry.vehicle_name}</p></div>}
                {detailInquiry.message && <div className="col-span-2"><p className="text-slate-500 mb-1">Mensagem</p><p className="text-slate-300 bg-slate-900/50 rounded p-2">{detailInquiry.message}</p></div>}
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300">Anotacoes internas</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Adicionar notas sobre este contato..."
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" rows={3} />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => updateStatus(detailInquiry.id, "contacted", notes)}
                  disabled={!!loading} className="bg-blue-600 hover:bg-blue-700">
                  Marcar Contatado
                </Button>
                <Button size="sm" onClick={() => updateStatus(detailInquiry.id, "closed", notes)}
                  disabled={!!loading} className="bg-emerald-600 hover:bg-emerald-700">
                  Fechar Contato
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailInquiry(null)}
              className="border-slate-600 text-slate-300">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir contato?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700" disabled={!!loading}>
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
