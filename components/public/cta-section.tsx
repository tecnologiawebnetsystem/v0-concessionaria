import { Button } from "@/components/ui/button"
import { Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-gradient-to-r from-gray-950 to-red-950 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl">Pronto para Encontrar Seu Carro?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-300">
            Fale com nossos especialistas e encontre as melhores condições para realizar seu sonho
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-red-600 text-white hover:bg-red-500">
              <Link href="/contato">
                <MessageSquare className="mr-2 size-5" />
                Entrar em Contato
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="tel:+5511123456789">
                <Phone className="mr-2 size-5" />
                (11) 1234-5678
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
