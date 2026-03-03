"use client"

import useSWR, { mutate } from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, Trash2, DollarSign, Calendar, Loader2 } from "lucide-react"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Alert {
  id: number
  customer_email: string
  brand: string
  model: string | null
  category: string | null
  min_price: number | null
  max_price: number | null
  min_year: number | null
  max_year: number | null
  fuel_type: string | null
  transmission: string | null
  is_active: boolean
  created_at: string
}

const emptyForm = {
  brand: "",
  model: "",
  minPrice: "",
  maxPrice: "",
  minYear: "",
  maxYear: "",
  category: "",
  fuelType: "",
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)

export default function CustomerAlertsPage() {
  const { data, isLoading } = useSWR<{ alerts: Alert[] }>("/api/alerts", fetcher)
  const alerts = data?.alerts ?? []
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function addAlert() {
    if (!form.brand) return
    setSaving(true)
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      await mutate("/api/alerts")
      setForm(emptyForm)
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function removeAlert(alertId: number) {
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertId }),
    })
    mutate("/api/alerts")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alertas de Veículos</h1>
          <p className="text-slate-400">Receba notificações quando um veículo do seu interesse chegar</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Criar Alerta
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Novo Alerta</CardTitle>
            <CardDescription className="text-slate-400">Defina os critérios do veículo que você procura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Marca *</Label>
                <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Toyota","Honda","Volkswagen","Chevrolet","Fiat","Hyundai","Jeep","Nissan","Renault","BMW","Mercedes-Benz","Audi","Kia","Volvo","Porsche"].map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Modelo (opcional)</Label>
                <Input
                  placeholder="Ex: Corolla, Civic..."
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Preço Mínimo</Label>
                <Input
                  type="number"
                  placeholder="R$ 50.000"
                  value={form.minPrice}
                  onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Preço Máximo</Label>
                <Input
                  type="number"
                  placeholder="R$ 200.000"
                  value={form.maxPrice}
                  onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Ano Mínimo</Label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={form.minYear}
                  onChange={(e) => setForm({ ...form, minYear: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Ano Máximo</Label>
                <Input
                  type="number"
                  placeholder="2025"
                  value={form.maxYear}
                  onChange={(e) => setForm({ ...form, maxYear: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Combustível</Label>
                <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex">Flex</SelectItem>
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="eletrico">Elétrico</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Câmbio</Label>
                <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="Qualquer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatico">Automático</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-600 text-slate-300">
                Cancelar
              </Button>
              <Button onClick={addAlert} disabled={!form.brand || saving} className="bg-red-600 hover:bg-red-700">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Criar Alerta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600/20 p-3 rounded-xl">
                      <Bell className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {alert.brand}{alert.model ? ` - ${alert.model}` : ""}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-400">
                        {(alert.min_price || alert.max_price) && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {alert.min_price ? formatCurrency(alert.min_price) : "Sem mínimo"}
                            {" — "}
                            {alert.max_price ? formatCurrency(alert.max_price) : "Sem máximo"}
                          </span>
                        )}
                        {(alert.min_year || alert.max_year) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {alert.min_year ?? "?"} — {alert.max_year ?? "?"}
                          </span>
                        )}
                        {alert.fuel_type && <span className="capitalize">{alert.fuel_type}</span>}
                        {alert.transmission && <span className="capitalize">{alert.transmission}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={alert.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-500/20 text-slate-400"}>
                      {alert.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-16 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-semibold mb-2 text-white">Nenhum alerta criado</h3>
            <p className="text-slate-400 mb-4">
              Crie alertas para ser notificado quando um veículo do seu interesse chegar ao estoque.
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Criar Meu Primeiro Alerta
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-red-600/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-600/20 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-white">Como funcionam os alertas?</h3>
              <p className="text-sm text-slate-400">
                Quando um veículo que corresponde aos seus critérios for cadastrado no estoque,
                você receberá uma notificação por e-mail. Seus alertas ficam salvos na sua conta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
