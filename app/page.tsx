import type { Metadata } from "next"
import { sql } from "@/lib/db"
import ClientHomePage from "./client-page"

async function getHomeData() {
  const vehicles = await sql`
    SELECT v.*, b.name as brand_name, c.name as category_name,
    (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as primary_image
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_categories c ON v.category_id = c.id
    WHERE v.published = true
    ORDER BY v.is_featured DESC, v.created_at DESC
    LIMIT 12
  `

  return { vehicles }
}

export const metadata: Metadata = {
  title: "Nacional Veículos - Sua Melhor Escolha em Carros 0km e Seminovos",
  description:
    "Há mais de 15 anos no mercado, oferecemos os melhores veículos 0km e seminovos com garantia, financiamento facilitado e atendimento personalizado.",
}

export default async function HomePage() {
  const { vehicles } = await getHomeData()

  return <ClientHomePage vehicles={vehicles} />
}
