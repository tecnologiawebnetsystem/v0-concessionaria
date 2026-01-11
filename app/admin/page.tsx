import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { Car, FileText, Users, MessageSquare, Eye } from "lucide-react"

async function getStats() {
  const [vehicles, users, blogPosts, inquiries] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM vehicles WHERE published = true`,
    sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`,
    sql`SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'`,
    sql`SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'`,
  ])

  const recentVehicles = await sql`
    SELECT v.*, b.name as brand_name, 
    (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    ORDER BY v.created_at DESC
    LIMIT 5
  `

  const recentInquiries = await sql`
    SELECT i.*, v.name as vehicle_name
    FROM inquiries i
    LEFT JOIN vehicles v ON i.vehicle_id = v.id
    ORDER BY i.created_at DESC
    LIMIT 5
  `

  return {
    vehicles: Number(vehicles[0].count),
    users: Number(users[0].count),
    blogPosts: Number(blogPosts[0].count),
    newInquiries: Number(inquiries[0].count),
    recentVehicles,
    recentInquiries,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema Nacional Veículos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Veículos Publicados</CardTitle>
            <Car className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.vehicles}</div>
            <p className="mt-1 text-xs text-gray-500">Disponíveis no catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
            <Users className="size-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.users}</div>
            <p className="mt-1 text-xs text-gray-500">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Posts no Blog</CardTitle>
            <FileText className="size-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.blogPosts}</div>
            <p className="mt-1 text-xs text-gray-500">Artigos publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Novos Contatos</CardTitle>
            <MessageSquare className="size-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.newInquiries}</div>
            <p className="mt-1 text-xs text-gray-500">Aguardando resposta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Veículos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVehicles.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum veículo cadastrado ainda</p>
              ) : (
                stats.recentVehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{vehicle.name}</p>
                      <p className="text-sm text-gray-500">
                        {vehicle.brand_name} - {vehicle.year}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="size-4" />
                        {vehicle.views_count}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-900">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(vehicle.price))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contatos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentInquiries.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum contato recebido ainda</p>
              ) : (
                stats.recentInquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-500">{inquiry.email}</p>
                      {inquiry.vehicle_name && (
                        <p className="mt-1 text-xs text-blue-600">Interesse: {inquiry.vehicle_name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          inquiry.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : inquiry.status === "contacted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {inquiry.status === "new" ? "Novo" : inquiry.status === "contacted" ? "Contatado" : "Fechado"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
