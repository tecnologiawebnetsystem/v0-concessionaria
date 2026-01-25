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
  Shield,
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
    super_admin: { label: "Super Admin", className: "bg-purple-100 text-purple-700 border-purple-200" },
    admin: { label: "Admin", className: "bg-blue-100 text-blue-700 border-blue-200" },
    seller: { label: "Vendedor", className: "bg-amber-100 text-amber-700 border-amber-200" },
    user: { label: "Cliente", className: "bg-slate-100 text-slate-700 border-slate-200" },
  }
  const roleInfo = roles[role] || roles.user
  return <Badge variant="outline" className={roleInfo.className}>{roleInfo.label}</Badge>
}

export default async function UsersPage() {
  const { users, stats } = await getUsers()

  const statCards = [
    { title: "Total de Usuarios", value: stats.total, icon: Users, color: "from-blue-500 to-blue-700" },
    { title: "Usuarios Ativos", value: stats.active, icon: UserCheck, color: "from-emerald-500 to-emerald-700" },
    { title: "Administradores", value: stats.admins, icon: ShieldCheck, color: "from-purple-500 to-purple-700" },
    { title: "Vendedores", value: stats.sellers, icon: User, color: "from-amber-500 to-amber-700" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Usuarios</h1>
          <p className="text-slate-500">Gerencie todos os usuarios do sistema</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30">
          <Plus className="mr-2 size-4" />
          Novo Usuario
        </Button>
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

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>{users.length} usuarios cadastrados</CardDescription>
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Buscar usuario..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
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
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border-2 border-slate-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
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
                        <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? "bg-emerald-100 text-emerald-700" : ""}>
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
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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
