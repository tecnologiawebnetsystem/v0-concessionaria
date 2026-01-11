import { VehicleForm } from "@/components/admin/vehicles/vehicle-form"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getVehicle(id: string) {
  const [vehicle] = await sql`SELECT * FROM vehicles WHERE id = ${id}`
  if (!vehicle) return null

  const images = await sql`
    SELECT * FROM vehicle_images 
    WHERE vehicle_id = ${id} 
    ORDER BY display_order, created_at
  `

  return { ...vehicle, images }
}

async function getFormData() {
  const [brands, categories] = await Promise.all([
    sql`SELECT * FROM brands WHERE is_active = true ORDER BY display_order, name`,
    sql`SELECT * FROM vehicle_categories WHERE is_active = true ORDER BY display_order, name`,
  ])

  return { brands, categories }
}

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await getVehicle(id)

  if (!vehicle) {
    notFound()
  }

  const { brands, categories } = await getFormData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/vehicles">
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Veículo</h1>
          <p className="text-gray-600">{vehicle.name}</p>
        </div>
      </div>

      <VehicleForm vehicle={vehicle} brands={brands} categories={categories} />
    </div>
  )
}
