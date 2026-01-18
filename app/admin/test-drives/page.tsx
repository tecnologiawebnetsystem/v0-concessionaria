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
  CalendarCheck,
  Car,
  RefreshCcw
} from "lucide-react"
import { toast } from "sonner"
import { useSearchParams, Suspense } from "next/navigation"

interface TestDrive {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  preferred_date: string
  preferred_time: string
  message: string
  status: string
  created_at: string
}

const Loading = () => null;

export default function AdminTestDrivesPage() {
  const [testDrives, setTestDrives] = useState<TestDrive[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTestDrives()
  }, [])

  const fetchTestDrives = async () => {
    try {
      const res = await fetch("/api/admin/test-drives")
      if (res.ok) {
        const data = await res.json()
        setTestDrives(data)
      }
    } catch (error) {
      console.error("Erro ao carregar test drives:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/test-drives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Test drive ${status === 'confirmed' ? 'confirmado' : status === 'completed' ? 'concluído' : status === 'cancelled' ? 'cancelado' : 'atualizado'}!`)
        fetchTestDrives()
      }
    } catch (error) {
      toast.error("Erro ao atualizar test drive")
    }
  }

  const filteredTestDrives = testDrives.filter(td => {
    const matchesSearch = td.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      td.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || td.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = testDrives.filter(td => td.status === 'pending').length
  const confirmedCount = testDrives.filter(td => td.status === 'confirmed').length
  const completedCount = testDrives.filter(td => td.status === 'completed').length

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (date: string) => {
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
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CalendarCheck className="w-3 h-3 mr-1" />Confirmado</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos de Test Drive</h1>
            <p className="text-gray-600 mt-1">Gerencie os agendamentos de test drive dos clientes</p>
          </div>
          <Button variant="outline" onClick={fetchTestDrives}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setStatusFilter("all")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testDrives.length}</div>
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

          <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setStatusFilter("confirmed")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <CalendarCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setStatusFilter("completed")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Test Drives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Agendamentos</CardTitle>
                <CardDescription>
                  {statusFilter !== "all" && `Filtrado por: ${statusFilter === 'pending' ? 'Pendentes' : statusFilter === 'confirmed' ? 'Confirmados' : 'Concluídos'}`}
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por nome..." 
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Preferida</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestDrives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Nenhum agendamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTestDrives.map((td) => (
                      <TableRow key={td.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{td.customer_name}</p>
                            <p className="text-sm text-gray-500">{td.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatDate(td.preferred_date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{td.preferred_time}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-gray-600">
                          {td.message}
                        </TableCell>
                        <TableCell>{getStatusBadge(td.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDateTime(td.created_at)}
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
                                <Phone className="mr-2 h-4 w-4" />
                                Ligar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar E-mail
                              </DropdownMenuItem>
                              {td.status === 'pending' && (
                                <DropdownMenuItem onClick={() => updateStatus(td.id, 'confirmed')} className="text-blue-600">
                                  <CalendarCheck className="mr-2 h-4 w-4" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              {td.status === 'confirmed' && (
                                <DropdownMenuItem onClick={() => updateStatus(td.id, 'completed')} className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marcar como Concluído
                                </DropdownMenuItem>
                              )}
                              {(td.status === 'pending' || td.status === 'confirmed') && (
                                <DropdownMenuItem onClick={() => updateStatus(td.id, 'cancelled')} className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}
