"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Search,
  Sparkles,
  X,
  Loader2,
  Car,
  TrendingUp,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SearchResult {
  id: string
  name: string
  brand: string
  year: number
  price: number
  image_url?: string
  slug: string
  match_reason?: string
}

interface ParsedFilters {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  yearMin?: number
  yearMax?: number
  transmission?: string
  fuel?: string
  color?: string
}

const POPULAR_SEARCHES = [
  "SUV automatico ate 100 mil",
  "Carro popular economico",
  "Pickup diesel 4x4",
  "Sedan executivo",
  "Hatch compacto",
]

const RECENT_SEARCHES_KEY = "recent_searches"

export function NaturalSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [parsedFilters, setParsedFilters] = useState<ParsedFilters | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent search
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search function
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    saveRecentSearch(searchQuery)

    try {
      const response = await fetch("/api/search/natural", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      const data = await response.json()

      if (data.redirect) {
        // Se a IA determinou uma URL de filtro, redirecionar
        router.push(data.redirect)
        setIsOpen(false)
      } else {
        setResults(data.results || [])
        setParsedFilters(data.filters || null)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setParsedFilters(null)
    inputRef.current?.focus()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-2xl", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Busque com linguagem natural: 'SUV automatico ate 80 mil'"
            className="pl-12 pr-24 h-14 text-lg rounded-full border-2 focus-visible:ring-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={clearSearch}
              >
                <X className="size-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="rounded-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-xl z-50 max-h-[70vh] overflow-y-auto">
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>Busca inteligente com IA - entendo o que voce quer</span>
          </div>

          {/* Parsed filters */}
          {parsedFilters && Object.keys(parsedFilters).length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Filtros detectados:</p>
              <div className="flex flex-wrap gap-2">
                {parsedFilters.category && (
                  <Badge variant="secondary">Categoria: {parsedFilters.category}</Badge>
                )}
                {parsedFilters.brand && (
                  <Badge variant="secondary">Marca: {parsedFilters.brand}</Badge>
                )}
                {parsedFilters.priceMax && (
                  <Badge variant="secondary">Ate {formatPrice(parsedFilters.priceMax)}</Badge>
                )}
                {parsedFilters.transmission && (
                  <Badge variant="secondary">{parsedFilters.transmission}</Badge>
                )}
                {parsedFilters.fuel && (
                  <Badge variant="secondary">{parsedFilters.fuel}</Badge>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3 mb-4">
              <p className="text-sm font-medium">
                {results.length} resultado{results.length > 1 ? "s" : ""} encontrado{results.length > 1 ? "s" : ""}
              </p>
              {results.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/veiculos/${vehicle.slug}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="size-16 rounded-lg bg-muted overflow-hidden shrink-0">
                      {vehicle.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vehicle.image_url}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="size-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {vehicle.brand} {vehicle.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • {formatPrice(vehicle.price)}
                      </p>
                      {vehicle.match_reason && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {vehicle.match_reason}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results state */}
          {query && !isLoading && results.length === 0 && parsedFilters && (
            <div className="text-center py-6">
              <Car className="size-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhum veiculo encontrado</p>
              <p className="text-sm text-muted-foreground">
                Tente ajustar sua busca ou veja nossas sugestoes
              </p>
            </div>
          )}

          {/* Recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Buscas recentes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          {!query && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Buscas populares</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((search) => (
                  <Button
                    key={search}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
