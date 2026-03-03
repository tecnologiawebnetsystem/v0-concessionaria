"use client"

import useSWR, { mutate } from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, Lock, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CustomerProfilePage() {
  const { data, isLoading } = useSWR<{ user: { id: string; name: string; email: string; phone: string | null; created_at: string } }>("/api/profile", fetcher)
  const user = data?.user

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name ?? "")
      setPhone(user.phone ?? "")
    }
  }, [user])

  async function saveProfile() {
    setSaving(true)
    setProfileMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_profile", name, phone }),
      })
      const json = await res.json()
      if (!res.ok) {
        setProfileMsg({ type: "error", text: json.error || "Erro ao salvar" })
      } else {
        setProfileMsg({ type: "success", text: "Perfil atualizado com sucesso!" })
        mutate("/api/profile")
      }
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "As senhas não coincidem" })
      return
    }
    setSavingPass(true)
    setPassMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_password", currentPassword, newPassword }),
      })
      const json = await res.json()
      if (!res.ok) {
        setPassMsg({ type: "error", text: json.error || "Erro ao alterar senha" })
      } else {
        setPassMsg({ type: "success", text: "Senha alterada com sucesso!" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } finally {
      setSavingPass(false)
    }
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        <p className="text-slate-400">Gerencie suas informações pessoais</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="personal" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Informações Pessoais</CardTitle>
              <CardDescription className="text-slate-400">
                Conta criada em {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "—"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-red-600/20 text-red-400 text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white text-lg">{user?.name}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      value={user?.email ?? ""}
                      disabled
                      className="pl-10 bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500">E-mail não pode ser alterado</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              {profileMsg && (
                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${profileMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {profileMsg.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {profileMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={saving} className="bg-red-600 hover:bg-red-700">
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alterar Senha</CardTitle>
              <CardDescription className="text-slate-400">Escolha uma senha forte com pelo menos 6 caracteres</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-600 text-white"
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </div>
              </div>

              {passMsg && (
                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg max-w-md ${passMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {passMsg.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {passMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={changePassword}
                  disabled={savingPass || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {savingPass ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                  {savingPass ? "Alterando..." : "Alterar Senha"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-red-950/20 border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-400">Excluir Conta</CardTitle>
              <CardDescription className="text-slate-400">Atenção: esta ação é irreversível</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo propostas, histórico e favoritos.
              </p>
              <DeleteAccountButton />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function deleteAccount() {
    setDeleting(true)
    try {
      const session = await fetch("/api/auth/me").then((r) => r.json())
      const res = await fetch(`/api/users/${session?.id}`, { method: "DELETE" })
      if (res.ok) {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.href = "/"
      }
    } finally {
      setDeleting(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-red-400 mr-2">Tem certeza? Esta ação não pode ser desfeita.</p>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)} className="border-slate-600 text-slate-300">
          Cancelar
        </Button>
        <Button variant="destructive" size="sm" onClick={deleteAccount} disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Exclusão"}
        </Button>
      </div>
    )
  }

  return (
    <Button variant="destructive" onClick={() => setConfirming(true)}>
      Excluir Minha Conta
    </Button>
  )
}
