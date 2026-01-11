import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Fuel, Calendar, Cog, Eye } from "lucide-react"

export function FeaturedVehicles({ vehicles }: { vehicles: any[] }) {
  if (vehicles.length === 0) return null

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-900"
          >
            Destaques
          </Badge>
          <h2 className="text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">Veículos em Destaque</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
            Seleção especial de veículos com as melhores condições
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
              <Card className="group h-full overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={vehicle.primary_image || "/placeholder.svg?height=400&width=600&query=luxury car"}
                    alt={vehicle.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {vehicle.is_new && (
                      <Badge className="bg-gradient-to-r from-green-600 to-green-500 font-semibold shadow-lg">
                        0 KM
                      </Badge>
                    )}
                    {vehicle.status === "reserved" && (
                      <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 font-semibold shadow-lg">
                        Reservado
                      </Badge>
                    )}
                    {vehicle.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 font-semibold text-gray-900 shadow-lg">
                        ★ Destaque
                      </Badge>
                    )}
                  </div>

                  {vehicle.views_count > 0 && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 backdrop-blur-sm">
                      <Eye className="size-3 text-white" />
                      <span className="text-xs font-medium text-white">{vehicle.views_count}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm font-bold uppercase tracking-wide text-blue-900">{vehicle.brand_name}</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900 group-hover:text-blue-900">{vehicle.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{vehicle.model}</p>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-3 border-y border-gray-100 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <Calendar className="size-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-900">{vehicle.year}</span>
                      <span className="text-xs text-gray-500">Ano</span>
                    </div>
                    {vehicle.fuel_type && (
                      <div className="flex flex-col items-center gap-1">
                        <Fuel className="size-4 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-900">{vehicle.fuel_type}</span>
                        <span className="text-xs text-gray-500">Combustível</span>
                      </div>
                    )}
                    {vehicle.transmission && (
                      <div className="flex flex-col items-center gap-1">
                        <Cog className="size-4 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-900">{vehicle.transmission}</span>
                        <span className="text-xs text-gray-500">Câmbio</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Preço</p>
                      <p className="mt-1 text-3xl font-extrabold text-blue-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 0,
                        }).format(Number(vehicle.price))}
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-900 text-white transition-transform group-hover:scale-110">
                      <ArrowRight className="size-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild className="h-14 bg-blue-900 px-8 text-base font-semibold hover:bg-blue-800">
            <Link href="/veiculos">
              Ver Todos os Veículos
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
