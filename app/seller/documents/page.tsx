"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  File,
  CreditCard,
  Car,
  Home,
  FileCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

const documentTypes = [
  { type: 'rg', name: 'RG', icon: CreditCard, description: 'Documento de identidade' },
  { type: 'cpf', name: 'CPF', icon: FileText, description: 'Cadastro de pessoa fisica' },
  { type: 'cnh', name: 'CNH', icon: Car, description: 'Carteira de habilitacao' },
  { type: 'comprovante_residencia', name: 'Comprovante de Residencia', icon: Home, description: 'Conta de luz, agua ou gas' },
  { type: 'contrato', name: 'Contrato de Trabalho', icon: FileCheck, description: 'Contrato assinado' },
  { type: 'certidao_nascimento', name: 'Certidao de Nascimento', icon: File, description: 'Certidao original ou copia' },
  { type: 'titulo_eleitor', name: 'Titulo de Eleitor', icon: FileText, description: 'Documento eleitoral' },
  { type: 'certificado_reservista', name: 'Certificado de Reservista', icon: FileText, description: 'Para homens' },
]

export default function SellerDocumentsPage() {
  // Dados mockados
  const documents = [
    { id: 1, type: 'rg', name: 'RG - Carlos Silva', is_verified: true, created_at: '2024-01-10', verified_by_name: 'Admin' },
    { id: 2, type: 'cpf', name: 'CPF - Carlos Silva', is_verified: true, created_at: '2024-01-10', verified_by_name: 'Admin' },
    { id: 3, type: 'cnh', name: 'CNH - Carlos Silva', is_verified: false, created_at: '2024-01-15' },
    { id: 4, type: 'contrato', name: 'Contrato de Trabalho', is_verified: true, created_at: '2023-01-15', verified_by_name: 'RH' },
  ]

  const uploadedTypes = new Set(documents.map((d: any) => d.type))
  const pendingTypes = documentTypes.filter(dt => !uploadedTypes.has(dt.type))

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Meus Documentos</h1>
        <p className="text-slate-400">Gerencie seus documentos pessoais e contratuais</p>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-lg shadow-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <FileText className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{documents.length}</div>
            <p className="text-sm text-blue-200">documentos enviados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 border-0 shadow-lg shadow-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Verificados</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <CheckCircle className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {documents.filter((d: any) => d.is_verified).length}
            </div>
            <p className="text-sm text-emerald-200">aprovados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Pendentes</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <Clock className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {documents.filter((d: any) => !d.is_verified).length}
            </div>
            <p className="text-sm text-amber-200">em analise</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-rose-600 border-0 shadow-lg shadow-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Faltantes</CardTitle>
            <div className="rounded-lg bg-white/20 p-2">
              <AlertCircle className="size-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pendingTypes.length}</div>
            <p className="text-sm text-red-200">a enviar</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentos Pendentes */}
      {pendingTypes.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <AlertCircle className="size-5" />
              Documentos Pendentes
            </CardTitle>
            <CardDescription className="text-amber-300/70">
              Os seguintes documentos ainda precisam ser enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {pendingTypes.map((docType) => {
                const Icon = docType.icon
                return (
                  <div 
                    key={docType.type}
                    className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Icon className="size-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{docType.name}</p>
                        <p className="text-xs text-slate-500">{docType.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 bg-transparent">
                      <Upload className="size-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos Enviados */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Documentos Enviados</CardTitle>
          <CardDescription className="text-slate-400">Historico de todos os documentos enviados</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">Nenhum documento enviado ainda</p>
              <p className="text-sm text-slate-500">Envie seus documentos para completar seu cadastro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => {
                const docTypeInfo = documentTypes.find(dt => dt.type === doc.type)
                const Icon = docTypeInfo?.icon || FileText
                
                return (
                  <div 
                    key={doc.id} 
                    className={`p-4 rounded-lg border transition-all ${
                      doc.is_verified 
                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' 
                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          doc.is_verified ? 'bg-emerald-500/20' : 'bg-slate-800'
                        }`}>
                          <Icon className={`size-6 ${
                            doc.is_verified ? 'text-emerald-400' : 'text-slate-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{doc.name}</p>
                            {doc.is_verified ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <CheckCircle className="size-3 mr-1" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                <Clock className="size-3 mr-1" />
                                Em analise
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            {docTypeInfo?.name || doc.type}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>Enviado em {formatDate(doc.created_at)}</span>
                            {doc.is_verified && doc.verified_by_name && (
                              <span className="text-emerald-400">
                                Verificado por {doc.verified_by_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                          <Download className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de Documentos Aceitos */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tipos de Documentos Aceitos</CardTitle>
          <CardDescription className="text-slate-400">Formatos: PDF, JPG, PNG (max. 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((docType) => {
              const Icon = docType.icon
              const isUploaded = uploadedTypes.has(docType.type)
              const isVerified = documents.some((d: any) => d.type === docType.type && d.is_verified)
              
              return (
                <div 
                  key={docType.type}
                  className={`p-4 rounded-lg border transition-all ${
                    isVerified 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : isUploaded 
                        ? 'bg-blue-500/10 border-blue-500/30' 
                        : 'bg-slate-900/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`size-6 ${
                      isVerified ? 'text-emerald-400' :
                      isUploaded ? 'text-blue-400' :
                      'text-slate-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-white">{docType.name}</p>
                    </div>
                    {isVerified && <CheckCircle className="size-5 text-emerald-400" />}
                    {isUploaded && !isVerified && <Clock className="size-5 text-blue-400" />}
                  </div>
                  <p className="text-xs text-slate-500">{docType.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
