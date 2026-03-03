import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Phone,
  CheckCircle,
  TrendingUp,
  Shield,
  DollarSign,
  Calendar,
  Users,
  Lock,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Consórcio de Veículos - GT Veículos Taubaté",
  description:
    "Adquira seu veículo sem juros através do consórcio. A GT Veículos oferece planos flexíveis e assessoria completa para você realizar o sonho do carro próprio.",
  keywords: "consórcio veículos taubaté, consórcio carro sem juros, consórcio automotivo GT veículos",
}

const vantagens = [
  { icon: DollarSign, titulo: "Sem juros", desc: "No consórcio você paga apenas a taxa de administração, sem juros bancários, o que representa uma economia enorme." },
  { icon: Calendar, titulo: "Parcelas flexíveis", desc: "Escolha o prazo e o valor da carta de crédito que melhor se encaixam no seu planejamento financeiro." },
  { icon: TrendingUp, titulo: "Poder de negociação", desc: "Com a carta de crédito em mãos, você compra como se fosse à vista e negocia descontos." },
  { icon: Shield, titulo: "Regulado pelo Banco Central", desc: "O consórcio é regulamentado pelo Banco Central do Brasil, garantindo total segurança para você." },
]

const comparativo = [
  { item: "Juros", financiamento: "Sim (1% a 2,5% a.m.)", consorcio: "Não — apenas taxa adm." },
  { item: "Contemplação imediata", financiamento: "Sim", consorcio: "Por lance ou sorteio" },
  { item: "Custo total", financiamento: "Alto (correção+juros)", consorcio: "Baixo (só taxa adm.)" },
  { item: "Planejamento", financiamento: "Curto/médio prazo", consorcio: "Médio/longo prazo" },
  { item: "Poder de compra", financiamento: "Limitado", consorcio: "Carta de crédito total" },
]

const etapas = [
  { num: "01", titulo: "Escolha seu plano", desc: "Defina o valor da carta de crédito e o prazo ideal para o seu orçamento." },
  { num: "02", titulo: "Contrate conosco", desc: "Nossa equipe orienta na escolha do grupo e formaliza o contrato com transparência." },
  { num: "03", titulo: "Participe das assembleias", desc: "Mensalmente ocorrem sorteios. Você também pode dar lances para antecipar a contemplação." },
  { num: "04", titulo: "Use a carta de crédito", desc: "Contemplado, use sua carta para comprar o veículo que quiser, como se pagasse à vista." },
]

export default function ConsorcioPage() {
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
                Consórcio Automotivo
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight text-balance">
                Seu carro
                <span className="block text-red-500">sem pagar juros.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                O consórcio é a forma mais inteligente de planejar a compra do seu próximo veículo.
                Sem juros, sem surpresas e com total segurança.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <a href="https://wa.me/5512974063079?text=Tenho%20interesse%20em%20cons%C3%B3rcio%20de%20ve%C3%ADculo." target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Quero Saber Mais
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 h-14 px-8 text-base font-semibold">
                  <Link href="/financiamento">
                    Ver Financiamento
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
                Benefícios
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Por que escolher
                <span className="text-red-500"> o consórcio?</span>
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

        {/* CONSÓRCIO VS FINANCIAMENTO */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Comparativo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Consórcio vs.
                <span className="text-red-500"> Financiamento</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg mx-auto">Entenda as diferenças e escolha a opção que faz mais sentido para o seu momento.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Característica</th>
                    <th className="text-center px-6 py-4 text-gray-400 font-semibold text-sm">Financiamento</th>
                    <th className="text-center px-6 py-4 text-red-400 font-semibold text-sm">Consórcio</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativo.map((row, i) => (
                    <tr key={i} className={`border-t border-gray-800 ${i % 2 === 0 ? "bg-gray-950" : "bg-black"}`}>
                      <td className="px-6 py-4 text-gray-300 text-sm font-medium">{row.item}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm text-center">{row.financiamento}</td>
                      <td className="px-6 py-4 text-green-400 text-sm text-center font-medium">{row.consorcio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Passo a Passo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Como funciona
                <span className="text-red-500"> na prática.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {etapas.map((e, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/40 rounded-2xl p-6 transition-colors">
                  <span className="text-5xl font-black text-red-600/20 leading-none block mb-4">{e.num}</span>
                  <h3 className="text-white font-bold text-lg mb-2">{e.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{e.desc}</p>
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
              Planejamento inteligente
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-balance">
              Pronto para planejar
              <span className="block text-red-500">seu próximo carro?</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Fale com nossa equipe e descubra qual plano de consórcio é ideal para você.
              Atendimento personalizado, sem pressão.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <a href="https://wa.me/5512974063079?text=Quero%20saber%20mais%20sobre%20cons%C3%B3rcio" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar com especialista
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
