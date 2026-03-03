"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, DollarSign, User, Car, CreditCard } from "lucide-react"

type SaleFormProps = {
  vehicles: any[]
  sellers: any[]
  sale?: any
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

export function SaleForm({ vehicles, sellers, sale }: SaleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    vehicle_id: sale?.vehicle_id || "",
    seller_id: sale?.seller_id || "",
    customer_name: sale?.customer_name || "",
    customer_email: sale?.customer_email || "",
    customer_phone: sale?.customer_phone || "",
    customer_cpf: sale?.customer_cpf || "",
    sale_date: sale?.sale_date ? new Date(sale.sale_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    final_price: sale?.final_price || "",
    original_price: sale?.original_price || "",
    payment_method: sale?.payment_method || "",
    installments: sale?.installments || "",
    down_payment: sale?.down_payment || "",
    commission_rate: sale?.commission_rate || "2.5",
    notes: sale?.notes || "",
    status: sale?.status || "pending",
  })

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicle_id)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelect(name: string, value: string) {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      // Auto-preenche o preço com o preço do veículo selecionado
      if (name === "vehicle_id") {
        const vehicle = vehicles.find((v) => v.id === value)
        if (vehicle) {
          updated.final_price = String(vehicle.price)
          updated.original_price = String(vehicle.price)
        }
      }
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = sale ? `/api/admin/sales/${sale.id}` : "/api/admin/sales"
      const method = sale ? "PATCH" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          final_price: Number(formData.final_price),
          original_price: Number(formData.original_price) || Number(formData.final_price),
          installments: formData.installments ? Number(formData.installments) : null,
          down_payment: formData.down_payment ? Number(formData.down_payment) : null,
          commission_rate: Number(formData.commission_rate),
          commission_value: Number(formData.final_price) * (Number(formData.commission_rate) / 100),
          vehicle_id: formData.vehicle_id || null,
          seller_id: formData.seller_id || null,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erro ao salvar venda")
      toast.success(sale ? "Venda atualizada!" : "Venda registrada com sucesso!")
      router.push("/admin/sales")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar venda")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Veículo e Vendedor */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Car className="size-5 text-blue-400" />
            Veículo e Vendedor
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Veículo</Label>
            <Select value={formData.vehicle_id} onValueChange={(v) => handleSelect("vehicle_id", v)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id} className="text-slate-300">
                    {v.name} ({v.year}) — {formatCurrency(Number(v.price))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVehicle && (
              <p className="text-xs text-emerald-400">Preço preenchido automaticamente</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Vendedor</Label>
            <Select value={formData.seller_id} onValueChange={(v) => handleSelect("seller_id", v)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Selecione o vendedor" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {sellers.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-slate-300">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Cliente */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="size-5 text-blue-400" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Nome *</Label>
            <Input name="customer_name" value={formData.customer_name} onChange={handleChange}
              placeholder="Nome completo" required
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">CPF</Label>
            <Input name="customer_cpf" value={formData.customer_cpf} onChange={handleChange}
              placeholder="000.000.000-00"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Email</Label>
            <Input name="customer_email" type="email" value={formData.customer_email} onChange={handleChange}
              placeholder="email@exemplo.com"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Telefone</Label>
            <Input name="customer_phone" value={formData.customer_phone} onChange={handleChange}
              placeholder="(12) 99999-9999"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
        </CardContent>
      </Card>

      {/* Valores e Pagamento */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="size-5 text-blue-400" />
            Valores e Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-slate-300">Valor de Venda (R$) *</Label>
            <Input name="final_price" type="number" step="0.01" value={formData.final_price} onChange={handleChange}
              placeholder="0.00" required
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Valor Tabela (R$)</Label>
            <Input name="original_price" type="number" step="0.01" value={formData.original_price} onChange={handleChange}
              placeholder="0.00"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Data da Venda</Label>
            <Input name="sale_date" type="date" value={formData.sale_date} onChange={handleChange}
              className="bg-slate-900/50 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Forma de Pagamento</Label>
            <Select value={formData.payment_method} onValueChange={(v) => handleSelect("payment_method", v)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="cash" className="text-slate-300">À Vista</SelectItem>
                <SelectItem value="financing" className="text-slate-300">Financiamento</SelectItem>
                <SelectItem value="consortium" className="text-slate-300">Consórcio</SelectItem>
                <SelectItem value="transfer" className="text-slate-300">Transferência</SelectItem>
                <SelectItem value="trade_in" className="text-slate-300">Troca + Complemento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Entrada (R$)</Label>
            <Input name="down_payment" type="number" step="0.01" value={formData.down_payment} onChange={handleChange}
              placeholder="0.00"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Parcelas</Label>
            <Input name="installments" type="number" value={formData.installments} onChange={handleChange}
              placeholder="Ex: 48"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Comissão (%)</Label>
            <Input name="commission_rate" type="number" step="0.1" value={formData.commission_rate} onChange={handleChange}
              placeholder="2.5"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
            {formData.final_price && formData.commission_rate && (
              <p className="text-xs text-amber-400">
                = {formatCurrency(Number(formData.final_price) * (Number(formData.commission_rate) / 100))}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Status</Label>
            <Select value={formData.status} onValueChange={(v) => handleSelect("status", v)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="pending" className="text-slate-300">Pendente</SelectItem>
                <SelectItem value="approved" className="text-slate-300">Aprovada</SelectItem>
                <SelectItem value="completed" className="text-slate-300">Concluída</SelectItem>
                <SelectItem value="cancelled" className="text-slate-300">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="size-5 text-blue-400" />
            Observações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea name="notes" value={formData.notes} onChange={handleChange}
            placeholder="Observações sobre a venda, condições especiais, etc."
            rows={4}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500" />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}
          className="border-slate-600 text-slate-300 hover:bg-slate-700">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Salvando...</>
          ) : sale ? "Atualizar Venda" : "Registrar Venda"}
        </Button>
      </div>
    </form>
  )
}
