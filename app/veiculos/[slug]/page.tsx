import { sql } from "@/lib/db"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { UnifiedChat } from "@/components/public/unified-chat"
import { getSession } from "@/lib/session"
import { generateVehicleStructuredData, generateBreadcrumbSchema } from "@/lib/seo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronRight, ChevronLeft, Eye, Calendar, Gauge, Fuel, Cog, Palette, 
  Check, Heart, Share2, Phone, MessageCircle, Shield, Award, 
  Calculator, FileText, MapPin, Clock, Star, ArrowRight, Zap,
  Car, Settings, Thermometer, Music, Camera, Navigation
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VehicleGalleryClient } from "@/components/public/vehicle-gallery-client"
import { FinancingCalculatorClient } from "@/components/public/financing-calculator-client"

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
    return { title: "Veiculo nao encontrado", robots: { index: false, follow: false } }
  }

  const primaryImage = vehicle.images.find((img: any) => img.is_primary)?.url || vehicle.images[0]?.url
  const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(vehicle.price))
  
  return {
    title: `${vehicle.brand_name} ${vehicle.name} ${vehicle.year_model} - ${price}`,
    description: `Compre ${vehicle.brand_name} ${vehicle.name} ${vehicle.year_model} por ${price}. ${vehicle.mileage?.toLocaleString()} km. ${vehicle.fuel_type}. Garantia e financiamento facilitado.`,
    openGraph: {
      title: `${vehicle.brand_name} ${vehicle.name} - GT Veículos`,
      images: primaryImage ? [{ url: primaryImage, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle) notFound()

  const [similarVehicles, session] = await Promise.all([getSimilarVehicles(vehicle), getSession()])
  const isAuthenticated = !!session

  const structuredData = generateVehicleStructuredData(vehicle, vehicle.images)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Veiculos", url: "/veiculos" },
    { name: `${vehicle.brand_name} ${vehicle.name}`, url: `/veiculos/${slug}` },
  ])

  const formatPrice = (price: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(price)
  const formatNumber = (num: number) => new Intl.NumberFormat("pt-BR").format(num)

  const specs = [
    { icon: Calendar, label: "Ano", value: `${vehicle.year_manufacture}/${vehicle.year_model}` },
    { icon: Gauge, label: "KM", value: vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "0km" },
    { icon: Fuel, label: "Combustivel", value: vehicle.fuel_type || "-" },
    { icon: Cog, label: "Cambio", value: vehicle.transmission || "-" },
    { icon: Palette, label: "Cor", value: vehicle.color || "-" },
    { icon: Car, label: "Portas", value: vehicle.doors || "4" },
  ]

  const features = vehicle.features ? (Array.isArray(vehicle.features) ? vehicle.features : []) : []

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <PublicHeader />
      <UnifiedChat />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/veiculos" className="hover:text-white transition-colors">Veiculos</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{vehicle.brand_name} {vehicle.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <VehicleGalleryClient 
                images={vehicle.images} 
                vehicleName={vehicle.name} 
                isAuthenticated={isAuthenticated} 
              />

              {/* Quick Specs Bar */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {specs.map((spec, idx) => (
                  <div key={idx} className="bg-slate-900 rounded-xl p-4 text-center border border-slate-800">
                    <spec.icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 mb-1">{spec.label}</p>
                    <p className="text-sm font-semibold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="w-full bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  <TabsTrigger value="specs" className="flex-1 data-[state=active]:bg-blue-600 rounded-lg">
                    Especificacoes
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex-1 data-[state=active]:bg-blue-600 rounded-lg">
                    Equipamentos
                  </TabsTrigger>
                  <TabsTrigger value="financing" className="flex-1 data-[state=active]:bg-blue-600 rounded-lg">
                    Financiamento
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Ficha Tecnica</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { label: "Marca", value: vehicle.brand_name },
                          { label: "Modelo", value: vehicle.name },
                          { label: "Ano Fabricacao", value: vehicle.year_manufacture },
                          { label: "Ano Modelo", value: vehicle.year_model },
                          { label: "Quilometragem", value: vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "0 km" },
                          { label: "Combustivel", value: vehicle.fuel_type },
                          { label: "Transmissao", value: vehicle.transmission },
                          { label: "Cor", value: vehicle.color },
                          { label: "Motor", value: vehicle.engine || "-" },
                          { label: "Portas", value: vehicle.doors || "4" },
                          { label: "Final da Placa", value: vehicle.plate_end || "-" },
                          { label: "Carroceria", value: vehicle.body_type || "-" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between py-3 border-b border-slate-800 last:border-0">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-white font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {vehicle.description && (
                        <div className="mt-6 pt-6 border-t border-slate-800">
                          <h4 className="text-white font-semibold mb-3">Descricao</h4>
                          <p className="text-slate-400 leading-relaxed">{vehicle.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Equipamentos e Opcionais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {features.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                              <div className="p-1.5 rounded-full bg-emerald-500/20">
                                <Check className="h-4 w-4 text-emerald-400" />
                              </div>
                              <span className="text-slate-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-8">
                          Informacoes de equipamentos nao disponiveis para este veiculo.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financing" className="mt-6">
                  <FinancingCalculatorClient 
                    vehiclePrice={Number(vehicle.price)} 
                    vehicleName={vehicle.name} 
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Price and Contact */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 sticky top-24">
                <CardContent className="p-6">
                  {/* Vehicle Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600">{vehicle.brand_name}</Badge>
                      {vehicle.is_featured && (
                        <Badge className="bg-amber-500">
                          <Star className="h-3 w-3 mr-1 fill-white" /> Destaque
                        </Badge>
                      )}
                      {vehicle.is_new && <Badge className="bg-emerald-500">0 KM</Badge>}
                    </div>
                    <h1 className="text-2xl font-bold text-white">{vehicle.name}</h1>
                    <p className="text-slate-400">{vehicle.year_manufacture}/{vehicle.year_model} - {vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "0 km"}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-400 mb-1">Preco a vista</p>
                    <p className="text-4xl font-bold text-white">{formatPrice(Number(vehicle.price))}</p>
                    <p className="text-sm text-emerald-400 mt-1">
                      ou parcelas a partir de {formatPrice(Number(vehicle.price) / 48)}/mes
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <Link href={`https://wa.me/5512999999999?text=Olá! Tenho interesse no ${vehicle.brand_name} ${vehicle.name}`} target="_blank" className="block">
                      <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg font-semibold">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chamar no WhatsApp
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-12 border-slate-700 text-white hover:bg-slate-800 bg-transparent">
                      <Phone className="mr-2 h-5 w-5" />
                      (12) 3333-4444
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-6">
                    <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
                      <Heart className="mr-1 h-4 w-4" /> Favoritar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
                      <Share2 className="mr-1 h-4 w-4" /> Compartilhar
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-6 border-t border-slate-700">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300">Garantia de motor e cambio</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Award className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300">Veiculo revisado e vistoriado</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <FileText className="h-4 w-4 text-amber-400" />
                      </div>
                      <span className="text-slate-300">Documentacao em dia</span>
                    </div>
                  </div>

                  {/* Views */}
                  <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                    <p className="text-sm text-slate-500">
                      <Eye className="inline h-4 w-4 mr-1" />
                      {vehicle.views_count || 0} visualizacoes
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    Localizacao
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Av. Independencia, 1500<br />
                    Centro - Taubate, SP
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>Seg-Sex: 8h-18h | Sab: 9h-13h</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Veiculos Similares</h2>
                <Link href="/veiculos" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarVehicles.map((v: any) => (
                  <Link key={v.id} href={`/veiculos/${v.slug}`}>
                    <Card className="group bg-slate-900 border-slate-800 hover:border-blue-500/50 overflow-hidden transition-all">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={v.primary_image || "/placeholder.svg"}
                          alt={`${v.brand_name} ${v.name}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-slate-500">{v.brand_name}</p>
                        <h3 className="font-semibold text-white text-sm truncate">{v.name}</h3>
                        <p className="text-blue-400 font-bold mt-1">{formatPrice(Number(v.price))}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <PublicFooter />
    </div>
  )
}
