import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Truck, CarFront, TruckIcon, Zap, CarTaxiFront } from "lucide-react"

const iconMap: Record<string, any> = {
  truck: Truck,
  car: Car,
  "car-front": CarFront,
  pickup: TruckIcon,
  zap: Zap,
  "car-taxi": CarTaxiFront,
}

export function CategoriesSection({ categories }: { categories: any[] }) {
  if (categories.length === 0) return null

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">Busque por Tipo de Veículo</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
            Encontre exatamente o que você precisa
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon || "car"] || Car
            return (
              <Link key={category.id} href={`/veiculos?categoria=${category.slug}`}>
                <Card className="group h-full overflow-hidden border-2 border-gray-100 transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 transition-all group-hover:from-blue-900 group-hover:to-blue-700 group-hover:shadow-lg">
                      <Icon className="size-10 text-blue-900 transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900">{category.name}</h3>
                    {category.description && <p className="mt-2 text-sm text-gray-600">{category.description}</p>}
                    <div className="mt-4 text-sm font-semibold text-blue-900 group-hover:underline">Ver Veículos →</div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
