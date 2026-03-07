"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SeedDataButtonProps {
  currentVehicles: number
}

export function SeedDataButton({ currentVehicles }: SeedDataButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  const handleSeedData = async () => {
    if (currentVehicles > 0) {
      if (!confirm("Voce ja possui veiculos cadastrados. Deseja adicionar mais dados de exemplo?")) {
        return
      }
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      toast.success(`${data.vehiclesAdded} veiculos adicionados com sucesso!`)
      router.refresh()
    } catch {
      toast.error("Erro ao adicionar dados de exemplo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedImages = async () => {
    if (currentVehicles === 0) {
      toast.error("Adicione veiculos primeiro antes de popular imagens")
      return
    }

    setIsLoadingImages(true)
    try {
      const response = await fetch("/api/admin/seed-vehicle-images", {
        method: "POST",
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.info(data.message)
      }
      router.refresh()
    } catch {
      toast.error("Erro ao popular imagens")
    } finally {
      setIsLoadingImages(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Adicione veiculos de exemplo ou imagens para os veiculos existentes.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSeedData} disabled={isLoading || isLoadingImages}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Adicionando...
            </>
          ) : (
            <>
              <Download className="size-4 mr-2" />
              Adicionar Veiculos
            </>
          )}
        </Button>
        <Button onClick={handleSeedImages} disabled={isLoading || isLoadingImages} variant="outline">
          {isLoadingImages ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Populando imagens...
            </>
          ) : (
            <>
              <ImageIcon className="size-4 mr-2" />
              Popular Imagens (5 por veiculo)
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
