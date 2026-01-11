import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Fuel, Gauge, Calendar, Cog } from "lucide-react"

export function VehicleCatalog({ vehicles }: { vehicles: any[] }) {
  const safeVehicles = Array.isArray(vehicles) ? vehicles : []

  if (safeVehicles.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed bg-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Nenhum veículo encontrado</p>
          <p className="mt-2 text-gray-600">Tente ajustar os filtros para ver mais resultados</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {safeVehicles.length} {safeVehicles.length === 1 ? "veículo encontrado" : "veículos encontrados"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {safeVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="group overflow-hidden transition-shadow hover:shadow-xl">
            <Link href={`/veiculos/${vehicle.slug}`}>
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={vehicle.primary_image || "/placeholder.svg?height=400&width=600&query=car"}
                  alt={vehicle.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {vehicle.is_new && <Badge className="absolute left-4 top-4 bg-green-600">0km</Badge>}
                {vehicle.is_featured && <Badge className="absolute right-4 top-4 bg-blue-600">Destaque</Badge>}
              </div>
              <CardContent className="p-6">
                <div className="mb-3">
                  <p className="text-sm font-medium text-blue-900">{vehicle.brand_name}</p>
                  <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">{vehicle.category_name}</p>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {vehicle.year}
                  </div>
                  {vehicle.mileage > 0 && (
                    <div className="flex items-center gap-1">
                      <Gauge className="size-4" />
                      {new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km
                    </div>
                  )}
                  {vehicle.fuel_type && (
                    <div className="flex items-center gap-1">
                      <Fuel className="size-4" />
                      {vehicle.fuel_type}
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex items-center gap-1">
                      <Cog className="size-4" />
                      {vehicle.transmission}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">A partir de</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(vehicle.price))}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ou 48x de{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(vehicle.price) / 48)}
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
