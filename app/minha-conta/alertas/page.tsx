"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, Trash2, Car, DollarSign, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Alert {
  id: string
  brand: string
  model: string
  minPrice: number
  maxPrice: number
  minYear: number
  maxYear: number
  createdAt: Date
}

export default function CustomerAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      minPrice: 100000,
      maxPrice: 150000,
      minYear: 2022,
      maxYear: 2024,
      createdAt: new Date("2025-01-10"),
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
  })

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  const addAlert = () => {
    if (!newAlert.brand) return

    setAlerts([
      ...alerts,
      {
        id: Date.now().toString(),
        brand: newAlert.brand,
        model: newAlert.model,
        minPrice: Number(newAlert.minPrice) || 0,
        maxPrice: Number(newAlert.maxPrice) || 999999999,
        minYear: Number(newAlert.minYear) || 2015,
        maxYear: Number(newAlert.maxYear) || 2025,
        createdAt: new Date(),
      },
    ])

    setNewAlert({
      brand: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
    })
    setShowForm(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alertas de Veículos</h1>
          <p className="text-muted-foreground">Receba notificações quando um veículo do seu interesse chegar</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Alerta
        </Button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Alerta</CardTitle>
            <CardDescription>Defina os critérios do veículo que você procura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca</Label>
                <Select
                  value={newAlert.brand}
                  onValueChange={(value) => setNewAlert({ ...newAlert, brand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="Honda">Honda</SelectItem>
                    <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="Fiat">Fiat</SelectItem>
                    <SelectItem value="Hyundai">Hyundai</SelectItem>
                    <SelectItem value="Jeep">Jeep</SelectItem>
                    <SelectItem value="Nissan">Nissan</SelectItem>
                    <SelectItem value="Renault">Renault</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modelo (opcional)</Label>
                <Input
                  placeholder="Ex: Corolla, Civic, Onix..."
                  value={newAlert.model}
                  onChange={(e) => setNewAlert({ ...newAlert, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preço Mínimo</Label>
                <Input
                  type="number"
                  placeholder="R$ 50.000"
                  value={newAlert.minPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, minPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preço Máximo</Label>
                <Input
                  type="number"
                  placeholder="R$ 150.000"
                  value={newAlert.maxPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, maxPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ano Mínimo</Label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={newAlert.minYear}
                  onChange={(e) => setNewAlert({ ...newAlert, minYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ano Máximo</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={newAlert.maxYear}
                  onChange={(e) => setNewAlert({ ...newAlert, maxYear: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={addAlert} disabled={!newAlert.brand}>
                Criar Alerta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
                      <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {alert.brand} {alert.model && `- ${alert.model}`}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(alert.minPrice)} - {formatCurrency(alert.maxPrice)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {alert.minYear} - {alert.maxYear}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Ativo
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Nenhum alerta criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie alertas para ser notificado quando um veículo do seu interesse chegar no estoque.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Meu Primeiro Alerta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Como funcionam os alertas?</h3>
              <p className="text-sm text-muted-foreground">
                Quando um veículo que corresponde aos seus critérios for cadastrado em nosso estoque,
                você receberá uma notificação por e-mail e WhatsApp. Assim você fica sabendo em primeira mão!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
