"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Search, Loader2, X } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  name: string
  brand: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  category: string
  slug: string
  image: string | null
}

interface SearchResult {
  vehicles: Vehicle[]
  summary: string | null
  total: number
}

const SUGGESTIONS = [
  "SUV até R$ 80 mil",
  "Sedan automático com menos de 50 mil km",
  "Carro flex bom para família",
  "Hatch econômico até R$ 50 mil",
]

export function AISearch() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  async function handleSearch(q: string = query) {
    if (!q.trim()) return
    setQuery(q)
    setLoading(true)
    setShowResults(true)
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ vehicles: [], summary: null, total: 0 })
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setQuery("")
    setResult(null)
    setShowResults(false)
  }

  return (
    <div className="w-full">
      {/* Campo de busca */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-red-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder='Ex: "SUV automático até 80 mil" ou "Hatch flex para cidade"'
              className="pl-10 pr-4 h-12 text-sm border-2 focus:border-red-500 transition-colors"
            />
            {query && (
              <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="h-12 px-5 bg-red-600 hover:bg-red-700 shrink-0"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </div>

        {/* Sugestões */}
        {!showResults && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resultados */}
      {showResults && (
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center gap-3 py-6 justify-center text-gray-500">
              <Loader2 className="size-5 animate-spin text-red-500" />
              <span className="text-sm">Buscando com inteligência artificial...</span>
            </div>
          ) : result ? (
            <>
              {result.summary && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 border border-red-100">
                  <Sparkles className="size-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-800">
                    <strong>IA encontrou:</strong> {result.summary}
                    {" — "}<span className="font-medium">{result.total} veículo{result.total !== 1 ? "s" : ""}</span>
                  </p>
                </div>
              )}

              {result.vehicles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhum veículo encontrado para essa busca.</p>
                  <button onClick={clear} className="mt-2 text-sm text-red-600 hover:underline">
                    Tentar outra busca
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.vehicles.map((v) => (
                    <Link
                      key={v.id}
                      href={`/veiculos/${v.slug}`}
                      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-red-200 transition-all"
                    >
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                        {v.image ? (
                          <img
                            src={v.image}
                            alt={`${v.brand} ${v.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm">
                            Sem foto
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm text-gray-900 truncate">{v.brand} {v.name} {v.year}</p>
                        <p className="text-red-600 font-bold mt-1">
                          {Number(v.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{v.fuel_type}</Badge>
                          <Badge variant="secondary" className="text-xs">{v.transmission}</Badge>
                          {v.mileage > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {Number(v.mileage).toLocaleString("pt-BR")} km
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-700">
                  Limpar busca
                </button>
                <Link href="/veiculos" className="text-sm text-red-600 hover:underline">
                  Ver todo o estoque
                </Link>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
