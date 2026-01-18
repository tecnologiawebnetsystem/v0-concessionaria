import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
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
  Shield
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getSellerProfile(userId: string) {
  const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`
  const [seller] = await sql`SELECT * FROM sellers WHERE user_id = ${userId}`
  
  // Estatísticas do vendedor
  let stats = null
  if (seller) {
    const [salesStats] = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(final_price), 0) as total_value,
        COALESCE(SUM(commission_value), 0) as total_commission
      FROM sales
      WHERE seller_id = ${seller.id}
      AND status IN ('approved', 'completed')
    `
    
    const [goalsStats] = await sql`
      SELECT 
        COUNT(CASE WHEN achieved_quantity >= goal_quantity THEN 1 END) as achieved,
        COUNT(*) as total
      FROM sales_goals
      WHERE seller_id = ${seller.id}
      AND goal_quantity > 0
    `
    
    stats = {
      totalSales: Number(salesStats?.total_sales) || 0,
      totalValue: Number(salesStats?.total_value) || 0,
      totalCommission: Number(salesStats?.total_commission) || 0,
      goalsAchieved: Number(goalsStats?.achieved) || 0,
      goalsTotal: Number(goalsStats?.total) || 0
    }
  }

  return { user, seller, stats }
}

export default async function SellerProfilePage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { user, seller, stats } = await getSellerProfile(session.userId)

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuário não encontrado</p>
      </div>
    )
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Visualize e gerencie suas informações</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card Principal do Perfil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="size-24">
                <AvatarFallback className="bg-emerald-600 text-white text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <Badge className="bg-emerald-500">Vendedor</Badge>
                </div>
                <CardDescription className="mt-1">{user.email}</CardDescription>
                {seller?.hire_date && (
                  <p className="text-sm text-gray-500 mt-2">
                    <Calendar className="size-4 inline mr-1" />
                    Na empresa desde {formatDate(seller.hire_date)}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="size-5 text-emerald-600" />
                Dados Pessoais
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="size-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="size-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Telefone</p>
                    <p className="font-medium">{user.phone || 'Não informado'}</p>
                  </div>
                </div>
                {seller && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">CPF</p>
                        <p className="font-medium">{seller.cpf || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">RG</p>
                        <p className="font-medium">{seller.rg || 'Não informado'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            {seller && (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="size-5 text-emerald-600" />
                    Endereço
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{seller.address || 'Endereço não informado'}</p>
                    {(seller.city || seller.state || seller.zip_code) && (
                      <p className="text-gray-600">
                        {[seller.city, seller.state, seller.zip_code].filter(Boolean).join(' - ')}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Dados Bancários */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="size-5 text-emerald-600" />
                    Dados Bancários
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Banco</p>
                        <p className="font-medium">{seller.bank_name || 'Não informado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Agência / Conta</p>
                        <p className="font-medium">
                          {seller.bank_agency && seller.bank_account 
                            ? `${seller.bank_agency} / ${seller.bank_account}`
                            : 'Não informado'}
                        </p>
                      </div>
                    </div>
                    {seller.pix_key && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                        <div className="size-5 flex items-center justify-center text-gray-400 font-bold text-xs">
                          PIX
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Chave PIX</p>
                          <p className="font-medium">{seller.pix_key}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contato de Emergência */}
                {(seller.emergency_contact || seller.emergency_phone) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="size-5 text-emerald-600" />
                      Contato de Emergência
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{seller.emergency_contact || 'Não informado'}</p>
                      <p className="text-gray-600">{seller.emergency_phone || ''}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar com Estatísticas e Informações */}
        <div className="space-y-6">
          {/* Card de Comissão */}
          {seller && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                  <Percent className="size-4" />
                  Taxa de Comissão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-emerald-700">{seller.commission_rate}%</div>
                <p className="text-sm text-emerald-600">Sobre cada venda realizada</p>
                {Number(seller.base_salary) > 0 && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <p className="text-xs text-emerald-600">Salário Base</p>
                    <p className="text-lg font-semibold text-emerald-700">
                      {formatCurrency(Number(seller.base_salary))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Vendas</span>
                  <span className="font-bold text-xl">{stats.totalSales}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Total Vendido</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(stats.totalValue)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Comissões Ganhas</span>
                  <span className="font-bold text-amber-600">
                    {formatCurrency(stats.totalCommission)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Metas Atingidas</span>
                  <span className="font-bold">
                    {stats.goalsAchieved} / {stats.goalsTotal}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="size-5" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Gerencie seus documentos pessoais e contratuais
              </p>
              <Button asChild className="w-full">
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
