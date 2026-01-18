"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Car, 
  Target,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

// Dados simulados de vendedores
const sellersData = [
  {
    id: 1,
    name: "Marcos Vendedor",
    email: "marcos.vendedor@nacionalveiculos.com.br",
    phone: "(12) 98789-0123",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    cpf: "123.456.789-00",
    admission_date: "2022-03-15",
    commission_rate: 2.5,
    is_active: true,
    sales_count: 47,
    total_sales: 4250000,
    commission_earned: 106250,
    current_month_sales: 5,
    current_month_value: 580000,
    goal_progress: 72.5
  },
  {
    id: 2,
    name: "Ana Silva",
    email: "ana.silva@nacionalveiculos.com.br",
    phone: "(12) 99876-5432",
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
    cpf: "987.654.321-00",
    admission_date: "2023-01-10",
    commission_rate: 2.0,
    is_active: true,
    sales_count: 32,
    total_sales: 2890000,
    commission_earned: 57800,
    current_month_sales: 4,
    current_month_value: 420000,
    goal_progress: 56.0
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@nacionalveiculos.com.br",
    phone: "(12) 98765-4321",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    cpf: "456.789.123-00",
    admission_date: "2021-08-20",
    commission_rate: 3.0,
    is_active: true,
    sales_count: 89,
    total_sales: 8950000,
    commission_earned: 268500,
    current_month_sales: 8,
    current_month_value: 920000,
    goal_progress: 115.0
  },
  {
    id: 4,
    name: "Fernanda Costa",
    email: "fernanda.costa@nacionalveiculos.com.br",
    phone: "(12) 97654-3210",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    cpf: "789.123.456-00",
    admission_date: "2023-06-01",
    commission_rate: 2.0,
    is_active: false,
    sales_count: 12,
    total_sales: 890000,
    commission_earned: 17800,
    current_month_sales: 0,
    current_month_value: 0,
    goal_progress: 0
  }
]

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState(sellersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSeller, setNewSeller] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    commission_rate: "2.0"
  })

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSellers = sellers.filter(s => s.is_active).length
  const totalSalesThisMonth = sellers.reduce((sum, s) => sum + s.current_month_sales, 0)
  const totalValueThisMonth = sellers.reduce((sum, s) => sum + s.current_month_value, 0)
  const avgGoalProgress = sellers.filter(s => s.is_active).reduce((sum, s) => sum + s.goal_progress, 0) / totalSellers

  const handleAddSeller = () => {
    toast.success("Vendedor cadastrado com sucesso!")
    setIsAddDialogOpen(false)
    setNewSeller({ name: "", email: "", phone: "", cpf: "", commission_rate: "2.0" })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Vendedores</h1>
          <p className="text-gray-600 mt-1">Gerencie a equipe de vendas e acompanhe o desempenho</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
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
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={newSeller.name}
                  onChange={(e) => setNewSeller({...newSeller, name: e.target.value})}
                  placeholder="Nome do vendedor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newSeller.email}
                  onChange={(e) => setNewSeller({...newSeller, email: e.target.value})}
                  placeholder="email@nacionalveiculos.com.br"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={newSeller.phone}
                    onChange={(e) => setNewSeller({...newSeller, phone: e.target.value})}
                    placeholder="(12) 99999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf" 
                    value={newSeller.cpf}
                    onChange={(e) => setNewSeller({...newSeller, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commission">Taxa de Comissão (%)</Label>
                <Input 
                  id="commission" 
                  type="number"
                  step="0.5"
                  value={newSeller.commission_rate}
                  onChange={(e) => setNewSeller({...newSeller, commission_rate: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddSeller} className="bg-blue-600 hover:bg-blue-700">Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSellers}</div>
            <p className="text-xs text-muted-foreground">de {sellers.length} cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas no Mês</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSalesThisMonth}</div>
            <p className="text-xs text-muted-foreground">veículos vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValueThisMonth)}</div>
            <p className="text-xs text-muted-foreground">em vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Equipe de Vendas</CardTitle>
                <CardDescription>Lista completa de vendedores e seu desempenho</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar vendedor..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead className="text-center">Vendas Mês</TableHead>
                  <TableHead className="text-right">Valor Mês</TableHead>
                  <TableHead className="text-center">Meta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={seller.photo || "/placeholder.svg"} alt={seller.name} />
                          <AvatarFallback>{seller.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                    <TableCell className="text-center">
                      <span className="font-semibold">{seller.current_month_sales}</span>
                      <span className="text-gray-500 text-sm"> / {seller.sales_count} total</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(seller.current_month_value)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${seller.goal_progress >= 100 ? 'bg-green-500' : seller.goal_progress >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(seller.goal_progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{seller.goal_progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={seller.is_active ? "default" : "secondary"}>
                        {seller.is_active ? "Ativo" : "Inativo"}
                      </Badge>
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
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Definir Meta
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
