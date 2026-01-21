import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { Home, Search, ArrowLeft, Car } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pagina nao encontrada (404)",
  description: "A pagina que voce procura nao existe ou foi removida.",
  robots: {
    index: false,
    follow: true
  }
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="text-[150px] sm:text-[200px] font-black text-gray-100 dark:text-slate-800 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Car className="size-16 sm:size-20 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pagina nao encontrada
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base sm:text-lg">
            Parece que o veiculo que voce procura ja foi vendido ou a pagina nao existe mais. 
            Que tal explorar nosso estoque atualizado?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800">
              <Link href="/veiculos">
                <Search className="size-4 mr-2" aria-hidden="true" />
                Ver Veiculos
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">
                <Home className="size-4 mr-2" aria-hidden="true" />
                Pagina Inicial
              </Link>
            </Button>
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Links uteis:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/veiculos?categoria=suvs" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                SUVs
              </Link>
              <Link href="/veiculos?categoria=sedans" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Sedans
              </Link>
              <Link href="/veiculos?categoria=hatchbacks" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Hatchbacks
              </Link>
              <Link href="/contato" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Contato
              </Link>
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
