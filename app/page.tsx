import type { Metadata } from "next"
import { sql } from "@/lib/db"
import ClientHomePage from "./client-page"
import { generateVehicleListSchema, generateFAQSchema } from "@/lib/seo"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

async function getHomeData() {
  const [vehicles, totalResult, brands] = await Promise.all([
    sql`
      SELECT v.*, b.name as brand_name, c.name as category_name,
      (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as primary_image
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories c ON v.category_id = c.id
      WHERE v.published = true
      ORDER BY v.is_featured DESC, v.created_at DESC
      LIMIT 12
    `,
    sql`SELECT COUNT(*) as total FROM vehicles WHERE published = true`,
    sql`SELECT id, name, logo_url FROM brands WHERE is_active = true ORDER BY name`
  ])

  return { 
    vehicles, 
    totalVehicles: totalResult[0]?.total || 0,
    brands 
  }
}

export const metadata: Metadata = {
  title: "Nacional Veiculos Taubate - Carros Seminovos e 0km com Garantia",
  description: "Concessionaria de veiculos em Taubate. Ha mais de 15 anos oferecendo carros seminovos e 0km com garantia, financiamento facilitado e atendimento personalizado. Visite-nos!",
  keywords: [
    "concessionaria taubate",
    "carros seminovos taubate",
    "carros 0km taubate",
    "nacional veiculos",
    "comprar carro taubate",
    "financiamento de veiculos",
    "carros usados vale do paraiba",
    "concessionaria sao jose dos campos"
  ],
  openGraph: {
    title: "Nacional Veiculos - Concessionaria de Carros em Taubate",
    description: "Ha mais de 15 anos oferecendo os melhores veiculos com garantia e financiamento facilitado. Visite nossa loja!",
    url: SITE_URL,
    type: "website",
    locale: "pt_BR",
    siteName: "Nacional Veiculos",
    images: [{
      url: `${SITE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: "Nacional Veiculos - Concessionaria em Taubate"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nacional Veiculos - Carros Seminovos e 0km em Taubate",
    description: "Concessionaria de veiculos com garantia e financiamento facilitado.",
    images: [`${SITE_URL}/og-image.jpg`]
  },
  alternates: {
    canonical: SITE_URL
  }
}

// FAQ data for SEO
const homeFaqs = [
  {
    question: "Quais formas de pagamento a Nacional Veiculos aceita?",
    answer: "Aceitamos pagamento a vista, cartao de credito, financiamento bancario e consorcio. Trabalhamos com os principais bancos para oferecer as melhores taxas de financiamento."
  },
  {
    question: "Os veiculos possuem garantia?",
    answer: "Sim, todos os nossos veiculos seminovos possuem garantia de 3 meses para motor e cambio. Veiculos 0km possuem garantia de fabrica."
  },
  {
    question: "Posso fazer test drive antes de comprar?",
    answer: "Sim! Oferecemos test drive gratuito em todos os nossos veiculos. Basta agendar pelo telefone, WhatsApp ou diretamente em nosso site."
  },
  {
    question: "A Nacional Veiculos aceita meu carro como parte do pagamento?",
    answer: "Sim, aceitamos seu veiculo usado como parte do pagamento. Fazemos avaliacao gratuita e oferecemos o melhor valor de mercado."
  },
  {
    question: "Onde a Nacional Veiculos esta localizada?",
    answer: "Estamos localizados na Av. Independencia, 1500 - Taubate, SP. Funcionamos de segunda a sexta das 8h as 18h e sabados das 9h as 13h."
  }
]

export default async function HomePage() {
  const { vehicles, totalVehicles, brands } = await getHomeData()
  
  // Generate structured data
  const vehicleListSchema = generateVehicleListSchema(vehicles)
  const faqSchema = generateFAQSchema(homeFaqs)

  return (
    <>
      {/* Structured Data for Featured Vehicles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleListSchema) }}
      />
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ClientHomePage vehicles={vehicles} totalVehicles={totalVehicles} brands={brands} />
    </>
  )
}
