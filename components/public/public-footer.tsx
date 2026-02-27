'use client';

import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, ChevronUp, Car, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300" role="contentinfo">
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Sparkles className="size-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Mais de 100 veiculos disponiveis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Encontre o carro dos seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">sonhos</span>
              </h2>
              <p className="text-slate-400 max-w-md">
                As melhores condicoes de financiamento e os veiculos mais seguros do mercado.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0">
                <Link href="/veiculos">
                  <Car className="size-5 mr-2" />
                  Ver Veiculos
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 bg-transparent">
                <a href="https://wa.me/5512987654321" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                  <ArrowRight className="size-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 border-t border-slate-800">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-5">
          {/* Sobre */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                <span className="text-xl font-bold text-white">GT</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white">GT</span>
                <span className="text-xs font-medium leading-tight text-blue-400">Veículos Premium</span>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Ha 15 anos oferecendo os melhores veiculos com qualidade, confianca e as melhores condicoes do mercado.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30" 
              >
                <Facebook className="size-5" />
              </a>
              <a 
                href="https://instagram.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300" 
              >
                <Instagram className="size-5" />
              </a>
              <a 
                href="https://youtube.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-lg bg-slate-800 hover:bg-red-600 transition-all duration-300" 
              >
                <Youtube className="size-5" />
              </a>
            </div>
          </div>

          {/* Navegacao */}
          <nav>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Navegacao
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Inicio", href: "/" },
                { name: "Veiculos", href: "/veiculos" },
                { name: "Blog", href: "/blog" },
                { name: "Sobre Nos", href: "/sobre" },
                { name: "Contato", href: "/contato" },
                { name: "Financiamento", href: "/financiamento" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                    <span>{link.name}</span>
                    <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categorias */}
          <nav>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Categorias
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "SUVs", href: "/veiculos?categoria=suvs" },
                { name: "Sedans", href: "/veiculos?categoria=sedans" },
                { name: "Hatchbacks", href: "/veiculos?categoria=hatchbacks" },
                { name: "Picapes", href: "/veiculos?categoria=pickups" },
                { name: "Esportivos", href: "/veiculos?categoria=esportivos" },
                { name: "Eletricos", href: "/veiculos?categoria=eletricos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                    <span>{link.name}</span>
                    <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Servicos */}
          <nav className="hidden lg:block">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Servicos
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Financiamento", href: "/financiamento" },
                { name: "Avaliacao de Veiculo", href: "/avaliacao" },
                { name: "Consorcio", href: "/consorcio" },
                { name: "Seguro Auto", href: "/seguro" },
                { name: "Documentacao", href: "/documentacao" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group">
                    <span>{link.name}</span>
                    <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Contato
            </h3>
            <address className="not-italic">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800 flex-shrink-0">
                    <MapPin className="size-4 text-blue-400" />
                  </div>
                  <span className="text-slate-400">
                    Av. Independencia, 1500
                    <br />
                    Taubate, SP - 12010-000
                  </span>
                </li>
                <li>
                  <a 
                    href="tel:+551234567890" 
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-blue-600 transition-colors flex-shrink-0">
                      <Phone className="size-4 text-blue-400 group-hover:text-white" />
                    </div>
                    (12) 3456-7890
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:contato@nacionalveiculos.com.br" 
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-blue-600 transition-colors flex-shrink-0">
                      <Mail className="size-4 text-blue-400 group-hover:text-white" />
                    </div>
                    <span className="break-all">contato@nacional.com.br</span>
                  </a>
                </li>
              </ul>
            </address>

            {/* Horario */}
            <div className="mt-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-cyan-400" />
                <p className="text-xs font-semibold text-white">Horario de Atendimento</p>
              </div>
              <p className="text-xs text-slate-400">Seg - Sex: 8h as 18h</p>
              <p className="text-xs text-slate-400">Sabado: 9h as 13h</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              © {currentYear} GT Veículos. Todos os direitos reservados.
              <span className="hidden sm:inline"> | </span>
              <br className="sm:hidden" />
              CNPJ: 12.345.678/0001-90
            </p>
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/politica-de-privacidade" className="text-slate-500 hover:text-blue-400 transition-colors">
                Privacidade
              </Link>
              <Link href="/termos-de-uso" className="text-slate-500 hover:text-blue-400 transition-colors">
                Termos
              </Link>
              <Link href="/lgpd" className="text-slate-500 hover:text-blue-400 transition-colors">
                LGPD
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Back to top - Mobile only */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-4 sm:hidden p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-blue-500/30 transition-all z-40"
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="size-5" />
      </button>
    </footer>
  )
}
