import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { VehiclesTable } from "@/components/admin/vehicles/vehicles-table"

async function getVehicles() {
  const vehicles = await sql`
    SELECT v.*, b.name as brand_name, c.name as category_name,
    (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_categories c ON v.category_id = c.id
    ORDER BY v.created_at DESC
  `
  return vehicles
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
          <p className="text-gray-600">Gerencie todos os veículos da concessionária</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/new">
            <Plus className="mr-2 size-4" />
            Adicionar Veículo
          </Link>
        </Button>
      </div>

      <VehiclesTable vehicles={vehicles} />
    </div>
  )
}
