import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Check,
  Zap,
  Bell,
  Heart,
  MessageCircle,
  Shield,
  Tag,
} from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Bell,
    title: "Alertas de Preco Prioritarios",
    description: "Receba notificacoes instantaneas quando um veiculo do seu interesse baixar de preco.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Heart,
    title: "Favoritos Ilimitados",
    description: "Salve quantos veiculos quiser na sua lista de favoritos sem restricoes.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Tag,
    title: "Acesso a Precos Exclusivos",
    description: "Visualize ofertas e promocoes antes que fiquem disponiveis para o publico geral.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Propostas Prioritarias",
    description: "Suas propostas sao analisadas com prioridade pela nossa equipe de vendas.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: MessageCircle,
    title: "Atendimento VIP",
    description: "Canal exclusivo de WhatsApp com gerente dedicado para te atender.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Historico Completo",
    description: "Acesse o historico detalhado de manutencoes e laudos tecnicosdos veiculos.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
]

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-600/20 to-gray-900 border border-amber-500/20 p-8 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Star className="size-4 fill-amber-400" />
            GT Premium
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Eleve sua experiencia
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-6">
            Tenha acesso a recursos exclusivos e atendimento prioritario para encontrar o carro dos seus sonhos mais rapido.
          </p>
          <div className="flex items-end justify-center gap-1 mb-6">
            <span className="text-gray-400 text-lg">R$</span>
            <span className="text-5xl font-bold text-white">49</span>
            <span className="text-gray-400 text-lg mb-1">/mes</span>
          </div>
          <Button
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 text-base"
            asChild
          >
            <Link href="/contato">Falar com um Consultor</Link>
          </Button>
        </div>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">O que esta incluido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <Card key={b.title} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${b.bg} shrink-0`}>
                    <b.icon className={`size-5 ${b.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{b.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparacao */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold text-white mb-4">Plano Gratuito vs Premium</h2>
          <div className="space-y-3">
            {[
              { label: "Favoritos",           free: "Ate 10",    premium: "Ilimitados" },
              { label: "Alertas de preco",     free: "Nao",       premium: "Sim - instantaneo" },
              { label: "Propostas",            free: "Normal",    premium: "Prioritaria" },
              { label: "Precos exclusivos",    free: "Nao",       premium: "Sim" },
              { label: "Atendimento VIP",      free: "Nao",       premium: "Sim - WhatsApp dedicado" },
              { label: "Historico detalhado",  free: "Basico",    premium: "Completo" },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-3 gap-4 py-2.5 border-b border-gray-800 last:border-0">
                <span className="text-gray-400 text-sm">{row.label}</span>
                <span className="text-gray-600 text-sm text-center">{row.free}</span>
                <span className="text-amber-400 text-sm font-medium text-center flex items-center justify-center gap-1">
                  <Check className="size-3.5" />
                  {row.premium}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 pt-2">
            <span />
            <span className="text-center">
              <Badge className="bg-gray-800 text-gray-400 border-gray-700">Gratuito</Badge>
            </span>
            <span className="text-center">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                <Star className="size-3 fill-amber-400 mr-1" />
                Premium
              </Badge>
            </span>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-gray-600 text-sm">
        Tem duvidas?{" "}
        <Link href="/contato" className="text-red-400 hover:underline">
          Entre em contato
        </Link>{" "}
        com nossa equipe.
      </p>
    </div>
  )
}
