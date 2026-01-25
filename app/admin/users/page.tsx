import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { sql } from "@/lib/db"
import { 
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  User,
  MoreHorizontal,
  UserCheck,
  UserX,
  Edit,
  Trash2,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

async function getUsers() {
  const users = await sql`
    SELECT id, name, email, phone, role, is_active, created_at
    FROM users
    ORDER BY created_at DESC
  `
  
  const stats = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active,
      COUNT(*) FILTER (WHERE role = 'admin' OR role = 'super_admin') as admins,
      COUNT(*) FILTER (WHERE role = 'seller') as sellers,
      COUNT(*) FILTER (WHERE role = 'user') as customers
    FROM users
  `

  return { users, stats: stats[0] }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

function getRoleBadge(role: string) {
  const roles: Record<string, { label: string; className: string }> = {
    super_admin: { label: "Super Admin", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    admin: { label: "Admin", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    seller: { label: "Vendedor", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    user: { label: "Cliente", className: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  }
  const roleInfo = roles[role] || roles.user
  return <Badge variant="outline" className={roleInfo.className}>{roleInfo.label}</Badge>
}

export default async function UsersPage() {
  const { users, stats } = await getUsers()

  const statCards = [
    { title: "Total de Usuarios", value: stats.total, icon: Users, color: "from-blue-500 to-blue-700", shadow: "shadow-blue-500/25" },
    { title: "Usuarios Ativos", value: stats.active, icon: UserCheck, color: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-500/25" },
    { title: "Administradores", value: stats.admins, icon: ShieldCheck, color: "from-purple-500 to-purple-700", shadow: "shadow-purple-500/25" },
    { title: "Vendedores", value: stats.sellers, icon: User, color: "from-amber-500 to-amber-700", shadow: "shadow-amber-500/25" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Usuarios</h1>
          <p className="text-slate-400">Gerencie todos os usuarios do sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
          <Plus className="mr-2 size-4" />
          Novo Usuario
        </Button>
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

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700">
          <div>
            <CardTitle className="text-white">Lista de Usuarios</CardTitle>
            <CardDescription className="text-slate-400">{users.length} usuarios cadastrados</CardDescription>
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input placeholder="Buscar usuario..." className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500" />
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
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => {
                  const initials = user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

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
                            <Mail className="size-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Phone className="size-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <Badge className={user.is_active 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                          : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        }>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="size-3" />
                          {formatDate(user.created_at)}
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
                              <Edit className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:text-white focus:bg-slate-700">
                              {user.is_active ? (
                                <>
                                  <UserX className="mr-2 size-4" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 size-4" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem className="text-red-400 focus:bg-slate-700 focus:text-red-400">
                              <Trash2 className="mr-2 size-4" />
                              Excluir
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
    </div>
  )
}
