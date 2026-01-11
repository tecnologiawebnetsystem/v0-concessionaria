import { Suspense } from "react"
import { BrandsTable } from "@/components/admin/brands/brands-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marcas</h1>
          <p className="text-muted-foreground mt-2">Gerencie as marcas de veículos disponíveis</p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Marca
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <BrandsTable />
      </Suspense>
    </div>
  )
}
