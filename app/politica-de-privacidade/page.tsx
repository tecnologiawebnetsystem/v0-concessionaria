import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade - GT Veículos",
  description: "Política de Privacidade da GT Veículos. Saiba como coletamos, usamos e protegemos seus dados pessoais.",
}

const secoes = [
  {
    titulo: "1. Quem somos",
    conteudo: `A GT Veículos, inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na Av. Independência, 1500, Taubaté-SP, é a controladora dos dados pessoais coletados por meio de nosso site e canais de atendimento. Em caso de dúvidas sobre esta política, entre em contato pelo e-mail: privacidade@gtveiculos.com.br.`,
  },
  {
    titulo: "2. Quais dados coletamos",
    conteudo: `Coletamos os seguintes tipos de dados pessoais:

• Dados de identificação: nome completo, CPF, RG, data de nascimento
• Dados de contato: e-mail, telefone, endereço
• Dados de navegação: endereço IP, tipo de dispositivo, páginas visitadas, tempo de permanência
• Dados financeiros: informações para análise de crédito, quando solicitadas para financiamento
• Dados de comunicação: mensagens enviadas pelo WhatsApp, formulários de contato ou e-mail

A coleta ocorre quando você preenche formulários em nosso site, entra em contato conosco, realiza uma visita à loja ou quando navega em nosso site.`,
  },
  {
    titulo: "3. Para que usamos seus dados",
    conteudo: `Utilizamos seus dados pessoais para as seguintes finalidades:

• Responder às suas solicitações de contato, informações ou orçamentos
• Processar propostas de financiamento e consórcio
• Enviar comunicações sobre promoções e novidades (com seu consentimento)
• Melhorar nossos serviços e experiência no site
• Cumprir obrigações legais e regulatórias
• Prevenir fraudes e garantir a segurança das transações`,
  },
  {
    titulo: "4. Base legal para o tratamento",
    conteudo: `O tratamento dos seus dados é fundamentado nas seguintes bases legais previstas na Lei nº 13.709/2018 (LGPD):

• Consentimento: quando você aceita receber comunicações de marketing
• Execução de contrato: para processar compras, financiamentos e demais transações
• Obrigação legal: quando exigido por legislação aplicável
• Interesse legítimo: para melhorias internas e prevenção de fraudes`,
  },
  {
    titulo: "5. Compartilhamento de dados",
    conteudo: `Seus dados podem ser compartilhados com:

• Instituições financeiras e bancos parceiros, para análise e concessão de crédito
• Seguradoras parceiras, quando solicitada cotação de seguro
• Prestadores de serviço tecnológico (hospedagem, e-mail, CRM), sob acordos de confidencialidade
• Autoridades governamentais, quando exigido por lei

Não vendemos nem cedemos seus dados para terceiros com fins publicitários sem seu consentimento explícito.`,
  },
  {
    titulo: "6. Por quanto tempo guardamos seus dados",
    conteudo: `Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Dados de clientes com contratos ativos são mantidos durante a vigência contratual e por 5 anos após o encerramento, conforme legislação fiscal e civil aplicável. Dados de contato e navegação são mantidos por até 2 anos.`,
  },
  {
    titulo: "7. Seus direitos",
    conteudo: `Em conformidade com a LGPD, você tem direito a:

• Confirmar a existência de tratamento dos seus dados
• Acessar seus dados pessoais
• Corrigir dados incompletos, inexatos ou desatualizados
• Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários
• Revogar o consentimento a qualquer momento
• Solicitar a portabilidade dos dados a outro fornecedor de serviço

Para exercer seus direitos, entre em contato pelo e-mail privacidade@gtveiculos.com.br ou pelo WhatsApp (12) 97406-3079.`,
  },
  {
    titulo: "8. Cookies e tecnologias de rastreamento",
    conteudo: `Nosso site utiliza cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o tráfego e personalizar conteúdos. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.`,
  },
  {
    titulo: "9. Segurança dos dados",
    conteudo: `Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados em trânsito, controle de acesso por perfil de usuário e monitoramento contínuo de segurança.`,
  },
  {
    titulo: "10. Alterações nesta política",
    conteudo: `Esta política pode ser atualizada periodicamente. Comunicaremos alterações relevantes por e-mail ou por aviso destacado em nosso site. A data da última atualização está indicada no início deste documento. O uso continuado dos nossos serviços após a comunicação de mudanças implica a aceitação da política revisada.`,
  },
  {
    titulo: "11. Contato",
    conteudo: `Para dúvidas, solicitações ou exercício dos seus direitos relacionados à privacidade:

E-mail: privacidade@gtveiculos.com.br
WhatsApp: (12) 97406-3079
Endereço: Av. Independência, 1500, Taubaté-SP, 12010-000`,
  },
]

export default function PoliticaPrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black font-sans">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative bg-black py-20 border-b border-gray-800">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="container mx-auto px-6 max-w-4xl">
            <Badge className="mb-4 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs font-semibold px-4 py-1.5">
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
              Política de Privacidade
            </h1>
            <p className="mt-4 text-gray-400">
              Última atualização: 1º de março de 2025
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
              Esta Política de Privacidade descreve como a GT Veículos coleta, usa, armazena e
              protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 — LGPD).
            </p>
          </div>
        </section>

        <section className="bg-gray-950 py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-10">
              {secoes.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-white font-bold text-xl mb-4">{s.titulo}</h2>
                  <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.conteudo}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
