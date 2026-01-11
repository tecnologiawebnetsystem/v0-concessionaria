import { Shield, Award, ThumbsUp, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Garantia Estendida",
      description: "Todos os veículos com garantia completa e assistência 24h",
    },
    {
      icon: Award,
      title: "Qualidade Certificada",
      description: "Veículos revisados e certificados por especialistas",
    },
    {
      icon: ThumbsUp,
      title: "Melhores Condições",
      description: "Financiamento facilitado com as menores taxas do mercado",
    },
    {
      icon: Headphones,
      title: "Atendimento Premium",
      description: "Equipe especializada pronta para ajudar você",
    },
  ]

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
            Por Que Escolher a Nacional Veículos?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
            Mais de 20 anos de experiência no mercado automotivo
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-blue-50 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-900">
                  <feature.icon className="size-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
