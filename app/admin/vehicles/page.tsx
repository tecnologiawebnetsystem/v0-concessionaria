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
          <h1 className="text-3xl font-bold text-white">Veiculos</h1>
          <p className="text-slate-400">Gerencie todos os veiculos da concessionaria</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/vehicles/new">
            <Plus className="mr-2 size-4" />
            Adicionar Veiculo
          </Link>
        </Button>
      </div>

      <VehiclesTable vehicles={vehicles} />
    </div>
  )
}
