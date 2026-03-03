import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Car,
  Phone,
  FileText,
  Star,
  TrendingUp,
  Camera,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Avaliação Gratuita de Veículo - GT Veículos Taubaté",
  description:
    "Avalie gratuitamente seu veículo na GT Veículos. Laudos precisos, processo transparente e o melhor valor de mercado para o seu carro em Taubaté.",
  keywords: "avaliação veículo taubaté, avaliar carro, vender carro taubaté, laudo veicular GT veículos",
}

const etapas = [
  { icon: Phone, num: "01", titulo: "Agende pelo WhatsApp", desc: "Entre em contato e informe o modelo, ano e quilometragem do seu veículo." },
  { icon: Camera, num: "02", titulo: "Análise visual e mecânica", desc: "Nossa equipe faz uma vistoria completa em mais de 100 pontos do veículo." },
  { icon: TrendingUp, num: "03", titulo: "Pesquisa de mercado", desc: "Consultamos tabelas FIPE e preços praticados na região para oferecer o valor justo." },
  { icon: ClipboardList, num: "04", titulo: "Laudo e proposta", desc: "Você recebe o laudo completo e nossa melhor proposta para compra ou troca." },
]

const pontos = [
  "Motor e transmissão", "Sistema de freios", "Suspensão e direção",
  "Lataria e pintura", "Interior e painel", "Ar-condicionado",
  "Sistema elétrico", "Pneus e rodas", "Histórico de revisões",
  "Verificação de leilão", "Alienação e multas", "Checagem do chassi",
]

const diferenciais = [
  { titulo: "Avaliação 100% gratuita", desc: "Sem custo algum para você. A avaliação não gera nenhuma obrigação de venda." },
  { titulo: "Laudo detalhado", desc: "Você recebe um relatório completo com o estado real do seu veículo." },
  { titulo: "Pagamento imediato", desc: "Se optar pela venda, o pagamento é realizado no mesmo dia, sem enrolação." },
  { titulo: "Transparência total", desc: "Mostramos exatamente como chegamos ao valor oferecido, ponto a ponto." },
]

export default function AvaliacaoPage() {
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
                Avaliação Gratuita
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight text-balance">
                Descubra quanto
                <span className="block text-red-500">seu carro vale</span>
                <span className="block text-gray-400">de verdade.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Avaliação gratuita, laudo completo e o melhor preço do mercado.
                Na GT Veículos, você sabe exatamente o que tem nas mãos.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <a href="https://wa.me/5512974063079?text=Quero%20avaliar%20meu%20ve%C3%ADculo%20gratuitamente." target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Agendar Avaliação
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

        {/* COMO FUNCIONA */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Processo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Como funciona a
                <span className="text-red-500"> avaliação.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {etapas.map((e, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                      <e.icon className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-4xl font-black text-gray-800 leading-none">{e.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{e.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 100 PONTOS */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                  Vistoria Completa
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance leading-tight">
                  Vistoria em
                  <span className="text-red-500"> 100+ pontos.</span>
                </h2>
                <p className="mt-6 text-gray-400 leading-relaxed text-lg">
                  Nossa equipe técnica verifica cada detalhe do seu veículo com rigor profissional.
                  Nada passa despercebido — do motor à documentação.
                </p>
                <Button asChild size="lg" className="mt-8 bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-semibold">
                  <a href="https://wa.me/5512974063079?text=Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer">
                    Agendar agora
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pontos.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-red-600/40 transition-colors">
                    <CheckCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <span className="text-gray-300 text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Nossos Diferenciais
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Por que avaliar
                <span className="text-red-500"> com a GT?</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {diferenciais.map((d, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mb-4">
                    <span className="text-white font-black text-sm">0{i + 1}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{d.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
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
              Avaliação Gratuita
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-balance">
              Saiba o valor real
              <span className="block text-red-500">do seu veículo.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Sem compromisso, sem custo. Agende agora pelo WhatsApp e nossa equipe
              cuida de tudo.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <a href="https://wa.me/5512974063079?text=Quero%20avaliar%20meu%20ve%C3%ADculo" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Agendar pelo WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 h-14 px-8 font-semibold">
                <Link href="/contato">Outras formas de contato</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}
