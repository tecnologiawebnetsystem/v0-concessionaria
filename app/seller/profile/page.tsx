"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  User, Mail, Phone, MapPin, Calendar, CreditCard, Building,
  Percent, FileText, Shield, TrendingUp, Target, DollarSign, Edit, Save, X
} from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("pt-BR") : "Nao informado"

export default function SellerProfilePage() {
  const { data, isLoading, mutate } = useSWR("/api/seller/profile", fetcher)
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})

  const profile = data?.profile ?? {}
  const stats   = data?.stats   ?? {}

  const startEdit = () => {
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      zip_code: profile.zip_code ?? "",
      emergency_contact: profile.emergency_contact ?? "",
      emergency_phone: profile.emergency_phone ?? "",
      bank_name: profile.bank_name ?? "",
      bank_agency: profile.bank_agency ?? "",
      bank_account: profile.bank_account ?? "",
      pix_key: profile.pix_key ?? "",
    })
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/seller/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      await mutate()
      setEditing(false)
      toast({ title: "Perfil atualizado com sucesso!" })
    } catch {
      toast({ title: "Erro ao salvar perfil", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-96 bg-slate-800 rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    </div>
  )

  const initials = (profile.name ?? "V").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-white">{value || "Nao informado"}</p>
      </div>
    </div>
  )

  const EditField = ({ field, label }: { field: string; label: string }) => (
    <div className="space-y-1">
      <Label className="text-slate-400 text-xs">{label}</Label>
      <Input value={form[field] ?? ""} onChange={e => setForm((p: any) => ({ ...p, [field]: e.target.value }))}
        className="bg-slate-900/50 border-slate-700 text-white focus:border-emerald-500" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-slate-400">Visualize e gerencie suas informacoes</p>
        </div>
        {!editing ? (
          <Button onClick={startEdit} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent">
            <Edit className="size-4 mr-2" /> Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setEditing(false)} variant="ghost" className="text-slate-400 hover:text-white">
              <X className="size-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="size-4 mr-2" /> {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card Principal */}
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
                  <CardTitle className="text-2xl text-white">{profile.name}</CardTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Vendedor</Badge>
                </div>
                <CardDescription className="mt-1 text-slate-400">{profile.email}</CardDescription>
                {profile.hire_date && (
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                    <Calendar className="size-4" /> Na empresa desde {fmtDate(profile.hire_date)}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {editing ? (
              <>
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="size-5 text-emerald-400" /> Dados Pessoais
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditField field="name" label="Nome completo" />
                    <EditField field="phone" label="Telefone" />
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="size-5 text-emerald-400" /> Endereco
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2"><EditField field="address" label="Logradouro" /></div>
                    <EditField field="city" label="Cidade" />
                    <EditField field="state" label="Estado" />
                    <EditField field="zip_code" label="CEP" />
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="size-5 text-emerald-400" /> Dados Bancarios
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditField field="bank_name" label="Banco" />
                    <EditField field="bank_agency" label="Agencia" />
                    <EditField field="bank_account" label="Conta" />
                    <EditField field="pix_key" label="Chave PIX" />
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="size-5 text-emerald-400" /> Contato de Emergencia
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditField field="emergency_contact" label="Nome" />
                    <EditField field="emergency_phone" label="Telefone" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="size-5 text-emerald-400" /> Dados Pessoais
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="E-mail" value={profile.email} />
                    <Field label="Telefone" value={profile.phone} />
                    <Field label="CPF" value={profile.cpf} />
                    <Field label="RG" value={profile.rg} />
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="size-5 text-emerald-400" /> Endereco
                  </h3>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <p className="font-medium text-white">{profile.address || "Nao informado"}</p>
                    <p className="text-slate-400">{[profile.city, profile.state, profile.zip_code].filter(Boolean).join(" - ")}</p>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="size-5 text-emerald-400" /> Dados Bancarios
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Banco" value={profile.bank_name} />
                    <Field label="Agencia / Conta" value={[profile.bank_agency, profile.bank_account].filter(Boolean).join(" / ")} />
                    {profile.pix_key && <div className="md:col-span-2"><Field label="Chave PIX" value={profile.pix_key} /></div>}
                  </div>
                </div>
                <Separator className="bg-slate-700" />
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="size-5 text-emerald-400" /> Contato de Emergencia
                  </h3>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <p className="font-medium text-white">{profile.emergency_contact || "Nao informado"}</p>
                    <p className="text-slate-400">{profile.emergency_phone || ""}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-emerald-600 to-green-700 border-0 shadow-lg shadow-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                <Percent className="size-4" /> Taxa de Comissao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{profile.commission_rate ?? 0}%</div>
              <p className="text-sm text-emerald-200">Sobre cada venda realizada</p>
              {Number(profile.base_salary) > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-emerald-200">Salario Base</p>
                  <p className="text-lg font-semibold text-white">{fmt(Number(profile.base_salary))}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Suas Estatisticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: TrendingUp, label: "Total de Vendas", value: Number(stats.total_sales) || 0 },
                { icon: DollarSign, label: "Valor Total", value: fmt(Number(stats.total_value) || 0) },
                { icon: DollarSign, label: "Comissoes", value: fmt(Number(stats.total_commission) || 0) },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-400">
                    <s.icon className="size-4" /><span>{s.label}</span>
                  </div>
                  <span className="font-bold text-white">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <FileText className="size-5 text-blue-400" /> Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Gerencie seus documentos pessoais e contratuais</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/seller/documents">Ver Documentos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
