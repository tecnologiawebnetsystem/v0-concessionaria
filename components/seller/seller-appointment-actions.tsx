"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, MoreHorizontal, Clock } from "lucide-react"

interface Props {
  id: number
  status: string
}

export function SellerAppointmentActions({ id, status }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/test-drives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast({ title: `Agendamento ${newStatus === "confirmed" ? "confirmado" : newStatus === "completed" ? "marcado como realizado" : "cancelado"} com sucesso!` })
      router.refresh()
    } catch {
      toast({ title: "Erro ao atualizar agendamento", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (status === "completed" || status === "cancelled") return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading} className="text-gray-400 hover:text-white hover:bg-gray-700">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
        {status === "pending" && (
          <DropdownMenuItem onClick={() => updateStatus("confirmed")} className="hover:bg-gray-800 cursor-pointer">
            <CheckCircle className="size-4 mr-2 text-emerald-400" /> Confirmar
          </DropdownMenuItem>
        )}
        {(status === "pending" || status === "confirmed") && (
          <DropdownMenuItem onClick={() => updateStatus("completed")} className="hover:bg-gray-800 cursor-pointer">
            <Clock className="size-4 mr-2 text-blue-400" /> Marcar como Realizado
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => updateStatus("cancelled")} className="hover:bg-gray-800 cursor-pointer text-red-400">
          <XCircle className="size-4 mr-2" /> Cancelar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
