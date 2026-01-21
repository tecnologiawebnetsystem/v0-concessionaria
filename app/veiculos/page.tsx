import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { AdvancedFilters } from "@/components/public/advanced-filters"
import { VehicleCatalog } from "@/components/public/vehicle-catalog"
import { SortSelect } from "@/components/public/sort-select"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { RecentlyViewedSection } from "@/components/public/recently-viewed-section"
import { generateVehicleListSchema, generateBreadcrumbSchema } from "@/lib/seo"
import type { Metadata } from "next"

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
  let description = "Encontre o carro dos seus sonhos na Nacional Veiculos. Os melhores veiculos seminovos e 0km com garantia e financiamento facilitado em Taubate."
  let keywords: string[] = ["carros seminovos", "carros 0km", "comprar carro taubate", "nacional veiculos"]

  if (categoria) {
    const categoryName = categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, ' ')
    title = `${categoryName} - Veiculos`
    description = `Encontre os melhores ${categoryName} na Nacional Veiculos em Taubate. Carros com garantia e financiamento facilitado.`
    keywords.push(categoryName.toLowerCase(), `${categoryName.toLowerCase()} taubate`)
  }

  if (marca) {
    const brandName = marca.charAt(0).toUpperCase() + marca.slice(1)
    title = marca ? `${brandName} - Veiculos` : title
    description = `Veiculos ${brandName} na Nacional Veiculos. Encontre seu ${brandName} seminovo ou 0km com as melhores condicoes.`
    keywords.push(brandName.toLowerCase(), `${brandName.toLowerCase()} seminovo`)
  }

  if (busca) {
    title = `Busca: ${busca} - Veiculos`
    description = `Resultados da busca por "${busca}" na Nacional Veiculos.`
  }

  // Build canonical URL with filters
  let canonicalUrl = `${SITE_URL}/veiculos`
  const filterParams = new URLSearchParams()
  if (categoria) filterParams.set('categoria', categoria)
  if (marca) filterParams.set('marca', marca)
  if (filterParams.toString()) canonicalUrl += `?${filterParams.toString()}`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Nacional Veiculos`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [`${SITE_URL}/og-veiculos.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Nacional Veiculos`,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !busca, // Don't index search results
      follow: true,
    }
  }
}

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const { vehicles, brands, categories } = await getVehiclesData(params)
  
  // Generate structured data
  const vehicleListSchema = generateVehicleListSchema(vehicles)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Veiculos", url: "/veiculos" },
    ...(params.categoria ? [{ name: params.categoria, url: `/veiculos?categoria=${params.categoria}` }] : []),
    ...(params.marca ? [{ name: params.marca, url: `/veiculos?marca=${params.marca}` }] : []),
  ])

  const totalVehicles = vehicles.length

  return (
    <div className="flex min-h-screen flex-col">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <PublicHeader />
      
      <main className="flex-1 bg-gray-50 dark:bg-slate-900" id="main-content">
        {/* Hero Section - Mobile optimized */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-blue-200">
                <li>
                  <a href="/" className="hover:text-white transition-colors">Inicio</a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span className="text-white font-medium">Veiculos</span>
                </li>
                {params.categoria && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <span className="text-white font-medium capitalize">{params.categoria}</span>
                    </li>
                  </>
                )}
              </ol>
            </nav>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-balance">
              {params.categoria 
                ? `${params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1).replace(/-/g, ' ')}`
                : params.marca
                  ? `Veiculos ${params.marca.charAt(0).toUpperCase() + params.marca.slice(1)}`
                  : "Nossos Veiculos"
              }
            </h1>
            <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-2xl">
              {totalVehicles > 0 
                ? `${totalVehicles} veiculo${totalVehicles !== 1 ? 's' : ''} encontrado${totalVehicles !== 1 ? 's' : ''} com as melhores condicoes de financiamento`
                : "Encontre o veiculo perfeito para voce"
              }
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
            {/* Filters - Collapsible on mobile */}
            <aside className="lg:w-80 flex-shrink-0">
              <AdvancedFilters brands={brands} categories={categories} currentFilters={params} />
            </aside>
            
            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Sort and results count */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{totalVehicles}</span> veiculo{totalVehicles !== 1 ? 's' : ''} encontrado{totalVehicles !== 1 ? 's' : ''}
                </p>
                <SortSelect />
              </div>
              
              {/* Vehicle Grid */}
              <VehicleCatalog vehicles={vehicles} />
              
              {/* SEO Content */}
              {!params.busca && (
                <section className="mt-12 prose prose-sm dark:prose-invert max-w-none">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Carros Seminovos e 0km em Taubate
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    A Nacional Veiculos e sua concessionaria de confianca em Taubate e regiao do Vale do Paraiba. 
                    Com mais de 15 anos de experiencia, oferecemos uma ampla variedade de veiculos seminovos e 0km 
                    com procedencia garantida, laudo cautelar e as melhores condicoes de financiamento do mercado.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Todos os nossos veiculos passam por rigorosa inspecao de qualidade antes de serem disponibilizados 
                    para venda. Oferecemos garantia, test drive e atendimento personalizado para ajuda-lo a encontrar 
                    o carro ideal para suas necessidades.
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
        
        {/* Recently Viewed */}
        <RecentlyViewedSection />
      </main>
      
      <PublicFooter />
      <WhatsAppFloat />
    </div>
  )
}
