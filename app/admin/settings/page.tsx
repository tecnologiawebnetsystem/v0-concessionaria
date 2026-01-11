import { sql } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeedDataButton } from "@/components/admin/settings/seed-data-button"

async function getStats() {
  const [vehiclesCount] = await sql`SELECT COUNT(*) as count FROM vehicles`
  const [categoriesCount] = await sql`SELECT COUNT(*) as count FROM vehicle_categories`
  const [brandsCount] = await sql`SELECT COUNT(*) as count FROM brands`
  const [blogPostsCount] = await sql`SELECT COUNT(*) as count FROM blog_posts`

  return {
    vehicles: Number(vehiclesCount.count),
    categories: Number(categoriesCount.count),
    brands: Number(brandsCount.count),
    blogPosts: Number(blogPostsCount.count),
  }
}

export default async function SettingsPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações do site e dados</p>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Sistema</CardTitle>
              <CardDescription>Visão geral dos dados cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.vehicles}</div>
                <div className="text-sm text-muted-foreground">Veículos</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-sm text-muted-foreground">Categorias</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.brands}</div>
                <div className="text-sm text-muted-foreground">Marcas</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.blogPosts}</div>
                <div className="text-sm text-muted-foreground">Posts no Blog</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados de Demonstração</CardTitle>
              <CardDescription>Adicione veículos e conteúdo de exemplo para popular o site</CardDescription>
            </CardHeader>
            <CardContent>
              <SeedDataButton currentVehicles={stats.vehicles} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
