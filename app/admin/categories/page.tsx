import { Suspense } from "react"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CategoriesTable } from "@/components/admin/categories/categories-table"

async function getCategoriesData() {
  const categories = await sql`
    SELECT 
      id,
      name,
      slug,
      description,
      icon,
      display_order,
      is_active,
      created_at,
      (SELECT COUNT(*) FROM vehicles WHERE category_id = vehicle_categories.id) as vehicle_count
    FROM vehicle_categories
    ORDER BY display_order ASC, name ASC
  `

  return { categories }
}

export default async function CategoriesPage() {
  const { categories } = await getCategoriesData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias de Veículos</h1>
          <p className="text-muted-foreground mt-2">Gerencie as categorias de veículos do site</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <CategoriesTable categories={categories} />
      </Suspense>
    </div>
  )
}
