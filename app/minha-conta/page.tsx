"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Heart, FileText, Car, Bell, ArrowRight, Calendar,
  DollarSign, Clock, Sparkles, ChevronRight, Loader2,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const statusProposal: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  approved: { label: "Aprovada", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  rejected: { label: "Rejeitada", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

const statusTd: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400" },
  confirmed: { label: "Confirmado", className: "bg-green-500/20 text-green-400" },
  completed: { label: "Realizado", className: "bg-blue-500/20 text-blue-400" },
  cancelled: { label: "Cancelado", className: "bg-red-500/20 text-red-400" },
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

export default function CustomerDashboard() {
  const { data, isLoading } = useSWR("/api/customer/dashboard", fetcher)

  const stats = data?.stats ?? { proposals: 0, testDrives: 0, favorites: 0, alerts: 0 }
  const recentProposals: any[] = data?.recentProposals ?? []
  const recentTestDrives: any[] = data?.recentTestDrives ?? []
  const userName: string = data?.user?.name?.split(" ")[0] ?? "Cliente"

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 p-6 lg:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-red-400/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-red-300" />
            <span className="text-sm font-medium text-red-200">Bem-vindo de volta!</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Olá, {isLoading ? "..." : userName}!
          </h1>
          <p className="text-red-100 max-w-xl">
            Acompanhe suas propostas, test drives agendados e encontre o veículo dos seus sonhos.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/veiculos">
              <Button className="bg-white text-red-700 hover:bg-red-50">
                <Car className="size-4 mr-2" />
                Explorar Veículos
              </Button>
            </Link>
            <Link href="/minha-conta/avaliacoes">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <FileText className="size-4 mr-2" />
                Avaliar Meu Carro
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Propostas", value: stats.proposals, icon: FileText, color: "from-red-600 to-red-700", shadow: "shadow-red-500/25", href: "/minha-conta/propostas" },
            { label: "Test Drives", value: stats.testDrives, icon: Car, color: "from-green-500 to-emerald-600", shadow: "shadow-green-500/25", href: "/minha-conta/test-drives" },
            { label: "Favoritos", value: stats.favorites, icon: Heart, color: "from-red-500 to-pink-600", shadow: "shadow-red-500/25", href: "/minha-conta/favoritos" },
            { label: "Alertas", value: stats.alerts, icon: Bell, color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/25", href: "/minha-conta/alertas" },
          ].map(({ label, value, icon: Icon, color, shadow, href }) => (
            <Link key={label} href={href}>
              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow}`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
                      <p className="text-sm text-slate-400">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="size-5 text-red-400" />
              Minhas Propostas
            </CardTitle>
            <Link href="/minha-conta/propostas">
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                Ver todas <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProposals.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <FileText className="mx-auto mb-2 size-8 opacity-30" />
                <p className="text-sm">Nenhuma proposta ainda</p>
                <Link href="/veiculos" className="mt-2 inline-block text-xs text-red-400 hover:underline">Explorar veículos</Link>
              </div>
            ) : recentProposals.map((p: any) => {
              const s = statusProposal[p.status] ?? statusProposal.pending
              return (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Car className="size-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{p.vehicle_name}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <DollarSign className="size-3" />
                        {formatCurrency(p.proposed_price)}
                        <span className="text-slate-600">|</span>
                        <Clock className="size-3" />
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={s.className}>{s.label}</Badge>
                    <ChevronRight className="size-5 text-slate-500" />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Test Drives */}
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
            {recentTestDrives.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <Car className="mx-auto mb-2 size-8 opacity-30" />
                <p className="text-sm">Nenhum agendamento ainda</p>
                <Link href="/veiculos" className="mt-2 inline-block text-xs text-green-400 hover:underline">Agendar test drive</Link>
              </div>
            ) : recentTestDrives.map((td: any) => {
              const s = statusTd[td.status] ?? statusTd.pending
              return (
                <div key={td.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white truncate pr-2">
                      {td.vehicle_name ?? "Veículo a definir"}
                    </p>
                    <Badge className={s.className}>{s.label}</Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    {new Date(td.preferred_date).toLocaleDateString("pt-BR")} às {td.preferred_time}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Ver Veículos", icon: Car, href: "/veiculos", color: "from-red-600 to-red-700" },
              { label: "Favoritos", icon: Heart, href: "/minha-conta/favoritos", color: "from-red-500 to-pink-500" },
              { label: "Avaliar Carro", icon: FileText, href: "/minha-conta/avaliacoes", color: "from-amber-500 to-orange-500" },
              { label: "Criar Alerta", icon: Bell, href: "/minha-conta/alertas", color: "from-green-500 to-emerald-500" },
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
    </div>
  )
}
