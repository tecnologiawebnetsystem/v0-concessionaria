"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  Percent,
  FileText,
  Shield,
  TrendingUp,
  Target,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SellerProfilePage() {
  // Dados mockados para demonstracao
  const user = {
    name: "Carlos Vendedor",
    email: "carlos@concessionaria.com",
    phone: "(11) 99999-9999"
  }
  
  const seller = {
    commission_rate: 3,
    base_salary: 2500,
    hire_date: "2023-01-15",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    address: "Rua das Flores, 123",
    city: "Sao Paulo",
    state: "SP",
    zip_code: "01234-567",
    bank_name: "Banco do Brasil",
    bank_agency: "1234",
    bank_account: "12345-6",
    pix_key: "carlos@email.com",
    emergency_contact: "Maria Silva",
    emergency_phone: "(11) 98888-8888"
  }

  const stats = {
    totalSales: 45,
    totalValue: 4850000,
    totalCommission: 145500,
    goalsAchieved: 10,
    goalsTotal: 12
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="text-slate-400">Visualize e gerencie suas informacoes</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card Principal do Perfil */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="size-24 ring-4 ring-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Vendedor</Badge>
                </div>
                <CardDescription className="mt-1 text-slate-400">{user.email}</CardDescription>
                {seller.hire_date && (
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                    <Calendar className="size-4" />
                    Na empresa desde {formatDate(seller.hire_date)}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <User className="size-5 text-emerald-400" />
                Dados Pessoais
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Mail className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">E-mail</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Phone className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Telefone</p>
                    <p className="font-medium text-white">{user.phone || 'Nao informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Shield className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">CPF</p>
                    <p className="font-medium text-white">{seller.cpf || 'Nao informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <FileText className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">RG</p>
                    <p className="font-medium text-white">{seller.rg || 'Nao informado'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Endereco */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-emerald-400" />
                Endereco
              </h3>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <p className="font-medium text-white">{seller.address || 'Endereco nao informado'}</p>
                <p className="text-slate-400">
                  {[seller.city, seller.state, seller.zip_code].filter(Boolean).join(' - ')}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Dados Bancarios */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="size-5 text-emerald-400" />
                Dados Bancarios
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <Building className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Banco</p>
                    <p className="font-medium text-white">{seller.bank_name || 'Nao informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <CreditCard className="size-5 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Agencia / Conta</p>
                    <p className="font-medium text-white">
                      {seller.bank_agency && seller.bank_account 
                        ? `${seller.bank_agency} / ${seller.bank_account}`
                        : 'Nao informado'}
                    </p>
                  </div>
                </div>
                {seller.pix_key && (
                  <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg md:col-span-2">
                    <div className="size-5 flex items-center justify-center text-emerald-400 font-bold text-xs bg-emerald-500/20 rounded">
                      PIX
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Chave PIX</p>
                      <p className="font-medium text-white">{seller.pix_key}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Contato de Emergencia */}
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Phone className="size-5 text-emerald-400" />
                Contato de Emergencia
              </h3>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <p className="font-medium text-white">{seller.emergency_contact || 'Nao informado'}</p>
                <p className="text-slate-400">{seller.emergency_phone || ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar com Estatisticas */}
        <div className="space-y-6">
          {/* Card de Comissao */}
          <Card className="bg-gradient-to-br from-emerald-600 to-green-700 border-0 shadow-lg shadow-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                <Percent className="size-4" />
                Taxa de Comissao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{seller.commission_rate}%</div>
              <p className="text-sm text-emerald-200">Sobre cada venda realizada</p>
              {Number(seller.base_salary) > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-emerald-200">Salario Base</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(Number(seller.base_salary))}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatisticas */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Suas Estatisticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400">
                  <TrendingUp className="size-4" />
                  <span>Total de Vendas</span>
                </div>
                <span className="font-bold text-xl text-white">{stats.totalSales}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign className="size-4" />
                  <span>Valor Total</span>
                </div>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(stats.totalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign className="size-4" />
                  <span>Comissoes</span>
                </div>
                <span className="font-bold text-amber-400">
                  {formatCurrency(stats.totalCommission)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-400">
                  <Target className="size-4" />
                  <span>Metas Atingidas</span>
                </div>
                <span className="font-bold text-white">
                  {stats.goalsAchieved} / {stats.goalsTotal}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <FileText className="size-5 text-blue-400" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Gerencie seus documentos pessoais e contratuais
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/seller/documents">
                  Ver Documentos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
