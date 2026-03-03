"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Users, Search, Plus, Mail, Phone, Calendar, ShieldCheck, User,
  MoreHorizontal, UserCheck, UserX, Edit, Trash2, Loader2,
} from "lucide-react"

type User = {
  id: string; name: string; email: string; phone?: string
  role: string; is_active: boolean; created_at: string
}

type Stats = {
  total: string | number; active: string | number
  admins: string | number; sellers: string | number; customers: string | number
}

type Props = { initialUsers: User[]; stats: Stats }

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

function getRoleBadge(role: string) {
  const roles: Record<string, { label: string; className: string }> = {
    super_admin: { label: "Super Admin", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    admin: { label: "Admin", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    seller: { label: "Vendedor", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    user: { label: "Cliente", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  }
  const r = roles[role] || roles.user
  return <Badge variant="outline" className={r.className}>{r.label}</Badge>
}

export function UsersClient({ initialUsers, stats }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "user", password: "" })

  const filtered = initialUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(user: User) {
    setEditUser(user)
    setForm({ name: user.name, email: user.email, phone: user.phone || "", role: user.role, password: "" })
  }

  function openNew() {
    setForm({ name: "", email: "", phone: "", role: "user", password: "" })
    setNewUser(true)
  }

  async function handleToggle(user: User) {
    setLoading(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      })
      if (!res.ok) throw new Error()
      toast.success(user.is_active ? "Usuário desativado" : "Usuário ativado")
      router.refresh()
    } catch {
      toast.error("Erro ao alterar status")
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Usuário excluído")
      setDeleteId(null)
      router.refresh()
    } catch {
      toast.error("Erro ao excluir usuário")
    } finally {
      setLoading(null)
    }
  }

  async function handleSave() {
    setLoading("save")
    try {
      const isEdit = !!editUser
      const res = await fetch(isEdit ? `/api/admin/users/${editUser!.id}` : "/api/admin/users", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(isEdit ? "Usuário atualizado!" : "Usuário criado!")
      setEditUser(null)
      setNewUser(false)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar")
    } finally {
      setLoading(null)
    }
  }

  const statCards = [
    { title: "Total", value: stats.total, icon: Users, color: "from-blue-500 to-blue-700" },
    { title: "Ativos", value: stats.active, icon: UserCheck, color: "from-emerald-500 to-emerald-700" },
    { title: "Admins", value: stats.admins, icon: ShieldCheck, color: "from-purple-500 to-purple-700" },
    { title: "Vendedores", value: stats.sellers, icon: User, color: "from-amber-500 to-amber-700" },
  ]

  const isDialogOpen = !!editUser || newUser

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Usuarios</h1>
          <p className="text-slate-400">Gerencie todos os usuarios do sistema</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 size-4" />
          Novo Usuario
        </Button>
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
            <CardTitle className="text-white">Lista de Usuarios</CardTitle>
            <CardDescription className="text-slate-400">{filtered.length} usuarios</CardDescription>
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Usuario</TableHead>
                  <TableHead className="text-slate-400">Contato</TableHead>
                  <TableHead className="text-slate-400">Tipo</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Cadastro</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => {
                  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                  return (
                    <TableRow key={user.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 ring-2 ring-slate-700">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-slate-400">
                            <Mail className="size-3" />{user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Phone className="size-3" />{user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge className={user.is_active
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/20 text-slate-400 border-slate-500/30"}>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="size-3" />{formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700"
                              disabled={loading === user.id}>
                              {loading === user.id
                                ? <Loader2 className="size-4 animate-spin" />
                                : <MoreHorizontal className="size-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem onClick={() => openEdit(user)}
                              className="text-slate-300 hover:text-white focus:bg-slate-700 cursor-pointer">
                              <Edit className="mr-2 size-4" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggle(user)}
                              className="text-slate-300 hover:text-white focus:bg-slate-700 cursor-pointer">
                              {user.is_active
                                ? <><UserX className="mr-2 size-4" />Desativar</>
                                : <><UserCheck className="mr-2 size-4" />Ativar</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem onClick={() => setDeleteId(user.id)}
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

      {/* Dialog criar/editar */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) { setEditUser(null); setNewUser(false) } }}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">{editUser ? "Editar Usuario" : "Novo Usuario"}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editUser ? "Atualize os dados do usuario." : "Preencha os dados para criar um novo usuario."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(["name", "email", "phone"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="text-slate-300 capitalize">{field === "name" ? "Nome" : field === "email" ? "Email" : "Telefone"}</Label>
                <Input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  type={field === "email" ? "email" : "text"}
                  className="bg-slate-900/50 border-slate-600 text-white" />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-slate-300">Tipo</Label>
              <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="user" className="text-slate-300">Cliente</SelectItem>
                  <SelectItem value="seller" className="text-slate-300">Vendedor</SelectItem>
                  <SelectItem value="admin" className="text-slate-300">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-300">{editUser ? "Nova Senha (opcional)" : "Senha *"}</Label>
              <Input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                type="password" placeholder={editUser ? "Deixe em branco para não alterar" : "Mínimo 6 caracteres"}
                className="bg-slate-900/50 border-slate-600 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditUser(null); setNewUser(false) }}
              className="border-slate-600 text-slate-300">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading === "save"} className="bg-blue-600 hover:bg-blue-700">
              {loading === "save" ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {editUser ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir usuario?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acao nao pode ser desfeita. O usuario sera permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={!!loading}>
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
