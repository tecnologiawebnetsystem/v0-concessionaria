import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Award,
  Users,
  Car,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap,
  Phone,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nós - GT Veículos Taubaté",
  description:
    "Conheça a história da GT Veículos, concessionária referência em Taubaté com mais de 10 anos de experiência no mercado automotivo. Missão, valores e nossa equipe.",
  keywords: "sobre GT veículos, concessionária taubaté história, quem somos GT veículos",
}

const stats = [
  { value: "10+", label: "Anos de Experiência", icon: Clock },
  { value: "5.000+", label: "Clientes Atendidos", icon: Users },
  { value: "500+", label: "Veículos Vendidos/Ano", icon: Car },
  { value: "4.9", label: "Avaliação Média", icon: Star },
]

const valores = [
  {
    icon: Heart,
    title: "Paixão por Carros",
    desc: "Amamos o que fazemos. Cada veículo é tratado com o mesmo cuidado que daríamos ao nosso próprio carro.",
  },
  {
    icon: Shield,
    title: "Transparência Total",
    desc: "Nenhuma surpresa. Nossos preços são claros, os históricos dos veículos são completos e você compra com segurança.",
  },
  {
    icon: Award,
    title: "Excelência no Atendimento",
    desc: "Nossa equipe é treinada para ouvir, entender e encontrar o veículo perfeito para o seu perfil e orçamento.",
  },
  {
    icon: TrendingUp,
    title: "Compromisso com o Futuro",
    desc: "Investimos em tecnologia, sustentabilidade e na satisfação duradoura de cada cliente que passa por nossas portas.",
  },
]

const diferenciais = [
  "Vistoria completa em 100+ pontos em todos os veículos",
  "Financiamento aprovado para todos os perfis de crédito",
  "Garantia de 3 meses em todos os veículos do estoque",
  "Documentação e transferência sem burocracia",
  "Avaliação gratuita do seu veículo na troca",
  "Pós-venda ativo: acompanhamos você após a compra",
  "Estoque atualizado diariamente na plataforma digital",
  "Atendimento presencial e online 7 dias por semana",
]

const equipe = [
  { nome: "Gabriel Torres", cargo: "Fundador & Diretor Geral", exp: "15 anos no mercado automotivo" },
  { nome: "Tatiana Rocha", cargo: "Gerente Comercial", exp: "Especialista em financiamento" },
  { nome: "Rafael Mendes", cargo: "Consultor de Vendas Senior", exp: "8 anos de experiência" },
  { nome: "Juliana Costa", cargo: "Atendimento & Pós-Venda", exp: "Foco em satisfação do cliente" },
]

const timeline = [
  { ano: "2013", titulo: "A Fundação", desc: "Gabriel Torres abre as portas da GT Veículos com um estoque de 12 carros e um sonho grande em Taubaté." },
  { ano: "2016", titulo: "Crescimento", desc: "Atingimos 100 veículos no estoque e inauguramos a nova sede com showroom moderno na Av. Charles Schnneider." },
  { ano: "2019", titulo: "Premiação Regional", desc: "Reconhecidos como melhor concessionária multimarca do Vale do Paraíba por 3 anos consecutivos." },
  { ano: "2022", titulo: "Plataforma Digital", desc: "Lançamos nossa plataforma online, permitindo que clientes comprem e financiem 100% pelo celular." },
  { ano: "2025", titulo: "Hoje", desc: "Mais de 5.000 clientes satisfeitos, 500+ veículos/ano e a mesma paixão de sempre por conectar pessoas aos seus carros." },
]

export default function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black font-sans">
      <PublicHeader />
      <WhatsAppFloat />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <Image
              src="/images/sobre-showroom.jpg"
              alt="Showroom GT Veículos"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
          </div>

          {/* Linha vermelha vertical decorativa */}
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />

          <div className="relative container mx-auto px-6 max-w-7xl">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs font-semibold px-4 py-1.5">
                Nossa Historia
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-tight text-balance">
                Mais de uma
                <span className="block text-red-500">decada</span>
                <span className="block text-gray-400">movendo vidas.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                A GT Veículos nasceu em Taubaté com um propósito simples: oferecer veículos de qualidade
                com honestidade, transparência e o melhor atendimento da região.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <Link href="/veiculos">
                    <Car className="h-5 w-5 mr-2" />
                    Ver Nosso Estoque
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-gray-500 text-white hover:bg-gray-800 hover:border-gray-400 h-14 px-8 text-base font-semibold">
                  <Link href="/contato">
                    <Phone className="h-5 w-5 mr-2" />
                    Falar Conosco
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── NÚMEROS ── */}
        <section className="bg-black border-y border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-12 px-6 border-r border-gray-800 last:border-r-0 even:border-r-0 md:even:border-r group hover:bg-gray-900/50 transition-colors"
                >
                  <stat.icon className="h-6 w-6 text-red-500 mb-3" />
                  <span className="text-4xl md:text-5xl font-black text-white">{stat.value}</span>
                  <span className="text-sm text-gray-400 mt-1 text-center leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOSSA HISTÓRIA / TIMELINE ── */}
        <section className="bg-gray-950 py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Texto introdutório */}
              <div className="sticky top-24">
                <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                  Quem Somos
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight text-balance">
                  Uma historia construida
                  <span className="text-red-500"> com proposito.</span>
                </h2>
                <p className="mt-6 text-gray-400 leading-relaxed text-lg">
                  Fundada em 2013 por Gabriel Torres, a GT Veículos surgiu da crença de que comprar um carro
                  deveria ser uma experiência simples, segura e satisfatória. Com sede em Taubaté, no coração
                  do Vale do Paraíba, crescemos lado a lado com a comunidade que confia em nós.
                </p>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  Hoje somos referência regional em multimarcas, com estrutura completa para venda,
                  troca, financiamento e pós-venda. Mas o que nunca mudou foi o nosso jeito de trabalhar:
                  com atenção genuína a cada cliente.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />
                <div className="space-y-10">
                  {timeline.map((item, i) => (
                    <div key={i} className="relative pl-16 group">
                      <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-black border-2 border-gray-700 group-hover:border-red-600 transition-colors z-10">
                        <span className="text-xs font-black text-red-500">{item.ano.slice(2)}</span>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 group-hover:border-gray-700 rounded-xl p-5 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-red-500 font-semibold tracking-wider uppercase">{item.ano}</span>
                          <div className="h-px flex-1 bg-gray-800" />
                        </div>
                        <h3 className="text-white font-bold text-lg">{item.titulo}</h3>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSÃO, VISÃO, VALORES ── */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Nosso Proposito
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                O que nos guia todos os dias
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  label: "Missao",
                  icon: "01",
                  title: "Conectar pessoas aos seus veiculos.",
                  desc: "Oferecer a melhor experiência de compra multimarca, com transparência, qualidade e um atendimento que o cliente recomenda para a família.",
                },
                {
                  label: "Visao",
                  icon: "02",
                  title: "Ser a concessionaria preferida do Vale.",
                  desc: "Expandir nossa presença no interior de São Paulo, mantendo os valores que nos trouxeram até aqui e sendo referência nacional em atendimento ao cliente.",
                },
                {
                  label: "Proposito",
                  icon: "03",
                  title: "Gerar mobilidade com responsabilidade.",
                  desc: "Acreditamos que um bom carro transforma vidas. Por isso, trabalhamos para que mais pessoas tenham acesso seguro e digno ao seu próximo veículo.",
                },
              ].map((item, i) => (
                <div key={i} className="relative group bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-8 overflow-hidden transition-all duration-300">
                  <div className="absolute top-4 right-6 text-7xl font-black text-gray-800 group-hover:text-red-900/40 transition-colors leading-none select-none">
                    {item.icon}
                  </div>
                  <Badge className="mb-4 bg-red-600/10 text-red-500 border-0 text-xs uppercase tracking-widest">
                    {item.label}
                  </Badge>
                  <h3 className="text-white font-bold text-xl leading-snug mb-3 text-balance relative z-10">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 4 valores */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valores.map((v, i) => (
                <div key={i} className="flex flex-col gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <v.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h4 className="text-white font-bold">{v.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIFERENCIAIS ── */}
        <section className="bg-gray-950 py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                  Por que a GT?
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance leading-tight">
                  Diferenciais que
                  <span className="text-red-500"> fazem a diferenca.</span>
                </h2>
                <p className="mt-6 text-gray-400 leading-relaxed text-lg">
                  Existem centenas de opções para comprar um veículo. Mas poucas oferecem a combinação
                  de qualidade, confiança e acolhimento que você encontra na GT Veículos.
                </p>
                <div className="mt-10">
                  <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-semibold">
                    <Link href="/veiculos">
                      Explorar Estoque
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3">
                {diferenciais.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 group hover:border-red-600/40 transition-colors">
                    <CheckCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── EQUIPE ── */}
        <section className="bg-black py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Imagem */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/sobre-equipe.jpg"
                  alt="Equipe GT Veículos"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700 w-fit">
                    <Zap className="h-5 w-5 text-red-500" />
                    <span className="text-white font-semibold text-sm">Equipe especializada e comprometida</span>
                  </div>
                </div>
              </div>

              {/* Cards da equipe */}
              <div>
                <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                  Nossa Equipe
                </Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance mb-8">
                  Pessoas que
                  <span className="text-red-500"> amam o que fazem.</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {equipe.map((m, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex items-center gap-4 transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center shrink-0">
                        <span className="text-red-500 font-black text-lg">
                          {m.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{m.nome}</p>
                        <p className="text-red-400 text-xs font-medium">{m.cargo}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{m.exp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="bg-gray-950 py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-800 rounded-2xl p-8 bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Venha nos visitar</h3>
                  <p className="text-gray-400 mt-1">Av. Charles Schnneider, 2500 — Taubaté, SP</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-red-500" />
                      Seg–Sex: 8h–18h
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-red-500" />
                      Sábado: 8h–13h
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold h-12 px-6 shrink-0">
                <Link href="/contato">
                  Como Chegar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative bg-black py-28 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="absolute right-0 top-0 h-full w-1 bg-red-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.08)_0%,_transparent_70%)]" />
          <div className="relative container mx-auto px-6 max-w-4xl text-center">
            <Badge className="mb-6 bg-red-600/20 text-red-400 border border-red-600/40 uppercase tracking-widest text-xs px-4 py-1.5">
              Pronto para comecar?
            </Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none text-balance">
              Seu proximo carro
              <span className="block text-red-500">esta aqui.</span>
            </h2>
            <p className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Mais de 5.000 famílias já confiaram na GT Veículos. Venha fazer parte desse grupo
              e encontrar o veículo perfeito com quem realmente entende do assunto.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <Link href="/veiculos">
                  <Car className="h-5 w-5 mr-2" />
                  Ver Todos os Veiculos
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white h-14 px-10 text-base">
                <Link href="/contato">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar com Consultor
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
