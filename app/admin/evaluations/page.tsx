"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  Phone,
  Mail,
  Star,
  Car,
  RefreshCcw,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { useSearchParams, Suspense } from "next/navigation"
import Loading from "./loading"

interface Evaluation {
  id: string
  brand: string
  model: string
  year: string
  version: string
  mileage: number
  color: string
  fuel_type: string
  transmission: string
  condition: string
  customer_name: string
  customer_email: string
  customer_phone: string
  city: string
  message: string
  estimated_value: number | null
  status: string
  created_at: string
}

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    try {
      const res = await fetch("/api/admin/evaluations")
      if (res.ok) {
        const data = await res.json()
        setEvaluations(data)
      }
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string, estimated_value?: number) => {
    try {
      const res = await fetch(`/api/admin/evaluations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, estimated_value })
      })
      if (res.ok) {
        toast.success(`Avaliação ${status === 'evaluated' ? 'concluída' : status === 'rejected' ? 'rejeitada' : 'atualizada'}!`)
        fetchEvaluations()
      }
    } catch (error) {
      toast.error("Erro ao atualizar avaliação")
    }
  }

  const filteredEvaluations = evaluations.filter(e => {
    const matchesSearch = e.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = evaluations.filter(e => e.status === 'pending').length
  const evaluatedCount = evaluations.filter(e => e.status === 'evaluated').length
  const rejectedCount = evaluations.filter(e => e.status === 'rejected').length

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      case 'evaluated':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Avaliado</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return <Badge className="bg-green-500">Excelente</Badge>
      case 'good':
        return <Badge className="bg-blue-500">Bom</Badge>
      case 'fair':
        return <Badge className="bg-amber-500">Regular</Badge>
      case 'poor':
        return <Badge className="bg-red-500">Ruim</Badge>
      default:
        return <Badge variant="outline">{condition}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avaliações de Veículos</h1>
          <p className="text-gray-600 mt-1">Avalie os veículos dos clientes para troca</p>
        </div>
        <Button variant="outline" onClick={fetchEvaluations}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setStatusFilter("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-amber-500 transition-colors" onClick={() => setStatusFilter("pending")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setStatusFilter("evaluated")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{evaluatedCount}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-red-500 transition-colors" onClick={() => setStatusFilter("rejected")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Avaliações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Avaliações</CardTitle>
              <CardDescription>
                {statusFilter !== "all" && `Filtrado por: ${statusFilter === 'pending' ? 'Pendentes' : statusFilter === 'evaluated' ? 'Avaliados' : 'Rejeitados'}`}
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nome ou veículo..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Suspense fallback={<Loading />}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead className="text-center">Km</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead className="text-right">Valor Estimado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Nenhuma avaliação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{evaluation.customer_name}</p>
                            <p className="text-sm text-gray-500">{evaluation.city}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{evaluation.brand} {evaluation.model}</p>
                            <p className="text-sm text-gray-500">{evaluation.year} - {evaluation.version}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {evaluation.mileage.toLocaleString('pt-BR')} km
                        </TableCell>
                        <TableCell>{getConditionBadge(evaluation.condition)}</TableCell>
                        <TableCell className="text-right font-bold">
                          {evaluation.estimated_value ? (
                            <span className="text-green-600">{formatCurrency(evaluation.estimated_value)}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(evaluation.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Car className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Ligar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar E-mail
                              </DropdownMenuItem>
                              {evaluation.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    const value = prompt("Digite o valor estimado do veículo:")
                                    if (value) {
                                      updateStatus(evaluation.id, 'evaluated', parseFloat(value.replace(/\D/g, '')))
                                    }
                                  }} className="text-green-600">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Informar Valor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(evaluation.id, 'rejected')} className="text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Rejeitar
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Suspense>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
