import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, UserCheck, Mail, Phone } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LGPD - Lei Geral de Proteção de Dados - GT Veículos",
  description:
    "Saiba como a GT Veículos está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e como exercer seus direitos como titular.",
  keywords: "LGPD GT veículos, proteção de dados, titular de dados, DPO concessionária taubaté",
}

const direitos = [
  { icon: Eye, titulo: "Acesso", desc: "Confirmar se tratamos seus dados e acessar uma cópia das informações que mantemos sobre você." },
  { icon: UserCheck, titulo: "Correção", desc: "Solicitar a correção de dados incompletos, inexatos ou desatualizados." },
  { icon: Lock, titulo: "Eliminação", desc: "Solicitar a exclusão dos seus dados pessoais, nos casos previstos em lei." },
  { icon: Shield, titulo: "Portabilidade", desc: "Solicitar a portabilidade dos seus dados para outro prestador de serviço ou produto." },
]

const secoes = [
  {
    titulo: "O que é a LGPD",
    conteudo: `A Lei Geral de Proteção de Dados (Lei nº 13.709/2018), conhecida como LGPD, é a legislação brasileira que regulamenta o tratamento de dados pessoais por pessoas físicas e jurídicas, tanto no setor público quanto no privado.

A LGPD entrou em vigor em setembro de 2020 e estabelece princípios, direitos dos titulares, obrigações para as organizações e sanções em caso de descumprimento. Seu objetivo central é proteger os direitos fundamentais de liberdade e privacidade dos cidadãos brasileiros.`,
  },
  {
    titulo: "Como a GT Veículos aplica a LGPD",
    conteudo: `A GT Veículos está comprometida com a conformidade à LGPD e adota as seguintes práticas:

• Coletamos apenas os dados estritamente necessários para cada finalidade (princípio da minimização)
• Informamos claramente para que usaremos seus dados antes de coletá-los
• Obtemos seu consentimento quando necessário, de forma livre, inequívoca e informada
• Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados
• Treinamos nossa equipe sobre boas práticas de privacidade e segurança da informação
• Mantemos registros das atividades de tratamento de dados pessoais
• Designamos um Encarregado de Proteção de Dados (DPO) para atender solicitações dos titulares`,
  },
  {
    titulo: "Bases legais que utilizamos",
    conteudo: `Todo tratamento de dados pessoais pela GT Veículos é realizado com base em ao menos uma das hipóteses legais previstas no Art. 7º da LGPD:

• Consentimento do titular (ex.: envio de newsletters e comunicações de marketing)
• Execução de contrato (ex.: processamento de compra e financiamento)
• Cumprimento de obrigação legal ou regulatória (ex.: emissão de notas fiscais, obrigações tributárias)
• Exercício regular de direitos (ex.: resposta a processos judiciais)
• Interesse legítimo (ex.: análise de navegação para melhorias no site, prevenção a fraudes)`,
  },
  {
    titulo: "Encarregado de Dados (DPO)",
    conteudo: `A GT Veículos designou um Encarregado de Proteção de Dados (Data Protection Officer — DPO), responsável por:

• Receber comunicações dos titulares de dados
• Orientar funcionários e prestadores de serviço sobre práticas de proteção de dados
• Atuar como canal de comunicação com a Autoridade Nacional de Proteção de Dados (ANPD)

Para falar diretamente com nosso DPO, entre em contato pelo e-mail: dpo@gtveiculos.com.br`,
  },
  {
    titulo: "Incidentes de Segurança",
    conteudo: `Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a GT Veículos se compromete a:

• Comunicar o incidente à Autoridade Nacional de Proteção de Dados (ANPD) no prazo legal
• Notificar os titulares afetados de forma clara e tempestiva
• Adotar medidas corretivas imediatas para mitigar os efeitos do incidente
• Documentar o ocorrido e as ações tomadas

Para reportar suspeitas de incidentes envolvendo seus dados, entre em contato pelo e-mail: seguranca@gtveiculos.com.br`,
  },
  {
    titulo: "Transferência Internacional de Dados",
    conteudo: `Quando necessário transferir dados pessoais para fora do Brasil (ex.: uso de serviços de nuvem internacionais), a GT Veículos garante que a transferência ocorra somente para países com nível de proteção adequado ou mediante garantias contratuais equivalentes às exigidas pela LGPD.`,
  },
  {
    titulo: "Como exercer seus direitos",
    conteudo: `Para exercer qualquer dos seus direitos previstos na LGPD, entre em contato pelos canais abaixo. Responderemos sua solicitação em até 15 dias úteis:

E-mail: dpo@gtveiculos.com.br
WhatsApp: (12) 97406-3079
Presencialmente: Av. Independência, 1500, Taubaté-SP

Poderemos solicitar a verificação da sua identidade antes de atender a solicitação, para garantir a segurança dos seus dados.`,
  },
]

export default function LGPDPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black font-sans">
      <PublicHeader />

      <main className="flex-1">

        {/* HERO */}
        <section className="relative bg-black py-20 border-b border-gray-800">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="container mx-auto px-6 max-w-4xl">
            <Badge className="mb-4 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs font-semibold px-4 py-1.5">
              Privacidade & Dados
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
              LGPD — Proteção
              <span className="block text-red-500">de Dados Pessoais</span>
            </h1>
            <p className="mt-4 text-gray-400">
              Última atualização: 1º de março de 2025
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
              A GT Veículos está comprometida com a proteção dos seus dados pessoais e com
              o cumprimento integral da Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
            </p>
          </div>
        </section>

        {/* SEUS DIREITOS */}
        <section className="bg-gray-950 py-16 border-b border-gray-800">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-10">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Seus Direitos
              </Badge>
              <h2 className="text-3xl font-extrabold text-white">O que você pode solicitar</h2>
              <p className="text-gray-400 mt-2">Como titular de dados, a LGPD garante a você os seguintes direitos:</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {direitos.map((d, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4">
                    <d.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{d.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-semibold">
                <a href="mailto:dpo@gtveiculos.com.br">
                  <Mail className="h-5 w-5 mr-2" />
                  Exercer meus direitos
                </a>
              </Button>
              <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 h-12 px-8 font-semibold">
                <a href="https://wa.me/5512974063079?text=Tenho%20uma%20d%C3%BAvida%20sobre%20meus%20dados%20pessoais" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar com DPO
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* SEÇÕES */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-8">
              {secoes.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-white font-bold text-xl mb-4">{s.titulo}</h2>
                  <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.conteudo}</div>
                </div>
              ))}
            </div>

            {/* Nota ANPD */}
            <div className="mt-10 bg-red-600/10 border border-red-600/30 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-2">Autoridade Nacional de Proteção de Dados (ANPD)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Se você acredita que seus direitos foram violados e a GT Veículos não respondeu adequadamente
                à sua solicitação, você tem o direito de apresentar uma reclamação diretamente à ANPD,
                através do site oficial: <span className="text-red-400">www.gov.br/anpd</span>
              </p>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
