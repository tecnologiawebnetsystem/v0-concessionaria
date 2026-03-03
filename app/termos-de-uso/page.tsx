import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso - GT Veículos",
  description: "Termos de Uso do site da GT Veículos. Leia as condições de uso dos nossos serviços digitais.",
}

const secoes = [
  {
    titulo: "1. Aceitação dos Termos",
    conteudo: `Ao acessar e utilizar o site da GT Veículos (gtveiculos.com.br), você concorda com os presentes Termos de Uso. Se não concordar com alguma condição aqui estabelecida, pedimos que não utilize nosso site. A GT Veículos reserva o direito de alterar estes termos a qualquer momento, sendo as mudanças comunicadas por meio do próprio site.`,
  },
  {
    titulo: "2. Uso do Site",
    conteudo: `Nosso site destina-se ao uso pessoal e não comercial para consulta de informações sobre veículos, serviços e canais de contato da GT Veículos. É vedado:

• Reproduzir, distribuir ou comercializar conteúdo do site sem autorização expressa
• Realizar scraping automatizado ou coleta massiva de dados
• Utilizar o site para fins ilegais ou que violem direitos de terceiros
• Tentar comprometer a segurança, integridade ou disponibilidade do site
• Enviar spam, vírus ou qualquer código malicioso por nossos canais de contato`,
  },
  {
    titulo: "3. Informações sobre Veículos",
    conteudo: `As informações sobre veículos disponíveis no site (fotos, descrições, preços, quilometragem) são fornecidas de boa-fé e atualizadas regularmente. Contudo:

• Fotos podem não representar exatamente o estado atual do veículo
• Preços estão sujeitos a alterações sem aviso prévio
• A disponibilidade do veículo deve ser confirmada diretamente com nossa equipe
• Pequenas imprecisões de digitação não constituem oferta vinculante

Recomendamos sempre confirmar as informações antes de tomar decisões de compra.`,
  },
  {
    titulo: "4. Formulários e Solicitações",
    conteudo: `Ao preencher formulários em nosso site ou entrar em contato pelo WhatsApp, você autoriza que nossa equipe entre em contato com você pelos canais informados para responder sua solicitação. O recebimento de uma solicitação não constitui confirmação de disponibilidade do veículo ou aprovação de crédito.`,
  },
  {
    titulo: "5. Propriedade Intelectual",
    conteudo: `Todo o conteúdo do site, incluindo textos, imagens, logotipos, layout e código-fonte, é de propriedade da GT Veículos ou de seus licenciantes e está protegido pelas leis de propriedade intelectual aplicáveis. É proibida a reprodução parcial ou total sem autorização prévia por escrito.`,
  },
  {
    titulo: "6. Links para Sites de Terceiros",
    conteudo: `Nosso site pode conter links para sites de terceiros (bancos, seguradoras, parceiros). A GT Veículos não é responsável pelo conteúdo, políticas de privacidade ou práticas desses sites. O acesso a sites de terceiros é por conta e risco do usuário.`,
  },
  {
    titulo: "7. Limitação de Responsabilidade",
    conteudo: `A GT Veículos não se responsabiliza por:

• Indisponibilidade temporária do site por manutenção ou problemas técnicos
• Danos causados pelo uso indevido das informações disponíveis no site
• Decisões tomadas com base exclusiva nas informações do site sem confirmação prévia
• Ações de terceiros que possam comprometer a segurança do usuário

O site é fornecido "como está", sem garantias expressas ou implícitas de funcionamento ininterrupto.`,
  },
  {
    titulo: "8. Privacidade",
    conteudo: `O tratamento de dados pessoais realizado pela GT Veículos está descrito em nossa Política de Privacidade, disponível em gtveiculos.com.br/politica-de-privacidade. Recomendamos a leitura atenta deste documento.`,
  },
  {
    titulo: "9. Alterações nos Termos",
    conteudo: `Estes Termos de Uso podem ser atualizados a qualquer momento. A versão vigente estará sempre disponível nesta página, com a data da última atualização. O uso continuado do site após alterações implica a aceitação dos novos termos.`,
  },
  {
    titulo: "10. Legislação Aplicável e Foro",
    conteudo: `Estes Termos de Uso são regidos pelas leis brasileiras. Para a resolução de quaisquer controvérsias decorrentes deste instrumento, fica eleito o Foro da Comarca de Taubaté-SP, com exclusão de qualquer outro, por mais privilegiado que seja.`,
  },
  {
    titulo: "11. Contato",
    conteudo: `Para dúvidas sobre estes Termos de Uso:

E-mail: contato@gtveiculos.com.br
WhatsApp: (12) 97406-3079
Endereço: Av. Independência, 1500, Taubaté-SP, 12010-000`,
  },
]

export default function TermosUsoPage() {
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
              Termos de Uso
            </h1>
            <p className="mt-4 text-gray-400">
              Última atualização: 1º de março de 2025
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
              Estes Termos de Uso regulam o acesso e a utilização do site da GT Veículos.
              Leia atentamente antes de utilizar nossos serviços digitais.
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
