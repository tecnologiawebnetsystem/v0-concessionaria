import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Car,
  Search,
  Eye,
  Calendar,
  Fuel,
  Gauge,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

async function getAvailableVehicles(searchParams: any) {
  const query = searchParams.get("query") || ""
  const vehicles = await sql`
    SELECT v.*, b.name as brand_name, c.name as category_name,
    (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as image_url,
    (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_categories c ON v.category_id = c.id
    WHERE v.published = true AND v.status = 'available' AND (v.name ILIKE ${`%${query}%`} OR b.name ILIKE ${`%${query}%`} OR c.name ILIKE ${`%${query}%`})
    ORDER BY v.is_featured DESC, v.created_at DESC
  `

  const [stats] = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN is_featured THEN 1 END) as featured,
      COUNT(CASE WHEN is_new THEN 1 END) as new_vehicles
    FROM vehicles
    WHERE published = true AND status = 'available'
  `

  return { vehicles, stats }
}

const Loading = () => null;

export default async function SellerVehiclesPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const searchParams = useSearchParams();
  const { vehicles, stats } = await getAvailableVehicles(searchParams)

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatNumber = (value: number) => 
    new Intl.NumberFormat("pt-BR").format(value)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Veículos Disponíveis</h1>
        <p className="text-gray-600">Catálogo de veículos disponíveis para venda</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Disponível</CardTitle>
            <Car className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">veículos no estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Em Destaque</CardTitle>
            <Eye className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.featured}</div>
            <p className="text-xs text-gray-500">veículos destacados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Novos</CardTitle>
            <Car className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.new_vehicles}</div>
            <p className="text-xs text-gray-500">0km</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Buscar por nome, marca ou modelo..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de Veículos */}
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="size-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum veículo disponível no momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle: any) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagem */}
              <div className="relative aspect-[16/10] bg-gray-100">
                {vehicle.image_url ? (
                  <img 
                    src={vehicle.image_url || "/placeholder.svg"} 
                    alt={vehicle.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="size-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  {vehicle.is_featured && (
                    <Badge className="bg-amber-500">Destaque</Badge>
                  )}
                  {vehicle.is_new && (
                    <Badge className="bg-emerald-500">0km</Badge>
                  )}
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {vehicle.image_count} fotos
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Nome e Marca */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">{vehicle.brand_name}</p>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">{vehicle.model}</p>
                </div>

                {/* Especificações */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="size-4" />
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gauge className="size-4" />
                    <span>{formatNumber(vehicle.mileage || 0)} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel className="size-4" />
                    <span>{vehicle.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="size-4" />
                    <span>{vehicle.transmission || 'N/A'}</span>
                  </div>
                </div>

                {/* Preço */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Preço</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {formatCurrency(Number(vehicle.price))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/veiculos/${vehicle.slug}`} target="_blank">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <DollarSign className="size-4 mr-1" />
                      Vender
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export { Loading };
