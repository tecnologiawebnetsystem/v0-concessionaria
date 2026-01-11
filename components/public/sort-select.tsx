"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "relevancia") {
      params.set("ordenar", value)
    } else {
      params.delete("ordenar")
    }
    router.push(`/veiculos?${params.toString()}`)
  }

  const currentSort = searchParams.get("ordenar") || "relevancia"

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort" className="text-sm text-gray-600">
        Ordenar por:
      </Label>
      <Select value={currentSort} onValueChange={updateSort}>
        <SelectTrigger id="sort" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevancia">Relevância</SelectItem>
          <SelectItem value="menor-preco">Menor Preço</SelectItem>
          <SelectItem value="maior-preco">Maior Preço</SelectItem>
          <SelectItem value="mais-novo">Mais Novo</SelectItem>
          <SelectItem value="mais-antigo">Mais Antigo</SelectItem>
          <SelectItem value="menor-km">Menor KM</SelectItem>
          <SelectItem value="maior-km">Maior KM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
