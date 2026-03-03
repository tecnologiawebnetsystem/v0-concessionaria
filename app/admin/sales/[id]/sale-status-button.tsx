"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, DollarSign } from "lucide-react"

type Props = {
  saleId: string
  currentStatus: string
  commissionPaid: boolean
}

export function SaleStatusButton({ saleId, currentStatus, commissionPaid }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function update(payload: Record<string, unknown>, label: string) {
    setLoading(label)
    try {
      const res = await fetch(`/api/admin/sales/${saleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`${label} com sucesso!`)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro na operação")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-base">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {currentStatus === "pending" && (
          <Button onClick={() => update({ status: "approved" }, "Venda aprovada")}
            disabled={!!loading} className="bg-blue-600 hover:bg-blue-700">
            {loading === "Venda aprovada" ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle className="size-4 mr-2" />}
            Aprovar
          </Button>
        )}
        {(currentStatus === "approved" || currentStatus === "pending") && (
          <Button onClick={() => update({ status: "completed" }, "Venda concluída")}
            disabled={!!loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading === "Venda concluída" ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle className="size-4 mr-2" />}
            Concluir
          </Button>
        )}
        {currentStatus !== "cancelled" && currentStatus !== "completed" && (
          <Button onClick={() => update({ status: "cancelled" }, "Venda cancelada")}
            disabled={!!loading} variant="destructive">
            {loading === "Venda cancelada" ? <Loader2 className="size-4 animate-spin mr-2" /> : <XCircle className="size-4 mr-2" />}
            Cancelar Venda
          </Button>
        )}
        {!commissionPaid && currentStatus === "completed" && (
          <Button onClick={() => update({ commission_paid: true }, "Comissão marcada")}
            disabled={!!loading} className="bg-amber-600 hover:bg-amber-700">
            {loading === "Comissão marcada" ? <Loader2 className="size-4 animate-spin mr-2" /> : <DollarSign className="size-4 mr-2" />}
            Marcar Comissão como Paga
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
