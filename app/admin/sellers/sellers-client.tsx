"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Plus, Search, DollarSign, Car, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  commission_rate: string
  base_salary: string
  hire_date: string
  is_active: boolean
  current_month_sales: string
  current_month_value: string
  total_sales: string
  total_value: string
}

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))

export default function AdminSellersClient({ sellers }: { sellers: Seller[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSeller, setNewSeller] = useState({ name: "", email: "", phone: "", cpf: "", commission_rate: "2.0" })

  const filtered = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalActive = sellers.filter((s) => s.is_active).length
  const totalSalesMonth = sellers.reduce((sum, s) => sum + Number(s.current_month_sales), 0)
  const totalValueMonth = sellers.reduce((sum, s) => sum + Number(s.current_month_value), 0)

  async function handleAddSeller() {
    try {
      const res = await fetch("/api/admin/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSeller),
      })
      if (res.ok) {
        toast.success("Vendedor cadastrado! A pagina sera atualizada.")
        setIsAddDialogOpen(false)
        setNewSeller({ name: "", email: "", phone: "", cpf: "", commission_rate: "2.0" })
        window.location.reload()
      } else {
        toast.error("Erro ao cadastrar vendedor.")
      }
    } catch {
      toast.error("Erro ao cadastrar vendedor.")
    }
  }

  async function handleToggleActive(seller: Seller) {
    try {
      await fetch(`/api/admin/sellers/${seller.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !seller.is_active }),
      })
      toast.success(`Vendedor ${seller.is_active ? "desativado" : "ativado"} com sucesso.`)
      window.location.reload()
    } catch {
      toast.error("Erro ao atualizar vendedor.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestao de Vendedores</h1>
          <p className="text-gray-600 mt-1">Gerencie a equipe de vendas e acompanhe o desempenho</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Vendedor</DialogTitle>
              <DialogDescription>Preencha os dados do novo vendedor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input value={newSeller.name} onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })} placeholder="Nome do vendedor" />
              </div>
              <div className="grid gap-2">
                <Label>E-mail</Label>
                <Input type="email" value={newSeller.email} onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })} placeholder="email@gtveiculos.com.br" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input value={newSeller.phone} onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })} placeholder="(12) 99999-9999" />
                </div>
                <div className="grid gap-2">
                  <Label>CPF</Label>
                  <Input value={newSeller.cpf} onChange={(e) => setNewSeller({ ...newSeller, cpf: e.target.value })} placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Taxa de Comissao (%)</Label>
                <Input type="number" step="0.5" value={newSeller.commission_rate} onChange={(e) => setNewSeller({ ...newSeller, commission_rate: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddSeller} className="bg-red-600 hover:bg-red-700">Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
            <p className="text-xs text-muted-foreground">de {sellers.length} cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas no Mes</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSalesMonth}</div>
            <p className="text-xs text-muted-foreground">veiculos vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValueMonth)}</div>
            <p className="text-xs text-muted-foreground">em vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equipe de Vendas</CardTitle>
              <CardDescription>Lista completa de vendedores e desempenho</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar vendedor..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Comissao</TableHead>
                <TableHead className="text-center">Vendas Mes</TableHead>
                <TableHead className="text-right">Valor Mes</TableHead>
                <TableHead className="text-right">Total Geral</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{seller.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <p className="text-sm text-gray-500">{seller.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{seller.commission_rate}%</Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{seller.current_month_sales}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(seller.current_month_value)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(seller.total_value)}</TableCell>
                  <TableCell>
                    <Badge variant={seller.is_active ? "default" : "secondary"}>
                      {seller.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleToggleActive(seller)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {seller.is_active ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    Nenhum vendedor encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
