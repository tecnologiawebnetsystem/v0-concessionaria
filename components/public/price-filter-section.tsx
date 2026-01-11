import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PriceFilterSection() {
  const priceRanges = [
    { label: "Até R$ 30 mil", value: "0-30000" },
    { label: "R$ 30 - 50 mil", value: "30000-50000" },
    { label: "R$ 50 - 70 mil", value: "50000-70000" },
    { label: "R$ 70 - 90 mil", value: "70000-90000" },
    { label: "R$ 90 - 120 mil", value: "90000-120000" },
    { label: "R$ 120 - 150 mil", value: "120000-150000" },
    { label: "R$ 150 - 200 mil", value: "150000-200000" },
    { label: "Acima de R$ 200 mil", value: "200000" },
  ]

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">Busque por Faixa de Preço</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
            Encontre veículos que cabem no seu orçamento
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {priceRanges.map((range) => (
            <Button
              key={range.value}
              variant="outline"
              size="lg"
              asChild
              className="h-auto border-2 border-gray-200 py-4 text-base font-semibold transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900 bg-transparent"
            >
              <Link href={`/veiculos?preco=${range.value}`}>{range.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
