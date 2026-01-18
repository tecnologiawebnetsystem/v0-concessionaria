import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { AdvancedFilters } from "@/components/public/advanced-filters"
import { VehicleCatalog } from "@/components/public/vehicle-catalog"
import { SortSelect } from "@/components/public/sort-select"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { RecentlyViewedSection } from "@/components/public/recently-viewed-section"
import { VehicleFilters } from "@/components/public/vehicle-filters" // Import VehicleFilters

async function getVehiclesData(searchParams: any) {
  const { categoria, marca, ano_min, ano_max, preco_min, preco_max, busca, ordenar, combustivel, cambio } = searchParams

  let query = `
    SELECT v.*, b.name as brand_name, c.name as category_name,
    (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as primary_image
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_categories c ON v.category_id = c.id
    WHERE v.published = true AND v.status = 'available'
  `

  const params: any[] = []
  let paramIndex = 1

  if (categoria) {
    query += ` AND c.slug = $${paramIndex}`
    params.push(categoria)
    paramIndex++
  }

  if (marca) {
    query += ` AND b.slug = $${paramIndex}`
    params.push(marca)
    paramIndex++
  }

  if (ano_min) {
    query += ` AND v.year >= $${paramIndex}`
    params.push(Number.parseInt(ano_min))
    paramIndex++
  }

  if (ano_max) {
    query += ` AND v.year <= $${paramIndex}`
    params.push(Number.parseInt(ano_max))
    paramIndex++
  }

  if (preco_min) {
    query += ` AND v.price >= $${paramIndex}`
    params.push(Number.parseFloat(preco_min))
    paramIndex++
  }

  if (preco_max) {
    query += ` AND v.price <= $${paramIndex}`
    params.push(Number.parseFloat(preco_max))
    paramIndex++
  }

  if (combustivel && combustivel !== "all") {
    query += ` AND v.fuel_type = $${paramIndex}`
    params.push(combustivel)
    paramIndex++
  }

  if (cambio && cambio !== "all") {
    query += ` AND v.transmission ILIKE $${paramIndex}`
    params.push(`%${cambio}%`)
    paramIndex++
  }

  if (busca) {
    query += ` AND (v.name ILIKE $${paramIndex} OR v.model ILIKE $${paramIndex} OR b.name ILIKE $${paramIndex})`
    params.push(`%${busca}%`)
    paramIndex++
  }

  const sortOptions: Record<string, string> = {
    "menor-preco": "v.price ASC",
    "maior-preco": "v.price DESC",
    "mais-novo": "v.year DESC",
    "mais-antigo": "v.year ASC",
    "menor-km": "v.mileage ASC",
    "maior-km": "v.mileage DESC",
  }

  const orderBy = sortOptions[ordenar as string] || "v.is_featured DESC, v.created_at DESC"
  query += ` ORDER BY ${orderBy}`

  const vehiclesResult = await sql.unsafe(query, params)
  const vehicles = Array.isArray(vehiclesResult) ? vehiclesResult : []

  const [brands, categories] = await Promise.all([
    sql`SELECT * FROM brands WHERE is_active = true ORDER BY name`,
    sql`SELECT * FROM vehicle_categories WHERE is_active = true ORDER BY name`,
  ])

  return { vehicles, brands, categories }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const categoria = params.categoria

  if (categoria) {
    return {
      title: `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} - Nacional Veículos`,
      description: `Encontre os melhores ${categoria} na Nacional Veículos`,
    }
  }

  return {
    title: "Veículos - Nacional Veículos",
    description: "Encontre o carro dos seus sonhos na Nacional Veículos. Os melhores veículos seminovos e 0km.",
  }
}

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const { vehicles, brands, categories } = await getVehiclesData(params)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <WhatsAppFloat />
      <main className="flex-1 bg-gray-50">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Nossos Veículos</h1>
            <p className="mt-2 text-blue-100">Encontre o veículo perfeito para você</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-80">
              <AdvancedFilters brands={brands} categories={categories} currentFilters={params} />
            </aside>
            <div className="flex-1">
              <div className="mb-6">
                <SortSelect />
              </div>
              <VehicleCatalog vehicles={vehicles} />
            </div>
          </div>
        </div>
        
        {/* Recently Viewed Section */}
        <RecentlyViewedSection />
      </main>
      <PublicFooter />
    </div>
  )
}
