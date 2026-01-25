"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Heart,
  FileText,
  Car,
  ClipboardList,
  Bell,
  ArrowRight,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
  ChevronRight,
  Sparkles,
  Eye,
  Clock,
} from "lucide-react"

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-6 lg:p-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-cyan-400/20 blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-cyan-300" />
            <span className="text-sm font-medium text-cyan-200">Bem-vindo de volta!</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Ola, Cliente!
          </h1>
          <p className="text-blue-100 max-w-xl">
            Acompanhe suas propostas, test drives agendados e encontre o veiculo dos seus sonhos.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/veiculos">
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                <Car className="size-4 mr-2" />
                Explorar Veiculos
              </Button>
            </Link>
            <Link href="/minha-conta/avaliacoes">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <ClipboardList className="size-4 mr-2" />
                Avaliar Meu Carro
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 transition-all">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">3</p>
                <p className="text-sm text-slate-400">Propostas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 transition-all">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Car className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">2</p>
                <p className="text-sm text-slate-400">Test Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 transition-all">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Heart className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">5</p>
                <p className="text-sm text-slate-400">Favoritos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 transition-all">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Bell className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-white">1</p>
                <p className="text-sm text-slate-400">Alertas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="size-5 text-blue-400" />
              Minhas Propostas
            </CardTitle>
            <Link href="/minha-conta/propostas">
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                Ver todas <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { vehicle: "Honda Civic EXL 2023", price: "R$ 145.000", status: "approved", date: "22/01/2026" },
              { vehicle: "Toyota Corolla XEi 2022", price: "R$ 128.000", status: "pending", date: "20/01/2026" },
              { vehicle: "Volkswagen Jetta TSI 2023", price: "R$ 155.000", status: "rejected", date: "18/01/2026" },
            ].map((proposal, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Car className="size-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{proposal.vehicle}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <DollarSign className="size-3" />
                      {proposal.price}
                      <span className="text-slate-600">|</span>
                      <Clock className="size-3" />
                      {proposal.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={
                    proposal.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                    proposal.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                    "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {proposal.status === "approved" ? "Aprovada" : proposal.status === "pending" ? "Pendente" : "Rejeitada"}
                  </Badge>
                  <ChevronRight className="size-5 text-slate-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Test Drives */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="size-5 text-green-400" />
              Test Drives
            </CardTitle>
            <Link href="/minha-conta/test-drives">
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { vehicle: "BMW X1 2023", date: "Amanha", time: "14:00", status: "confirmed" },
              { vehicle: "Audi A3 2022", date: "28/01", time: "10:00", status: "pending" },
            ].map((td, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{td.vehicle}</p>
                  <Badge className={
                    td.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }>
                    {td.status === "confirmed" ? "Confirmado" : "Pendente"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  {td.date} as {td.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Favorites */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Acoes Rapidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Ver Veiculos", icon: Car, href: "/veiculos", color: "from-blue-500 to-cyan-500" },
                { label: "Favoritos", icon: Heart, href: "/minha-conta/favoritos", color: "from-red-500 to-pink-500" },
                { label: "Avaliar Carro", icon: ClipboardList, href: "/minha-conta/avaliacoes", color: "from-amber-500 to-orange-500" },
                { label: "Falar Conosco", icon: Bell, href: "/contato", color: "from-green-500 to-emerald-500" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col gap-2 bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white"
                  >
                    <div className={`size-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <action.icon className="size-5 text-white" />
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Viewed */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="size-5 text-purple-400" />
              Vistos Recentemente
            </CardTitle>
            <Link href="/minha-conta/historico">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-slate-700">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { vehicle: "Mercedes C200 2023", price: "R$ 285.000", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&h=60&fit=crop" },
              { vehicle: "Porsche Cayenne 2022", price: "R$ 520.000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&h=60&fit=crop" },
            ].map((vehicle, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="size-14 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                  <img src={vehicle.image || "/placeholder.svg"} alt={vehicle.vehicle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{vehicle.vehicle}</p>
                  <p className="text-sm text-green-400">{vehicle.price}</p>
                </div>
                <ChevronRight className="size-5 text-slate-500 flex-shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
