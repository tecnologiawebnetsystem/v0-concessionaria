import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { generateVehicleListSchema, generateBreadcrumbSchema } from "@/lib/seo"
import type { Metadata } from "next"
import { VehiclesPageClient } from "@/components/public/vehicles-page-client"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gtveiculos.com.br"

async function getVehiclesData(searchParams: any) {
  const { categoria, marca, combustivel, cambio, busca } = searchParams

  const [vehiclesResult, brands, categories] = await Promise.all([
    sql`
      SELECT v.*, b.name as brand_name, c.name as category_name,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as primary_image
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories c ON v.category_id = c.id
      WHERE v.published = true
        AND v.status = 'available'
        AND (${categoria || null} IS NULL OR c.slug = ${categoria || null})
        AND (${marca || null} IS NULL OR b.slug = ${marca || null})
        AND (${combustivel || null} IS NULL OR v.fuel_type ILIKE ${combustivel ? `%${combustivel}%` : null})
        AND (${cambio || null} IS NULL OR v.transmission ILIKE ${cambio ? `%${cambio}%` : null})
        AND (${busca || null} IS NULL OR v.name ILIKE ${busca ? `%${busca}%` : null} OR v.model ILIKE ${busca ? `%${busca}%` : null} OR b.name ILIKE ${busca ? `%${busca}%` : null})
      ORDER BY v.is_featured DESC, v.created_at DESC
      LIMIT 200
    `,
    sql`SELECT * FROM brands WHERE is_active = true ORDER BY name`,
    sql`SELECT * FROM vehicle_categories WHERE is_active = true ORDER BY name`,
  ])

  const vehicles = Array.isArray(vehiclesResult) ? vehiclesResult : []
  return { vehicles, brands, categories }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams
  const { categoria, marca, busca } = params
  
  let title = "Veiculos Seminovos e 0km"
  let description = "Encontre o carro dos seus sonhos na GT Veículos."

  if (categoria) {
    const categoryName = categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, ' ')
    title = `${categoryName} - Veiculos`
    description = `Encontre os melhores ${categoryName} na GT Veículos.`
  }

  if (marca) {
    const brandName = marca.charAt(0).toUpperCase() + marca.slice(1)
    title = `${brandName} - Veiculos`
    description = `Veiculos ${brandName} na GT Veículos.`
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
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
