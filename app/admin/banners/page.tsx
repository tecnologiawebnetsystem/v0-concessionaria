import { Suspense } from "react"
import { BannersTable } from "@/components/admin/banners/banners-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground mt-2">Gerencie os banners e promoções do site</p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Banner
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <BannersTable />
      </Suspense>
    </div>
  )
}
