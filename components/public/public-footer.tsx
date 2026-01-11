import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Sobre a Nacional Veículos */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl font-bold text-white">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white">Nacional</span>
                <span className="text-xs font-semibold leading-tight text-blue-400">Veículos</span>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed">
              Há 15 anos oferecendo os melhores veículos com qualidade, confiança e as melhores condições do mercado.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook className="size-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram className="size-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="YouTube">
                <Youtube className="size-5" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/veiculos" className="hover:text-blue-400 transition-colors">
                  Veículos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-blue-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-blue-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias de Veículos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">Categorias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/veiculos?categoria=suvs" className="hover:text-blue-400 transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=sedans" className="hover:text-blue-400 transition-colors">
                  Sedans
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=hatchbacks" className="hover:text-blue-400 transition-colors">
                  Hatchbacks
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=pickups" className="hover:text-blue-400 transition-colors">
                  Picapes
                </Link>
              </li>
              <li>
                <Link href="/veiculos?categoria=esportivos" className="hover:text-blue-400 transition-colors">
                  Esportivos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">Blog</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/como-escolher-seu-primeiro-carro" className="hover:text-blue-400 transition-colors">
                  Como Escolher Seu Primeiro Carro
                </Link>
              </li>
              <li>
                <Link href="/blog/cuidados-com-carros-seminovos" className="hover:text-blue-400 transition-colors">
                  Cuidados com Carros Seminovos
                </Link>
              </li>
              <li>
                <Link href="/blog/financiamento-de-veiculos" className="hover:text-blue-400 transition-colors">
                  Guia de Financiamento
                </Link>
              </li>
              <li>
                <Link href="/blog/manutencao-preventiva" className="hover:text-blue-400 transition-colors">
                  Manutenção Preventiva
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Ver Todos os Artigos →
                </Link>
              </li>
            </ul>
          </div>
          {/* </CHANGE> */}

          {/* Contato */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white tracking-wider">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-5 flex-shrink-0 text-blue-400" />
                <span>
                  Av. Principal, 1000
                  <br />
                  São Paulo, SP
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-5 flex-shrink-0 text-blue-400" />
                <a href="tel:+551134567890" className="hover:text-blue-400 transition-colors">
                  (11) 3456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-5 flex-shrink-0 text-blue-400" />
                <a href="mailto:contato@nacionalveiculos.com.br" className="hover:text-blue-400 transition-colors">
                  contato@nacionalveiculos.com.br
                </a>
              </li>
            </ul>

            {/* Horário de Atendimento */}
            <div className="mt-6 rounded-lg bg-gray-800 p-4">
              <p className="text-xs font-semibold text-white mb-2">Horário de Atendimento</p>
              <p className="text-xs text-gray-400">Seg - Sex: 8h às 18h</p>
              <p className="text-xs text-gray-400">Sábado: 9h às 13h</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {new Date().getFullYear()} Nacional Veículos. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/politica-de-privacidade" className="hover:text-blue-400 transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-de-uso" className="hover:text-blue-400 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
        {/* </CHANGE> */}
      </div>
    </footer>
  )
}
