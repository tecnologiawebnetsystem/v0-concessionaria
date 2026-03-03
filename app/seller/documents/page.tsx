"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText, CheckCircle, Clock, AlertCircle, Upload, Eye, Trash2,
  CreditCard, Car, Home, FileCheck, File, Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then(r => r.json())
const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR")

const documentTypes = [
  { type: "rg",                    name: "RG",                          icon: CreditCard, description: "Documento de identidade" },
  { type: "cpf",                   name: "CPF",                         icon: FileText,   description: "Cadastro de pessoa fisica" },
  { type: "cnh",                   name: "CNH",                         icon: Car,        description: "Carteira de habilitacao" },
  { type: "comprovante_residencia",name: "Comprovante de Residencia",   icon: Home,       description: "Conta de luz, agua ou gas" },
  { type: "contrato",              name: "Contrato de Trabalho",        icon: FileCheck,  description: "Contrato assinado" },
  { type: "certidao_nascimento",   name: "Certidao de Nascimento",      icon: File,       description: "Certidao original ou copia" },
  { type: "titulo_eleitor",        name: "Titulo de Eleitor",           icon: FileText,   description: "Documento eleitoral" },
  { type: "certificado_reservista",name: "Certificado de Reservista",   icon: FileText,   description: "Para homens" },
]

export default function SellerDocumentsPage() {
  const { data, isLoading, mutate } = useSWR("/api/seller/documents", fetcher)
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newDoc, setNewDoc] = useState({ type: "", name: "", file_url: "" })

  const documents: any[] = data?.documents ?? []
  const uploadedTypes = new Set(documents.map((d: any) => d.type))
  const pendingTypes  = documentTypes.filter(dt => !uploadedTypes.has(dt.type))

  const handleAddDoc = async () => {
    if (!newDoc.type || !newDoc.name) {
      toast({ title: "Preencha o tipo e nome do documento", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/seller/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoc),
      })
      if (!res.ok) throw new Error()
      await mutate()
      setDialogOpen(false)
      setNewDoc({ type: "", name: "", file_url: "" })
      toast({ title: "Documento registrado com sucesso!" })
    } catch {
      toast({ title: "Erro ao registrar documento", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja remover este documento?")) return
    try {
      await fetch(`/api/seller/documents?id=${id}`, { method: "DELETE" })
      await mutate()
      toast({ title: "Documento removido." })
    } catch {
      toast({ title: "Erro ao remover documento", variant: "destructive" })
    }
  }

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-10 w-56 bg-slate-800 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Meus Documentos</h1>
          <p className="text-slate-400">Gerencie seus documentos pessoais e contratuais</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="size-4 mr-2" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Registrar Documento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Tipo de Documento</Label>
                <Select value={newDoc.type} onValueChange={v => setNewDoc(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {documentTypes.map(dt => (
                      <SelectItem key={dt.type} value={dt.type}>{dt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Nome / Descricao</Label>
                <Input value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: RG - Joao Silva" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Link do Arquivo (opcional)</Label>
                <Input value={newDoc.file_url} onChange={e => setNewDoc(p => ({ ...p, file_url: e.target.value }))}
                  placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <Button onClick={handleAddDoc} disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {submitting ? "Registrando..." : "Registrar Documento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: documents.length, sub: "documentos enviados", icon: FileText, from: "from-blue-600", to: "to-blue-700", shadow: "shadow-blue-500/20" },
          { label: "Verificados", value: documents.filter(d => d.is_verified).length, sub: "aprovados", icon: CheckCircle, from: "from-emerald-500", to: "to-green-600", shadow: "shadow-emerald-500/20" },
          { label: "Pendentes", value: documents.filter(d => !d.is_verified).length, sub: "em analise", icon: Clock, from: "from-amber-500", to: "to-orange-600", shadow: "shadow-amber-500/20" },
          { label: "Faltantes", value: pendingTypes.length, sub: "a enviar", icon: AlertCircle, from: "from-red-500", to: "to-rose-600", shadow: "shadow-red-500/20" },
        ].map((c, i) => (
          <Card key={i} className={`bg-gradient-to-br ${c.from} ${c.to} border-0 shadow-lg ${c.shadow}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">{c.label}</CardTitle>
              <div className="rounded-lg bg-white/20 p-2"><c.icon className="size-5 text-white" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{c.value}</div>
              <p className="text-sm text-white/70">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentos faltantes */}
      {pendingTypes.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <AlertCircle className="size-5" /> Documentos Pendentes
            </CardTitle>
            <CardDescription className="text-amber-300/70">Os seguintes documentos ainda precisam ser enviados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {pendingTypes.map(dt => {
                const Icon = dt.icon
                return (
                  <div key={dt.type} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg"><Icon className="size-6 text-amber-400" /></div>
                      <div>
                        <p className="font-medium text-white">{dt.name}</p>
                        <p className="text-xs text-slate-500">{dt.description}</p>
                      </div>
                    </div>
                    <Button onClick={() => { setNewDoc(p => ({ ...p, type: dt.type, name: dt.name })); setDialogOpen(true) }}
                      variant="outline" size="sm" className="w-full mt-3 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 bg-transparent">
                      <Upload className="size-4 mr-2" /> Enviar
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos enviados */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Documentos Enviados</CardTitle>
          <CardDescription className="text-slate-400">Historico de todos os documentos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhum documento registrado ainda</p>
              <p className="text-sm text-slate-500">Clique em "Adicionar" para registrar seu primeiro documento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => {
                const dtInfo = documentTypes.find(dt => dt.type === doc.type)
                const Icon = dtInfo?.icon || FileText
                return (
                  <div key={doc.id} className={`p-4 rounded-lg border transition-all ${doc.is_verified ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/50 border-slate-700"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${doc.is_verified ? "bg-emerald-500/20" : "bg-slate-800"}`}>
                          <Icon className={`size-6 ${doc.is_verified ? "text-emerald-400" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{doc.name}</p>
                            {doc.is_verified
                              ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="size-3 mr-1" />Verificado</Badge>
                              : <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="size-3 mr-1" />Em analise</Badge>}
                          </div>
                          <p className="text-sm text-slate-500">{dtInfo?.name || doc.type}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>Enviado em {fmtDate(doc.created_at)}</span>
                            {doc.is_verified && doc.verified_by_name && (
                              <span className="text-emerald-400">Verificado por {doc.verified_by_name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.file_url && (
                          <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-white hover:bg-slate-700">
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><Eye className="size-4" /></a>
                          </Button>
                        )}
                        {!doc.is_verified && (
                          <Button onClick={() => handleDelete(doc.id)} variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
