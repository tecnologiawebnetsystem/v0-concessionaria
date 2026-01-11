"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SeedDataButtonProps {
  currentVehicles: number
}

export function SeedDataButton({ currentVehicles }: SeedDataButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSeedData = async () => {
    if (currentVehicles > 0) {
      if (!confirm("Você já possui veículos cadastrados. Deseja adicionar mais dados de exemplo?")) {
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
      toast.success(`${data.vehiclesAdded} veículos adicionados com sucesso!`)
      router.refresh()
    } catch (error) {
      toast.error("Erro ao adicionar dados de exemplo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Clique no botão abaixo para adicionar 50+ veículos de exemplo em todas as categorias, cada um com múltiplas
        fotos e especificações completas.
      </p>
      <Button onClick={handleSeedData} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adicionando dados...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Adicionar Dados de Exemplo
          </>
        )}
      </Button>
    </div>
  )
}
