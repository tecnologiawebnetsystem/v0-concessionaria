import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { VehicleGallery } from "@/components/public/vehicle-gallery"
import { VehicleDetails } from "@/components/public/vehicle-details"
import { ContactForm } from "@/components/public/contact-form"
import { VehicleCTAButtons } from "@/components/public/vehicle-cta-buttons"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { getSession } from "@/lib/session"
import { generateVehicleStructuredData, generateBreadcrumbSchema } from "@/lib/seo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Eye, Calendar, Gauge, Fuel } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

async function getVehicle(slug: string) {
  const [vehicle] = await sql`
    SELECT v.*, b.name as brand_name, b.slug as brand_slug, c.name as category_name, c.slug as category_slug
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_categories c ON v.category_id = c.id
    WHERE v.slug = ${slug} AND v.published = true
  `

  if (!vehicle) return null

  const images = await sql`
    SELECT * FROM vehicle_images 
    WHERE vehicle_id = ${vehicle.id} 
    ORDER BY is_primary DESC, display_order, created_at
  `

  // Increment view count
  await sql`UPDATE vehicles SET views_count = views_count + 1 WHERE id = ${vehicle.id}`

  return { ...vehicle, images }
}

async function getSimilarVehicles(vehicle: any) {
  const similar = await sql`
    SELECT v.*, b.name as brand_name,
    (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as primary_image
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    WHERE v.published = true 
    AND v.id != ${vehicle.id}
    AND (v.category_id = ${vehicle.category_id} OR v.brand_id = ${vehicle.brand_id})
    ORDER BY v.is_featured DESC, v.created_at DESC
    LIMIT 6
  `

  return similar
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    return {
      title: "Veiculo nao encontrado",
      robots: { index: false, follow: false }
    }
  }

  const primaryImage = vehicle.images.find((img: any) => img.is_primary)?.url || vehicle.images[0]?.url
  const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(vehicle.price))
  const mileage = vehicle.mileage ? `${new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km` : "0km"
  
  const title = `${vehicle.brand_name} ${vehicle.name} ${vehicle.year}`
  const description = `${title} por ${price}. ${mileage}. ${vehicle.fuel_type || ""}. ${vehicle.transmission || ""}. Veiculo com garantia e financiamento facilitado na Nacional Veiculos em Taubate.`

  return {
    title,
    description,
    keywords: [
      vehicle.name,
      vehicle.brand_name,
      vehicle.category_name,
      vehicle.year.toString(),
      `${vehicle.brand_name} ${vehicle.name}`,
      `${vehicle.brand_name} ${vehicle.name} ${vehicle.year}`,
      "comprar carro taubate",
      "seminovo",
      vehicle.fuel_type,
      vehicle.transmission
    ].filter(Boolean),
    openGraph: {
      title: `${title} - Nacional Veiculos`,
      description,
      url: `${SITE_URL}/veiculos/${slug}`,
      type: "website",
      siteName: "Nacional Veiculos",
      locale: "pt_BR",
      images: primaryImage ? [{
        url: primaryImage,
        width: 1200,
        height: 630,
        alt: title
      }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${price}`,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/veiculos/${slug}`,
    },
    robots: {
      index: vehicle.status === "available",
      follow: true,
    }
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    notFound()
  }

  const [similarVehicles, session] = await Promise.all([getSimilarVehicles(vehicle), getSession()])
  const isAuthenticated = !!session

  // Generate structured data
  const structuredData = generateVehicleStructuredData(vehicle, vehicle.images)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Veiculos", url: "/veiculos" },
    { name: vehicle.category_name, url: `/veiculos?categoria=${vehicle.category_slug}` },
    { name: `${vehicle.brand_name} ${vehicle.name}`, url: `/veiculos/${slug}` },
  ])

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(vehicle.price))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <PublicHeader />
      
      <main className="flex-1 bg-gray-50 dark:bg-slate-900" id="main-content">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-950 border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="size-4" /></li>
                <li>
                  <Link href="/veiculos" className="hover:text-blue-600 transition-colors">Veiculos</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="size-4" /></li>
                <li>
                  <Link href={`/veiculos?categoria=${vehicle.category_slug}`} className="hover:text-blue-600 transition-colors">
                    {vehicle.category_name}
                  </Link>
                </li>
                <li aria-hidden="true" className="hidden sm:block"><ChevronRight className="size-4" /></li>
                <li className="hidden sm:block">
                  <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] inline-block">
                    {vehicle.brand_name} {vehicle.name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          {/* Mobile Title - Visible only on small screens */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{vehicle.brand_name}</Badge>
              {vehicle.is_featured && <Badge className="bg-amber-500">Destaque</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {vehicle.name} <span className="text-gray-500">{vehicle.year}</span>
            </h1>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {formattedPrice}
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Gauge className="size-4" aria-hidden="true" />
                {vehicle.mileage ? `${new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km` : "0 km"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" aria-hidden="true" />
                {vehicle.year}
              </span>
              <span className="flex items-center gap-1">
                <Fuel className="size-4" aria-hidden="true" />
                {vehicle.fuel_type}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            {/* Gallery and Details */}
            <div className="lg:col-span-2 space-y-6">
              <VehicleGallery images={vehicle.images} vehicleName={vehicle.name} isAuthenticated={isAuthenticated} />
              <VehicleDetails vehicle={vehicle} />
            </div>
            
            {/* Sidebar - Sticky on desktop */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <VehicleCTAButtons
                vehicleName={vehicle.name}
                vehicleSlug={vehicle.slug}
                vehiclePrice={Number(vehicle.price)}
              />
              <ContactForm vehicle={vehicle} />
            </div>
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <section className="mt-12 sm:mt-16" aria-labelledby="similar-vehicles-heading">
              <h2 id="similar-vehicles-heading" className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Veiculos Similares
              </h2>
              <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
                {similarVehicles.map((v: any) => (
                  <Link
                    key={v.id}
                    href={`/veiculos/${v.slug}`}
                    className="group overflow-hidden rounded-xl border bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                      <Image
                        src={v.primary_image || "/placeholder.svg?height=300&width=400"}
                        alt={`${v.brand_name} ${v.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                        {v.brand_name}
                      </p>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                        {v.name}
                      </h3>
                      <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0
                        }).format(Number(v.price))}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <PublicFooter />
      <WhatsAppFloat />
    </div>
  )
}
