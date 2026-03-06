"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Sparkles, 
  Instagram, 
  Eye, 
  EyeOff, 
  Loader2, 
  Check, 
  AlertCircle,
  ExternalLink,
  MapPin
} from "lucide-react"

interface Integration {
  key: string
  value: string | null
  category: string
}

interface IntegrationsFormProps {
  initialSettings: Integration[]
}

export function IntegrationsForm({ initialSettings }: IntegrationsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({})
  const [testingApi, setTestingApi] = useState<string | null>(null)
  
  // Estado local para os valores dos campos
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    initialSettings.forEach(s => {
      initial[s.key] = s.value || ""
    })
    return initial
  })

  const getValue = (key: string) => values[key] || ""
  const setValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const toggleShowToken = (key: string) => {
    setShowTokens(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async (key: string) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            value: getValue(key),
            category: "integrations",
            type: "secret"
          })
        })

        if (!response.ok) throw new Error("Falha ao salvar")
        
        toast.success("Configuração salva com sucesso!")
      } catch {
        toast.error("Erro ao salvar configuração")
      }
    })
  }

  const handleTestGemini = async () => {
    const token = getValue("gemini_api_key")
    if (!token) {
      toast.error("Insira o token do Gemini primeiro")
      return
    }

    setTestingApi("gemini")
    try {
      const response = await fetch("/api/admin/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: token })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Conexão com Gemini funcionando!")
      } else {
        toast.error(data.error || "Falha na conexão com Gemini")
      }
    } catch {
      toast.error("Erro ao testar conexão")
    } finally {
      setTestingApi(null)
    }
  }

  const integrations = [
    {
      id: "gemini",
      name: "Google Gemini AI",
      description: "Use IA para gerar descrições de veículos, responder perguntas e muito mais",
      icon: Sparkles,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      fields: [
        {
          key: "gemini_api_key",
          label: "API Key do Gemini",
          placeholder: "AIzaSy...",
          helpText: "Obtenha sua chave em aistudio.google.com",
          helpLink: "https://aistudio.google.com/app/apikey"
        }
      ],
      testFn: handleTestGemini
    },
    {
      id: "instagram",
      name: "Instagram Graph API",
      description: "Publique veículos automaticamente no Instagram (requer aprovação do Meta)",
      icon: Instagram,
      iconColor: "text-pink-500",
      bgColor: "bg-pink-500/10",
      fields: [
        {
          key: "instagram_access_token",
          label: "Access Token",
          placeholder: "EAAxxxxxxx...",
          helpText: "Token de acesso do Facebook/Instagram"
        },
        {
          key: "instagram_business_account_id",
          label: "Business Account ID",
          placeholder: "17841400xxxxxx",
          helpText: "ID da sua conta Instagram Business"
        }
      ]
    },
    {
      id: "viacep",
      name: "ViaCEP (Correios)",
      description: "Busca automática de endereços pelo CEP - Integração gratuita",
      icon: MapPin,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      fields: [],
      status: "active",
      statusText: "Ativo por padrão"
    }
  ]

  return (
    <div className="space-y-6">
      {integrations.map((integration) => (
        <Card key={integration.id} className="border-border/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-lg ${integration.bgColor}`}>
                  <integration.icon className={`size-5 ${integration.iconColor}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription className="mt-1">{integration.description}</CardDescription>
                </div>
              </div>
              {integration.status === "active" && (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">
                  <Check className="mr-1 size-3" />
                  {integration.statusText}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          {integration.fields.length > 0 && (
            <CardContent className="space-y-4">
              {integration.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id={field.key}
                        type={showTokens[field.key] ? "text" : "password"}
                        placeholder={field.placeholder}
                        value={getValue(field.key)}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 size-7 p-0"
                        onClick={() => toggleShowToken(field.key)}
                      >
                        {showTokens[field.key] ? (
                          <EyeOff className="size-4 text-muted-foreground" />
                        ) : (
                          <Eye className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleSave(field.key)}
                      disabled={isPending}
                      size="default"
                    >
                      {isPending ? <Loader2 className="size-4 animate-spin" /> : "Salvar"}
                    </Button>
                  </div>
                  {field.helpText && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {field.helpText}
                      {field.helpLink && (
                        <a 
                          href={field.helpLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          Obter chave <ExternalLink className="size-3" />
                        </a>
                      )}
                    </p>
                  )}
                </div>
              ))}

              {integration.testFn && (
                <div className="pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={integration.testFn}
                    disabled={testingApi === integration.id}
                    className="gap-2"
                  >
                    {testingApi === integration.id ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Testando...
                      </>
                    ) : (
                      <>
                        <Check className="size-4" />
                        Testar Conexão
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
