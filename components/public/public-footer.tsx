'use client';

import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Encontre o carro dos seus sonhos
              </h2>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                Mais de 100 veiculos disponiveis com as melhores condicoes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link href="/veiculos">Ver Veiculos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <a href="https://wa.me/5512987654321" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
          {/* Sobre - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl font-bold text-white">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white">Nacional</span>
                <span className="text-xs font-semibold leading-tight text-blue-400">Veiculos</span>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              Ha 15 anos oferecendo os melhores veiculos com qualidade, confianca e as melhores condicoes do mercado em Taubate e regiao.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 transition-colors" 
                aria-label="Siga-nos no Facebook"
              >
                <Facebook className="size-5" aria-hidden="true" />
              </a>
              <a 
                href="https://instagram.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-pink-600 transition-colors" 
                aria-label="Siga-nos no Instagram"
              >
                <Instagram className="size-5" aria-hidden="true" />
              </a>
              <a 
                href="https://youtube.com/nacionalveiculos" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 transition-colors" 
                aria-label="Inscreva-se no YouTube"
              >
                <Youtube className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navegacao */}
          <nav aria-label="Links do rodape - Navegacao">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Navegacao
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/veiculos" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Veiculos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Sobre Nos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/financiamento" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Financiamento
                </Link>
              </li>
            </ul>
          </nav>

          {/* Categorias */}
          <nav aria-label="Links do rodape - Categorias">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Categorias
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/veiculos?categoria=suvs" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=sedans" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Sedans
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=hatchbacks" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Hatchbacks
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=pickups" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Picapes
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=esportivos" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Esportivos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Blog - Hidden on smallest mobile */}
          <nav className="hidden sm:block" aria-label="Links do rodape - Blog">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Blog
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Dicas de Compra
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Manutencao
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Financiamento
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors inline-block py-0.5">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold inline-block py-0.5">
                  Ver Todos →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contato - Full width on mobile */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">
              Contato
            </h3>
            <address className="not-italic">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 flex-shrink-0 text-blue-400" aria-hidden="true" />
                  <span>
                    Av. Independencia, 1500
                    <br />
                    Taubate, SP - 12010-000
                  </span>
                </li>
                <li>
                  <a 
                    href="tel:+551234567890" 
                    className="flex items-center gap-3 hover:text-blue-400 transition-colors group"
                  >
                    <Phone className="size-5 flex-shrink-0 text-blue-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    (12) 3456-7890
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:contato@nacionalveiculos.com.br" 
                    className="flex items-center gap-3 hover:text-blue-400 transition-colors group"
                  >
                    <Mail className="size-5 flex-shrink-0 text-blue-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <span className="break-all">contato@nacionalveiculos.com.br</span>
                  </a>
                </li>
              </ul>
            </address>

            {/* Horario */}
            <div className="mt-4 rounded-lg bg-gray-800/50 p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-blue-400" aria-hidden="true" />
                <p className="text-xs font-semibold text-white">Horario de Atendimento</p>
              </div>
              <p className="text-xs text-gray-400">Seg - Sex: 8h as 18h</p>
              <p className="text-xs text-gray-400">Sabado: 9h as 13h</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
              © {currentYear} Nacional Veiculos. Todos os direitos reservados.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              CNPJ: 12.345.678/0001-90
            </p>
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2" aria-label="Links legais">
              <Link href="/politica-de-privacidade" className="hover:text-blue-400 transition-colors">
                Privacidade
              </Link>
              <Link href="/termos-de-uso" className="hover:text-blue-400 transition-colors">
                Termos
              </Link>
              <Link href="/lgpd" className="hover:text-blue-400 transition-colors">
                LGPD
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Back to top - Mobile only */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-4 sm:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        aria-label="Voltar ao topo"
      >
        <ChevronUp className="size-5" aria-hidden="true" />
      </button>
    </footer>
  )
}
