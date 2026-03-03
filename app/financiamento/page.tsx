import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Users,
  TrendingUp,
  Phone,
  FileText,
  Percent,
  Calendar,
  Star,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financiamento de Veículos - GT Veículos Taubaté",
  description:
    "Financie seu próximo veículo com as melhores condições do mercado. Aprovação rápida, parcelas que cabem no bolso e atendimento personalizado na GT Veículos em Taubaté.",
  keywords: "financiamento veículos taubaté, financiar carro, parcelas veículos, crédito auto GT veículos",
}

const vantagens = [
  { icon: Clock, title: "Aprovação em 24h", desc: "Análise rápida de crédito para você não perder o veículo dos sonhos." },
  { icon: Percent, title: "Melhores Taxas", desc: "Trabalhamos com os principais bancos para garantir a menor taxa para o seu perfil." },
  { icon: Users, title: "Todos os Perfis", desc: "Atendemos negativados, autônomos, MEIs e servidores públicos." },
  { icon: Shield, title: "Processo Seguro", desc: "Toda a documentação tratada com sigilo e transparência total." },
]

const bancos = [
  "Banco do Brasil", "Bradesco Financiamentos", "Santander Auto",
  "Itaú Unibanco", "Caixa Econômica Federal", "BV Financeira",
]

const etapas = [
  { num: "01", titulo: "Escolha seu veículo", desc: "Navegue pelo nosso estoque e encontre o carro ideal para você." },
  { num: "02", titulo: "Envie seus documentos", desc: "RG, CPF, comprovante de renda e residência. Pode ser pelo WhatsApp." },
  { num: "03", titulo: "Análise de crédito", desc: "Nossa equipe submete sua proposta aos bancos parceiros simultaneamente." },
  { num: "04", titulo: "Aprovação e contrato", desc: "Com a aprovação em mãos, assinamos o contrato e entregamos seu veículo." },
]

const perguntas = [
  {
    q: "Qual a entrada mínima para financiamento?",
    a: "Em geral, a entrada mínima é de 10% a 20% do valor do veículo, dependendo do seu perfil de crédito e do banco escolhido. Trabalhamos para encontrar a melhor condição para você.",
  },
  {
    q: "Posso financiar mesmo com restrição no CPF?",
    a: "Sim! Trabalhamos com linhas de crédito específicas para negativados. O financiamento pode ser aprovado com entrada maior ou com garantias adicionais.",
  },
  {
    q: "Em quantas parcelas posso financiar?",
    a: "O prazo varia de 12 a 60 meses, dependendo do valor do veículo e do banco. Quanto maior o prazo, menor a parcela mensal.",
  },
  {
    q: "Posso usar meu carro atual como entrada?",
    a: "Sim! Avaliamos seu veículo gratuitamente e o valor pode ser usado como entrada no financiamento do novo carro.",
  },
]

export default function FinanciamentoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black font-sans">
      <PublicHeader />
      <WhatsAppFloat />

      <main className="flex-1">

        {/* HERO */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.15),transparent_60%)]" />
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />

          <div className="relative container mx-auto px-6 max-w-7xl py-24">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs font-semibold px-4 py-1.5">
                Financiamento Facilitado
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight text-balance">
                Seu carro novo
                <span className="block text-red-500">sem complicação.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Aprovação rápida, as melhores taxas do mercado e parcelas que cabem no seu bolso.
                A GT Veículos cuida de tudo para você sair de carro novo.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <a href="https://wa.me/5512974063079?text=Ol%C3%A1!%20Tenho%20interesse%20em%20financiamento." target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Simular Financiamento
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 h-14 px-8 text-base font-semibold">
                  <Link href="/veiculos">
                    Ver Estoque
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* VANTAGENS */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Por que financiar conosco
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Vantagens que fazem
                <span className="text-red-500"> a diferença.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vantagens.map((v, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                    <v.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{v.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Passo a Passo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Como funciona o
                <span className="text-red-500"> financiamento.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {etapas.map((e, i) => (
                <div key={i} className="relative">
                  {i < etapas.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-800 z-0" style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }} />
                  )}
                  <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-600/40 transition-colors z-10">
                    <span className="text-5xl font-black text-red-600/20 leading-none block mb-4">{e.num}</span>
                    <h3 className="text-white font-bold text-lg mb-2">{e.titulo}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANCOS PARCEIROS */}
        <section className="bg-gray-950 py-20 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Parceiros Financeiros
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Bancos parceiros</h2>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">Trabalhamos com os principais bancos do Brasil para oferecer a melhor taxa para o seu perfil.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {bancos.map((banco, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-center text-center hover:border-red-600/40 transition-colors">
                  <span className="text-gray-300 text-sm font-semibold">{banco}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOCUMENTOS NECESSÁRIOS */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                  Documentação
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                  O que você
                  <span className="text-red-500"> precisa ter.</span>
                </h2>
                <p className="mt-6 text-gray-400 leading-relaxed">
                  Para iniciar seu financiamento, separe os documentos abaixo. Todo o processo pode
                  ser feito remotamente pelo WhatsApp — sem precisar sair de casa.
                </p>
                <Button asChild size="lg" className="mt-8 bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-semibold">
                  <a href="https://wa.me/5512974063079?text=Quero%20financiar%20um%20ve%C3%ADculo" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Iniciar pelo WhatsApp
                  </a>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "RG ou CNH (frente e verso)",
                  "CPF",
                  "Comprovante de residência recente",
                  "Comprovante de renda (3 últimos meses)",
                  "Declaração de IR (se autônomo)",
                  "Extrato bancário (3 meses)",
                  "Certidão de casamento (se casado)",
                  "Foto 3x4 ou selfie",
                ].map((doc, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-red-600/40 transition-colors">
                    <FileText className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PERGUNTAS FREQUENTES */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                FAQ
              </Badge>
              <h2 className="text-4xl font-extrabold text-white">Perguntas frequentes</h2>
            </div>
            <div className="space-y-4">
              {perguntas.map((p, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                  <h3 className="text-white font-bold mb-2 flex items-start gap-3">
                    <span className="text-red-500 text-lg leading-none mt-0.5">Q.</span>
                    {p.q}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed pl-7">{p.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-black py-24 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="absolute right-0 top-0 h-full w-1 bg-red-600" />
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <Badge className="mb-6 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs font-semibold px-4 py-1.5">
              Comece agora
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-balance">
              Pronto para sair
              <span className="block text-red-500">de carro novo?</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Fale com nossa equipe agora mesmo pelo WhatsApp e descubra qual é o melhor
              financiamento para o seu perfil.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <a href="https://wa.me/5512974063079?text=Quero%20financiar%20um%20ve%C3%ADculo" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Simular agora no WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 h-14 px-8 font-semibold">
                <Link href="/veiculos">Ver Estoque</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
