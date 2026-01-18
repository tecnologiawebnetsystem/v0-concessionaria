"use client"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Chatbot } from "@/components/public/chatbot"
import { TestDriveScheduler } from "@/components/public/test-drive-scheduler"
import { CarEvaluation } from "@/components/public/car-evaluation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Gauge,
  Fuel,
  ArrowRight,
  Car,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface HomePageProps {
  vehicles: any[]
}

export default function ClientHomePage({ vehicles }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const featuredVehicles = vehicles.filter((v) => v.is_featured).slice(0, 3)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(featuredVehicles.length, 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(featuredVehicles.length, 1)) % Math.max(featuredVehicles.length, 1))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <WhatsAppFloat />
      <Chatbot />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

          {/* Carrossel de Carros em Destaque */}
          {featuredVehicles.length > 0 && (
            <div className="relative">
              <div className="container mx-auto px-4 py-20 md:py-28">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Texto do Hero */}
                  <div className="relative z-10 text-center md:text-left">
                    <Badge className="mb-6 bg-blue-400/20 text-blue-100 border-blue-300/30 backdrop-blur-sm text-sm px-5 py-1.5">
                      ✨ Há mais de 15 anos no mercado
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
                      {featuredVehicles[currentSlide]?.name || "Encontre Seu Carro dos Sonhos"}
                    </h1>
                    <p className="text-xl text-blue-100/90 mb-10 text-pretty max-w-xl leading-relaxed">
                      {featuredVehicles[currentSlide]?.description ||
                        "A Nacional Veículos oferece os melhores veículos com garantia e financiamento facilitado."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-10">
                      <Link href={`/veiculos/${featuredVehicles[currentSlide]?.slug}`}>
                        <Button
                          size="lg"
                          className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-10 py-6 shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all"
                        >
                          Ver Este Veículo
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="/veiculos">
                        <Button
                          size="lg"
                          variant="outline"
                          className="text-lg px-10 py-6 bg-blue-500/10 hover:bg-blue-500/20 text-white border-blue-300/30 backdrop-blur-sm"
                        >
                          <Car className="mr-2 h-5 w-5" />
                          Ver Todos
                        </Button>
                      </Link>
                    </div>

                    {/* Controles do Carrossel */}
                    {featuredVehicles.length > 1 && (
                      <div className="flex items-center gap-4 justify-center md:justify-start">
                        <button
                          onClick={prevSlide}
                          className="p-3 rounded-full bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 transition-all"
                          aria-label="Anterior"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex gap-2">
                          {featuredVehicles.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`h-2.5 rounded-full transition-all ${
                                idx === currentSlide
                                  ? "w-10 bg-white shadow-lg shadow-blue-400/50"
                                  : "w-2.5 bg-white/40"
                              }`}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={nextSlide}
                          className="p-3 rounded-full bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 transition-all"
                          aria-label="Próximo"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Imagem do Carro em Destaque */}
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20" />
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-blue-400/20 backdrop-blur-sm bg-gradient-to-br from-blue-900/50 to-indigo-900/50">
                      {featuredVehicles[currentSlide]?.primary_image ? (
                        <Image
                          src={featuredVehicles[currentSlide].primary_image || "/placeholder.svg"}
                          alt={featuredVehicles[currentSlide].name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-900">
                          <Car className="h-32 w-32 text-white/20" />
                        </div>
                      )}

                      {/* Badge de Preço */}
                      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-blue-100">
                        <p className="text-sm text-gray-600 font-semibold">A partir de</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                          {formatCurrency(featuredVehicles[currentSlide]?.price || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero sem carros destacados */}
          {featuredVehicles.length === 0 && (
            <div className="container mx-auto px-4 py-28 text-center relative z-10">
              <Badge className="mb-6 bg-blue-400/20 text-blue-100 border-blue-300/30 backdrop-blur-sm text-sm px-5 py-1.5">
                ✨ Há mais de 15 anos no mercado
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance max-w-5xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-clip-text text-transparent leading-tight">
                Encontre Seu Carro dos Sonhos
              </h1>
              <p className="text-xl text-blue-100/90 mb-12 text-pretty max-w-2xl mx-auto leading-relaxed">
                A Nacional Veículos é referência em venda de carros 0km e seminovos com garantia e financiamento
                facilitado
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/veiculos">
                  <Button
                    size="lg"
                    className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-10 py-6 shadow-2xl shadow-blue-900/40"
                  >
                    <Car className="mr-2 h-5 w-5" />
                    Ver Todos os Veículos
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-6 bg-blue-500/10 hover:bg-blue-500/20 text-white border-blue-300/30 backdrop-blur-sm"
                  >
                    Fale Conosco
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Por Que Escolher a Nacional Veículos?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Somos especialistas em realizar o sonho do carro próprio com segurança e transparência
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center p-8 border-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-blue-900">Garantia Total</h3>
                <p className="text-gray-600">Todos os veículos com garantia e procedência verificada</p>
              </Card>

              <Card className="text-center p-8 border-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-blue-900">15 Anos de Mercado</h3>
                <p className="text-gray-600">Experiência e credibilidade que você pode confiar</p>
              </Card>

              <Card className="text-center p-8 border-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-blue-900">Financiamento Rápido</h3>
                <p className="text-gray-600">Aprovação em até 24h com as melhores taxas do mercado</p>
              </Card>

              <Card className="text-center p-8 border-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-600/30">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-blue-900">Atendimento VIP</h3>
                <p className="text-gray-600">Equipe especializada pronta para ajudar você</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção de Veículos em Destaque - GRANDE */}
        {vehicles.filter((v) => v.is_featured).length > 0 && (
          <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-1">
                  <Star className="h-3 w-3 mr-1 fill-amber-500" />
                  Seleção Especial
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Veículos em Destaque
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Os melhores veículos selecionados especialmente para você
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles
                  .filter((v) => v.is_featured)
                  .slice(0, 6)
                  .map((vehicle: any, index: number) => (
                    <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
                      <Card
                        className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden h-full border-0 hover:-translate-y-2 ${
                          index === 0
                            ? "md:col-span-2 lg:col-span-1 ring-2 ring-amber-400 shadow-xl shadow-amber-500/20"
                            : "shadow-lg"
                        }`}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          {vehicle.primary_image ? (
                            <Image
                              src={vehicle.primary_image || "/placeholder.svg"}
                              alt={vehicle.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              priority={index < 3}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-24 w-24 text-slate-300" />
                            </div>
                          )}

                          {/* Gradiente overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-amber-500 text-white shadow-lg font-bold px-3 py-1">
                              <Star className="h-3.5 w-3.5 mr-1 fill-white" />
                              DESTAQUE
                            </Badge>
                            {vehicle.is_new && (
                              <Badge className="bg-emerald-500 text-white shadow-lg font-bold px-3 py-1">0 KM</Badge>
                            )}
                          </div>

                          {/* Info overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <p className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-1">
                              {vehicle.brand_name}
                            </p>
                            <h3 className="font-bold text-2xl mb-2 line-clamp-1">{vehicle.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-white/80">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {vehicle.year}
                              </span>
                              <span className="flex items-center gap-1">
                                <Gauge className="h-4 w-4" />
                                {vehicle.mileage ? `${(vehicle.mileage / 1000).toFixed(0)}k km` : "0 km"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Fuel className="h-4 w-4" />
                                {vehicle.fuel_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-5 bg-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">A partir de</p>
                              <p className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                {formatCurrency(vehicle.price)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ou <span className="font-semibold text-blue-900">{formatCurrency(vehicle.price / 60)}</span>{" "}
                                / mês
                              </p>
                            </div>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                              Ver Mais
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Seção de Todo o Estoque */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Nosso Estoque Completo
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Confira todos os veículos disponíveis com as melhores condições de pagamento
              </p>
            </div>

            {vehicles.length === 0 ? (
              <Card className="p-16 border-2 border-dashed max-w-2xl mx-auto">
                <div className="text-center">
                  <Car className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-3">Nenhum Veículo Cadastrado</h3>
                  <p className="text-gray-600 mb-8">
                    Os veículos foram adicionados com sucesso! Recarregue a página para visualizá-los.
                  </p>
                  <Button onClick={() => window.location.reload()} size="lg">
                    Recarregar Página
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {vehicles.map((vehicle: any) => (
                    <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`}>
                      <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden h-full border-0 shadow-lg hover:-translate-y-1 bg-white">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          {vehicle.primary_image ? (
                            <Image
                              src={vehicle.primary_image || "/placeholder.svg"}
                              alt={vehicle.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-16 w-16 text-slate-300" />
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {vehicle.is_new && (
                              <Badge className="bg-emerald-500 text-white shadow-lg font-bold text-xs px-2.5 py-1">
                                0 KM
                              </Badge>
                            )}
                            {vehicle.is_featured && (
                              <Badge className="bg-amber-500 text-white shadow-lg font-bold text-xs px-2.5 py-1">
                                <Star className="h-3 w-3 mr-1 fill-white" />
                                DESTAQUE
                              </Badge>
                            )}
                          </div>

                          {/* Preço no canto */}
                          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                            <p className="text-lg font-bold text-blue-900">{formatCurrency(vehicle.price)}</p>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                              {vehicle.brand_name}
                            </p>
                            <Badge variant="secondary" className="text-xs font-semibold bg-slate-100">
                              {vehicle.year}
                            </Badge>
                          </div>

                          <h3 className="font-bold text-base mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-900 transition-colors">
                            {vehicle.name}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                              <Gauge className="h-3 w-3" />
                              {vehicle.mileage ? `${(vehicle.mileage / 1000).toFixed(0)}k` : "0"} km
                            </span>
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                              <Fuel className="h-3 w-3" />
                              {vehicle.fuel_type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <p className="text-xs text-gray-500">
                              <span className="font-semibold text-blue-900">{formatCurrency(vehicle.price / 60)}</span> / mês
                            </p>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs px-4"
                            >
                              Ver
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-16">
                  <Link href="/veiculos">
                    <Button
                      size="lg"
                      className="text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30"
                    >
                      Ver Todo o Estoque
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Seção de Serviços - Test Drive e Avalie */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Como Podemos Ajudar?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Oferecemos serviços que facilitam sua experiência de compra
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Test Drive Card */}
              <Card className="p-8 border-2 hover:border-blue-500 transition-all hover:shadow-xl group">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2 text-blue-900 dark:text-blue-100">Agende um Test Drive</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Experimente o carro dos seus sonhos antes de decidir. Agende uma visita e sinta a emoção de dirigir.
                    </p>
                    <TestDriveScheduler 
                      trigger={
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          Agendar Test Drive
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* Avalie seu Carro Card */}
              <Card className="p-8 border-2 hover:border-amber-500 transition-all hover:shadow-xl group">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2 text-amber-900 dark:text-amber-100">Avalie seu Veículo</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Quer trocar de carro? Descubra quanto vale seu usado e use como entrada no financiamento.
                    </p>
                    <CarEvaluation 
                      trigger={
                        <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                          Avaliar Meu Carro
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.2),transparent_50%)]" />

          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
              Pronto Para Seu Próximo Carro?
            </h2>
            <p className="text-xl text-blue-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Entre em contato conosco e descubra as melhores condições de financiamento do mercado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/veiculos">
                <Button
                  size="lg"
                  className="bg-white text-blue-950 hover:bg-blue-50 text-lg px-10 py-6 shadow-2xl shadow-blue-900/40"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Ver Estoque Completo
                </Button>
              </Link>
              <Link href="/contato">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 bg-blue-500/10 hover:bg-blue-500/20 border-blue-300/30 text-white backdrop-blur-sm"
                >
                  Falar com Consultor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
