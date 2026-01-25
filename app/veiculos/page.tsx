import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { generateVehicleListSchema, generateBreadcrumbSchema } from "@/lib/seo"
import type { Metadata } from "next"
import { VehiclesPageClient } from "@/components/public/vehicles-page-client"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

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

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams
  const { categoria, marca, busca } = params
  
  let title = "Veiculos Seminovos e 0km"
  let description = "Encontre o carro dos seus sonhos na Nacional Veiculos."

  if (categoria) {
    const categoryName = categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, ' ')
    title = `${categoryName} - Veiculos`
    description = `Encontre os melhores ${categoryName} na Nacional Veiculos.`
  }

  if (marca) {
    const brandName = marca.charAt(0).toUpperCase() + marca.slice(1)
    title = `${brandName} - Veiculos`
    description = `Veiculos ${brandName} na Nacional Veiculos.`
  }

  if (busca) {
    title = `Busca: ${busca} - Veiculos`
  }

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  }
}

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const { vehicles, brands, categories } = await getVehiclesData(params)
  
  const vehicleListSchema = generateVehicleListSchema(vehicles)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Veiculos", url: "/veiculos" },
  ])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <PublicHeader />
      
      <VehiclesPageClient 
        vehicles={vehicles} 
        brands={brands} 
        categories={categories} 
        currentFilters={params}
      />
      
      <PublicFooter />
      <WhatsAppFloat />
    </div>
  )
}
