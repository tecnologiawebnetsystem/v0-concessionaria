import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { SaleForm } from "../../new/sale-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

async function getData(id: string) {
  const [sale] = await sql`SELECT * FROM sales WHERE id = ${id}`
  const vehicles = await sql`SELECT id, name, year, price FROM vehicles ORDER BY name`
  const sellers = await sql`
    SELECT s.id, u.name FROM sellers s
    JOIN users u ON s.user_id = u.id
    WHERE s.is_active = true
    ORDER BY u.name
  `
  return { sale, vehicles, sellers }
}

export default async function EditSalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { sale, vehicles, sellers } = await getData(id)
  if (!sale) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/sales/${id}`}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Editar Venda</h1>
          <p className="text-slate-400">Atualize os dados da venda</p>
        </div>
      </div>
      <SaleForm vehicles={vehicles} sellers={sellers} sale={sale} />
    </div>
  )
}
