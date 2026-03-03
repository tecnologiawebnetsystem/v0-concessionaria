import { sql } from "@/lib/db"
import { SaleForm } from "./sale-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

async function getFormData() {
  const vehicles = await sql`
    SELECT id, name, year, price FROM vehicles
    WHERE status = 'available'
    ORDER BY name
  `
  const sellers = await sql`
    SELECT s.id, u.name FROM sellers s
    JOIN users u ON s.user_id = u.id
    WHERE s.is_active = true
    ORDER BY u.name
  `
  return { vehicles, sellers }
}

export default async function NewSalePage() {
  const { vehicles, sellers } = await getFormData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/sales">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Nova Venda</h1>
          <p className="text-slate-400">Registre uma nova venda no sistema</p>
        </div>
      </div>
      <SaleForm vehicles={vehicles} sellers={sellers} />
    </div>
  )
}
