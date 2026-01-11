import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { VehicleGallery } from "@/components/public/vehicle-gallery"
import { VehicleDetails } from "@/components/public/vehicle-details"
import { ContactForm } from "@/components/public/contact-form"
import { VehicleCTAButtons } from "@/components/public/vehicle-cta-buttons"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { getSession } from "@/lib/session"
import { generateVehicleStructuredData } from "@/lib/seo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

async function getVehicle(slug: string) {
  const [vehicle] = await sql`
    SELECT v.*, b.name as brand_name, c.name as category_name
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
    LIMIT 3
  `

  return similar
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) {
    return {
      title: "Veículo não encontrado",
    }
  }

  const primaryImage = vehicle.images.find((img: any) => img.is_primary)

  return {
    title: `${vehicle.name} ${vehicle.year} - Nacional Veículos`,
    description:
      vehicle.description ||
      `${vehicle.name} ${vehicle.year} - ${vehicle.brand_name}. ${vehicle.mileage ? `${new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km` : "0km"}. ${vehicle.fuel_type || ""}. ${vehicle.transmission || ""}.`,
    keywords: [
      vehicle.name,
      vehicle.brand_name,
      vehicle.category_name,
      vehicle.year.toString(),
      "comprar",
      "seminovo",
      "0km",
    ],
    openGraph: {
      title: `${vehicle.name} ${vehicle.year}`,
      description: vehicle.description || `${vehicle.name} - ${vehicle.brand_name}`,
      images: primaryImage ? [primaryImage.url] : [],
      type: "website",
    },
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

  const structuredData = generateVehicleStructuredData(vehicle, vehicle.images)

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PublicHeader />
      <WhatsAppFloat />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VehicleGallery images={vehicle.images} vehicleName={vehicle.name} isAuthenticated={isAuthenticated} />
              <VehicleDetails vehicle={vehicle} />
            </div>
            <div className="space-y-6">
              <VehicleCTAButtons
                vehicleName={vehicle.name}
                vehicleSlug={vehicle.slug}
                vehiclePrice={Number(vehicle.price)}
              />
              <ContactForm vehicle={vehicle} />
            </div>
          </div>

          {similarVehicles.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Veículos Similares</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarVehicles.map((v: any) => (
                  <a
                    key={v.id}
                    href={`/veiculos/${v.slug}`}
                    className="group overflow-hidden rounded-lg border bg-white shadow transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={v.primary_image || "/placeholder.svg?height=300&width=400&query=car"}
                        alt={v.name}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-blue-900">{v.brand_name}</p>
                      <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                      <p className="mt-2 text-xl font-bold text-blue-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(v.price))}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
