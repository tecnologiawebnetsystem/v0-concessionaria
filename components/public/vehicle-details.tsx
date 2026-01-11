import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gauge, Fuel, Cog, Palette, Eye, Check } from "lucide-react"
import { FinancingCalculator } from "./financing-calculator"

export function VehicleDetails({ vehicle }: { vehicle: any }) {
  const specs = [
    { icon: Calendar, label: "Ano", value: vehicle.year },
    {
      icon: Gauge,
      label: "Quilometragem",
      value: vehicle.mileage ? `${new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km` : "0km",
    },
    { icon: Fuel, label: "Combustível", value: vehicle.fuel_type || "-" },
    { icon: Cog, label: "Transmissão", value: vehicle.transmission || "-" },
    { icon: Palette, label: "Cor", value: vehicle.color || "-" },
    { icon: Eye, label: "Visualizações", value: vehicle.views_count || 0 },
  ]

  const features = vehicle.features ? (Array.isArray(vehicle.features) ? vehicle.features : []) : []
  const specifications = vehicle.specifications || {}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">{vehicle.brand_name}</p>
              <CardTitle className="text-3xl">{vehicle.name}</CardTitle>
              <p className="text-gray-600">{vehicle.category_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">A partir de</p>
              <p className="text-3xl font-bold text-blue-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(vehicle.price))}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {vehicle.is_new && <Badge className="bg-green-600">0km</Badge>}
            {vehicle.is_featured && <Badge className="bg-blue-600">Destaque</Badge>}
            <Badge variant="outline" className="border-green-600 text-green-600">
              {vehicle.status === "available" ? "Disponível" : "Reservado"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <FinancingCalculator vehiclePrice={Number(vehicle.price)} vehicleName={vehicle.name} />

      <Card>
        <CardHeader>
          <CardTitle>Especificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <spec.icon className="size-5 text-blue-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{spec.label}</p>
                  <p className="font-semibold text-gray-900">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {vehicle.engine && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-600">Motor</p>
              <p className="font-semibold text-gray-900">{vehicle.engine}</p>
            </div>
          )}

          {Object.keys(specifications).length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="mb-3 font-semibold text-gray-900">Detalhes Técnicos</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}:</span>
                    <span className="font-medium text-gray-900">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {vehicle.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">{vehicle.description}</p>
          </CardContent>
        </Card>
      )}

      {features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens de Série</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="size-5 flex-shrink-0 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
