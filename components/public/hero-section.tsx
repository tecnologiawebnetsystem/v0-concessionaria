"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function HeroSection({ banners }: { banners: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  if (banners.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/luxury-car-showroom.png')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Encontre Seu Carro Ideal
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-xl leading-relaxed text-blue-100">
              As melhores ofertas de veículos seminovos e 0km com garantia, financiamento facilitado e atendimento
              personalizado
            </p>

            <div className="mx-auto mt-12 max-w-4xl">
              <div className="rounded-2xl bg-white p-6 shadow-2xl">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">O que você procura?</label>
                    <Input placeholder="Ex: Civic, Corolla, Onix..." className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categoria</label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="hatch">Hatchback</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Faixa de Preço</label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Preços</SelectItem>
                        <SelectItem value="0-50000">Até R$ 50.000</SelectItem>
                        <SelectItem value="50000-100000">R$ 50.000 - R$ 100.000</SelectItem>
                        <SelectItem value="100000-150000">R$ 100.000 - R$ 150.000</SelectItem>
                        <SelectItem value="150000">Acima de R$ 150.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  size="lg"
                  asChild
                  className="mt-6 h-12 w-full bg-blue-900 text-base font-semibold hover:bg-blue-800"
                >
                  <Link href="/veiculos">
                    <Search className="mr-2 size-5" />
                    Buscar Veículos
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-blue-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-800">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">Garantia de Qualidade</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-800">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">Financiamento Aprovado</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-800">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">Documentação Inclusa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      <div className="relative h-[600px] overflow-hidden lg:h-[700px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner.image_url || "/placeholder.svg?height=700&width=1920"}
              alt={banner.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/70 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl text-white">
                  <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="mt-6 text-pretty text-xl leading-relaxed text-blue-100">{banner.subtitle}</p>
                  )}
                  {banner.link_url && (
                    <div className="mt-10 flex gap-4">
                      <Button
                        size="lg"
                        asChild
                        className="h-14 bg-white px-8 text-lg font-semibold text-blue-900 hover:bg-blue-50"
                      >
                        <Link href={banner.link_url}>{banner.link_text || "Saiba Mais"}</Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="h-14 border-2 border-white px-8 text-lg font-semibold text-white hover:bg-white/10 bg-transparent"
                      >
                        <Link href="/contato">Falar com Consultor</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-6 text-blue-900" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="size-6 text-blue-900" />
          </button>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? "w-12 bg-white" : "w-8 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
