import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
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

async function getSellerDocuments(userId: string) {
  const [seller] = await sql`SELECT * FROM sellers WHERE user_id = ${userId}`
  
  if (!seller) return { seller: null, documents: [] }

  const documents = await sql`
    SELECT sd.*, u.name as verified_by_name
    FROM seller_documents sd
    LEFT JOIN users u ON sd.verified_by = u.id
    WHERE sd.seller_id = ${seller.id}
    ORDER BY sd.created_at DESC
  `

  return { seller, documents }
}

const documentTypes = [
  { type: 'rg', name: 'RG', icon: CreditCard, description: 'Documento de identidade' },
  { type: 'cpf', name: 'CPF', icon: FileText, description: 'Cadastro de pessoa física' },
  { type: 'cnh', name: 'CNH', icon: Car, description: 'Carteira de habilitação' },
  { type: 'comprovante_residencia', name: 'Comprovante de Residência', icon: Home, description: 'Conta de luz, água ou gás' },
  { type: 'contrato', name: 'Contrato de Trabalho', icon: FileCheck, description: 'Contrato assinado' },
  { type: 'certidao_nascimento', name: 'Certidão de Nascimento', icon: File, description: 'Certidão original ou cópia' },
  { type: 'titulo_eleitor', name: 'Título de Eleitor', icon: FileText, description: 'Documento eleitoral' },
  { type: 'certificado_reservista', name: 'Certificado de Reservista', icon: FileText, description: 'Para homens' },
]

export default async function SellerDocumentsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { seller, documents } = await getSellerDocuments(session.userId)

  if (!seller) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Perfil de vendedor não encontrado</p>
      </div>
    )
  }

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR')

  // Agrupar documentos por tipo
  const documentsByType = documents.reduce((acc: any, doc: any) => {
    if (!acc[doc.type]) acc[doc.type] = []
    acc[doc.type].push(doc)
    return acc
  }, {})

  // Verificar quais documentos estão pendentes
  const uploadedTypes = new Set(documents.map((d: any) => d.type))
  const pendingTypes = documentTypes.filter(dt => !uploadedTypes.has(dt.type))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Documentos</h1>
        <p className="text-gray-600">Gerencie seus documentos pessoais e contratuais</p>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <FileText className="size-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-gray-500">documentos enviados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verificados</CardTitle>
            <CheckCircle className="size-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {documents.filter((d: any) => d.is_verified).length}
            </div>
            <p className="text-xs text-gray-500">aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            <Clock className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {documents.filter((d: any) => !d.is_verified).length}
            </div>
            <p className="text-xs text-gray-500">em análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Faltantes</CardTitle>
            <AlertCircle className="size-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingTypes.length}</div>
            <p className="text-xs text-gray-500">a enviar</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentos Pendentes */}
      {pendingTypes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="size-5" />
              Documentos Pendentes
            </CardTitle>
            <CardDescription className="text-amber-700">
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
                    className="p-4 bg-white border border-amber-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-8 text-amber-500" />
                      <div>
                        <p className="font-medium text-gray-900">{docType.name}</p>
                        <p className="text-xs text-gray-500">{docType.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
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
      <Card>
        <CardHeader>
          <CardTitle>Documentos Enviados</CardTitle>
          <CardDescription>Histórico de todos os documentos enviados</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum documento enviado ainda</p>
              <p className="text-sm text-gray-400">Envie seus documentos para completar seu cadastro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc: any) => {
                const docTypeInfo = documentTypes.find(dt => dt.type === doc.type)
                const Icon = docTypeInfo?.icon || FileText
                const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date()
                
                return (
                  <div 
                    key={doc.id} 
                    className={`p-4 border rounded-lg ${
                      isExpired ? 'bg-red-50 border-red-200' :
                      doc.is_verified ? 'bg-emerald-50 border-emerald-200' :
                      'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          isExpired ? 'bg-red-100' :
                          doc.is_verified ? 'bg-emerald-100' :
                          'bg-gray-100'
                        }`}>
                          <Icon className={`size-6 ${
                            isExpired ? 'text-red-600' :
                            doc.is_verified ? 'text-emerald-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            {isExpired ? (
                              <Badge variant="destructive">Expirado</Badge>
                            ) : doc.is_verified ? (
                              <Badge className="bg-emerald-500">Verificado</Badge>
                            ) : (
                              <Badge variant="secondary">Em análise</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {docTypeInfo?.name || doc.type}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Enviado em {formatDate(doc.created_at)}</span>
                            {doc.expiry_date && (
                              <span className={isExpired ? 'text-red-600' : ''}>
                                Validade: {formatDate(doc.expiry_date)}
                              </span>
                            )}
                            {doc.is_verified && doc.verified_by_name && (
                              <span className="text-emerald-600">
                                <CheckCircle className="size-3 inline mr-1" />
                                Verificado por {doc.verified_by_name}
                              </span>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{doc.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Documentos Aceitos</CardTitle>
          <CardDescription>Formatos: PDF, JPG, PNG (máx. 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((docType) => {
              const Icon = docType.icon
              const isUploaded = uploadedTypes.has(docType.type)
              const docs = documentsByType[docType.type] || []
              const isVerified = docs.some((d: any) => d.is_verified)
              
              return (
                <div 
                  key={docType.type}
                  className={`p-4 border rounded-lg ${
                    isVerified ? 'bg-emerald-50 border-emerald-200' :
                    isUploaded ? 'bg-blue-50 border-blue-200' :
                    'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`size-6 ${
                      isVerified ? 'text-emerald-600' :
                      isUploaded ? 'text-blue-600' :
                      'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{docType.name}</p>
                    </div>
                    {isVerified && <CheckCircle className="size-5 text-emerald-500" />}
                    {isUploaded && !isVerified && <Clock className="size-5 text-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-500">{docType.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
