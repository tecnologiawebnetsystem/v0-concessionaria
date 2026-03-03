import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ArrowRight,
  Phone,
  CheckCircle,
  Car,
  FileText,
  AlertCircle,
  Wrench,
  Star,
  Lock,
  HeartPulse,
  Zap,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seguro Auto - GT Veículos Taubaté",
  description:
    "Proteja seu veículo com as melhores seguradoras do Brasil. A GT Veículos oferece cotação gratuita e assessoria completa para você ter a melhor cobertura ao menor custo.",
  keywords: "seguro auto taubaté, seguro carro GT veículos, cotação seguro veículo, seguro automotivo taubaté",
}

const coberturas = [
  { icon: Car, titulo: "Colisão e Capotamento", desc: "Cobertura para danos ao seu veículo em caso de colisão, tombamento ou capotamento." },
  { icon: AlertCircle, titulo: "Roubo e Furto", desc: "Proteção completa contra roubo ou furto total e parcial do veículo." },
  { icon: Wrench, titulo: "Danos a Terceiros", desc: "Cobertura para danos materiais e corporais causados a terceiros em acidentes." },
  { icon: HeartPulse, titulo: "Acidentes Pessoais", desc: "Proteção para o condutor e passageiros em casos de morte ou invalidez por acidente." },
  { icon: Zap, titulo: "Fenômenos Naturais", desc: "Cobertura para enchentes, granizo, raios e outros fenômenos da natureza." },
  { icon: Lock, titulo: "Carro Reserva", desc: "Veículo reserva disponível durante o período de reparo ou sinistro." },
]

const seguradoras = [
  "Porto Seguro", "Bradesco Seguros", "Allianz", "Zurich", "Tokio Marine", "Sompo Seguros",
]

const etapas = [
  { num: "01", titulo: "Cotação gratuita", desc: "Informamos os dados do seu veículo e perfil. Cotamos nas principais seguradoras simultaneamente." },
  { num: "02", titulo: "Comparativo de planos", desc: "Apresentamos as melhores opções com coberturas, franquias e valores comparados lado a lado." },
  { num: "03", titulo: "Você escolhe", desc: "Sem pressão. Você analisa e decide pelo plano que faz mais sentido para sua necessidade." },
  { num: "04", titulo: "Contratação simples", desc: "Contrato emitido na hora, com apólice digital e suporte da nossa equipe 24h." },
]

const perguntas = [
  {
    q: "O seguro cobre colisão com animais na pista?",
    a: "Sim, a maioria dos planos abrangentes cobre colisão com animais. É importante verificar as coberturas no momento da contratação.",
  },
  {
    q: "Posso incluir minha família como condutores?",
    a: "Sim. A maioria das seguradoras permite incluir cônjuge e filhos como condutores habituais, o que pode influenciar o valor do prêmio.",
  },
  {
    q: "O que é franquia e como funciona?",
    a: "A franquia é o valor que você paga em caso de sinistro. Franquias maiores resultam em prêmios mensais menores. Nossa equipe ajuda a encontrar o equilíbrio ideal.",
  },
  {
    q: "O seguro cobre equipamentos como som e rodas especiais?",
    a: "Acessórios especiais precisam ser declarados e incluídos na apólice. Nossa equipe orienta sobre quais itens devem ser listados.",
  },
]

export default function SeguroPage() {
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
                Seguro Auto
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight text-balance">
                Proteja o que
                <span className="block text-red-500">você conquistou.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Cotação gratuita nas principais seguradoras do Brasil.
                Encontramos a melhor cobertura pelo menor preço para o seu veículo.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <a href="https://wa.me/5512974063079?text=Quero%20cotar%20seguro%20para%20meu%20ve%C3%ADculo." target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Cotar Gratuitamente
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

        {/* COBERTURAS */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Coberturas Disponíveis
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Proteção completa
                <span className="text-red-500"> para seu veículo.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coberturas.map((c, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                    <c.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{c.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
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
                Processo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Como funciona
                <span className="text-red-500"> a cotação.</span>
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

        {/* SEGURADORAS */}
        <section className="bg-gray-950 py-20 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Parceiros
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Seguradoras parceiras</h2>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">Cotamos nas maiores e mais conceituadas seguradoras do Brasil para garantir o melhor custo-benefício.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {seguradoras.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-center text-center hover:border-red-600/40 transition-colors">
                  <span className="text-gray-300 text-sm font-semibold">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">FAQ</Badge>
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
        <section className="relative bg-black py-24 overflow-hidden border-t border-gray-800">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="absolute right-0 top-0 h-full w-1 bg-red-600" />
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-balance">
              Proteja seu veículo
              <span className="block text-red-500">hoje mesmo.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Cotação gratuita, sem compromisso. Nossa equipe encontra a melhor cobertura para você.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <a href="https://wa.me/5512974063079?text=Quero%20cotar%20seguro%20auto" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Cotar agora no WhatsApp
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
