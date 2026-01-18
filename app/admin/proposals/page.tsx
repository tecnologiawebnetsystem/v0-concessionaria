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
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Phone,
  Mail,
  FileText,
  DollarSign,
  RefreshCcw
} from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

interface Proposal {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  vehicle_name: string
  vehicle_price: number
  proposed_price: number
  payment_method: string
  has_trade_in: boolean
  trade_in_brand?: string
  trade_in_model?: string
  trade_in_year?: number
  message: string
  status: string
  created_at: string
}

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const res = await fetch("/api/admin/proposals")
      if (res.ok) {
        const data = await res.json()
        setProposals(data)
      }
    } catch (error) {
      console.error("Erro ao carregar propostas:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Proposta ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'atualizada'}!`)
        fetchProposals()
      }
    } catch (error) {
      toast.error("Erro ao atualizar proposta")
    }
  }

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = proposals.filter(p => p.status === 'pending').length
  const approvedCount = proposals.filter(p => p.status === 'approved').length
  const rejectedCount = proposals.filter(p => p.status === 'rejected').length

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
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Aprovada</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case 'cash': return 'À Vista'
      case 'financing': return 'Financiamento'
      case 'consortium': return 'Consórcio'
      default: return method
    }
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Propostas de Compra</h1>
              <p className="text-gray-600 mt-1">Gerencie as propostas recebidas dos clientes</p>
            </div>
            <Button variant="outline" onClick={fetchProposals}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => setStatusFilter("all")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{proposals.length}</div>
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

            <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setStatusFilter("approved")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-red-500 transition-colors" onClick={() => setStatusFilter("rejected")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Propostas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Propostas</CardTitle>
                  <CardDescription>
                    {statusFilter !== "all" && `Filtrado por: ${statusFilter === 'pending' ? 'Pendentes' : statusFilter === 'approved' ? 'Aprovadas' : 'Rejeitadas'}`}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead className="text-right">Proposta</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Troca</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Nenhuma proposta encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProposals.map((proposal) => (
                        <TableRow key={proposal.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{proposal.name}</p>
                              <p className="text-sm text-gray-500">{proposal.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{proposal.vehicle_name}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(proposal.vehicle_price)}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(proposal.proposed_price)}</p>
                            {proposal.proposed_price < proposal.vehicle_price && (
                              <p className="text-xs text-red-500">
                                -{((1 - proposal.proposed_price / proposal.vehicle_price) * 100).toFixed(1)}%
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getPaymentMethod(proposal.payment_method)}</Badge>
                          </TableCell>
                          <TableCell>
                            {proposal.has_trade_in ? (
                              <div className="text-sm">
                                <p className="font-medium">{proposal.trade_in_brand} {proposal.trade_in_model}</p>
                                <p className="text-gray-500">{proposal.trade_in_year}</p>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(proposal.created_at)}
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
                                  <Eye className="mr-2 h-4 w-4" />
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
                                {proposal.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'approved')} className="text-green-600">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Aprovar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(proposal.id, 'rejected')} className="text-red-600">
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
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
