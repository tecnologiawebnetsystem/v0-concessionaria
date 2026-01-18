import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, FolderOpen } from "lucide-react"
import Link from "next/link"

async function getBlogCategories() {
  const categories = await sql`
    SELECT 
      bc.*,
      COUNT(bpc.post_id) as post_count
    FROM blog_categories bc
    LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
    GROUP BY bc.id
    ORDER BY bc.display_order ASC, bc.name ASC
  `
  return categories
}

export default async function BlogCategoriesPage() {
  const categories = await getBlogCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorias do Blog</h1>
            <p className="text-gray-600">Gerencie as categorias dos artigos</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <Card className="col-span-full p-12">
            <div className="text-center">
              <FolderOpen className="size-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma Categoria</h3>
              <p className="text-gray-500 mb-4">Crie categorias para organizar seus posts</p>
              <Button>
                <Plus className="mr-2 size-4" />
                Criar Primeira Categoria
              </Button>
            </div>
          </Card>
        ) : (
          categories.map((category: any) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description || "Sem descrição"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.post_count} {category.post_count === 1 ? "post" : "posts"}
                  </span>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
