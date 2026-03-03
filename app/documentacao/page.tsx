import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ArrowRight,
  Phone,
  CheckCircle,
  Clock,
  Shield,
  Car,
  User,
  CreditCard,
  Stamp,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentação de Veículos - GT Veículos Taubaté",
  description:
    "Transferência, DETRAN, licenciamento e toda a burocracia do seu veículo resolvida pela GT Veículos. Sem complicação, com segurança e rapidez em Taubaté.",
  keywords: "documentação veículo taubaté, transferência carro, DETRAN taubaté, licenciamento veículo GT veículos",
}

const servicos = [
  { icon: Car, titulo: "Transferência de Propriedade", desc: "Cuidamos de toda a transferência do veículo após a compra. Documentação correta, sem dores de cabeça." },
  { icon: Stamp, titulo: "Licenciamento Anual", desc: "Orientamos e auxiliamos no pagamento e regularização do licenciamento anual do seu veículo." },
  { icon: AlertCircle, titulo: "Regularização de Multas", desc: "Verificamos e orientamos sobre multas pendentes, pontuação na CNH e como regularizar a situação." },
  { icon: CreditCard, titulo: "IPVA e Débitos", desc: "Consultamos débitos de IPVA, DPVAT e outros encargos antes e após a compra do veículo." },
  { icon: Shield, titulo: "Verificação de Alienação", desc: "Checamos se o veículo possui alienação ou restrição judicial que impeça a transferência." },
  { icon: FileText, titulo: "Emissão de CRV/CRLV", desc: "Orientamos o processo de emissão do Certificado de Registro e Licenciamento do Veículo." },
]

const etapas = [
  { num: "01", titulo: "Análise da documentação", desc: "Nossa equipe verifica toda a documentação do veículo antes de concluir a compra." },
  { num: "02", titulo: "Checagem de pendências", desc: "Consultamos multas, débitos de IPVA, alienação e restrições no sistema do DETRAN." },
  { num: "03", titulo: "Processo de transferência", desc: "Providenciamos todos os documentos necessários e acompanhamos o processo até a conclusão." },
  { num: "04", titulo: "Entrega da documentação", desc: "Você recebe o veículo com toda a documentação em ordem, pronto para circular legalmente." },
]

const documentosVendedor = [
  "CRLV (licenciamento) original e atualizado",
  "Chaves (principal e reserva)",
  "Manual do proprietário",
  "Notas fiscais de revisão (se disponível)",
  "Laudos de vistoria anteriores",
  "Documento de quitação (se financiado)",
]

const documentosComprador = [
  "RG ou CNH original",
  "CPF",
  "Comprovante de residência recente",
  "Comprovante de pagamento do veículo",
  "DUT (Documento Único de Transferência) assinado",
]

export default function DocumentacaoPage() {
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
                Documentação Veicular
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight text-balance">
                Burocracia zero
                <span className="block text-red-500">para você.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Da transferência ao licenciamento, a GT Veículos resolve toda a documentação
                do seu veículo com agilidade e total segurança jurídica.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold">
                  <a href="https://wa.me/5512974063079?text=Preciso%20de%20ajuda%20com%20a%20documenta%C3%A7%C3%A3o%20do%20meu%20ve%C3%ADculo." target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Falar com Especialista
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

        {/* SERVIÇOS */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                O que resolvemos
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Serviços de
                <span className="text-red-500"> documentação.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicos.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                    <s.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{s.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
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
                Como cuidamos
                <span className="text-red-500"> da documentação.</span>
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

        {/* DOCUMENTOS NECESSÁRIOS */}
        <section className="bg-gray-950 py-24 border-t border-gray-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest text-xs">
                Checklist
              </Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white text-balance">
                Documentos para
                <span className="text-red-500"> transferência.</span>
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Documentos do Vendedor</h3>
                </div>
                <ul className="space-y-3">
                  {documentosVendedor.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Documentos do Comprador</h3>
                </div>
                <ul className="space-y-3">
                  {documentosComprador.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
                  <p className="text-red-400 text-sm leading-relaxed">
                    <strong>Importante:</strong> A transferência deve ser realizada em até 30 dias
                    após a compra para evitar multas. A GT Veículos acompanha todo o processo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-black py-24 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />
          <div className="absolute right-0 top-0 h-full w-1 bg-red-600" />
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-balance">
              Deixa a burocracia
              <span className="block text-red-500">com a gente.</span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
              Nossa equipe resolve toda a documentação do seu veículo de forma rápida, segura
              e sem você precisar enfrentar filas no DETRAN.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 text-base font-semibold">
                <a href="https://wa.me/5512974063079?text=Preciso%20de%20ajuda%20com%20documenta%C3%A7%C3%A3o%20veicular" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5 mr-2" />
                  Falar no WhatsApp
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
