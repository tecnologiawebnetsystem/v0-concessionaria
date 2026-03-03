import { generateText, Output } from "ai"
import { z } from "zod"
import { sql } from "@/lib/db"

export async function POST(req: Request) {
  const { query } = await req.json()
  if (!query?.trim()) return Response.json({ filters: {} })

  const { experimental_output: filters } = await generateText({
    model: "openai/gpt-4o-mini",
    experimental_output: Output.object({
      schema: z.object({
        brand: z.string().nullable().describe("Marca do veículo ex: Toyota, Honda, Volkswagen"),
        minYear: z.number().nullable().describe("Ano mínimo do veículo"),
        maxYear: z.number().nullable().describe("Ano máximo do veículo"),
        minPrice: z.number().nullable().describe("Preço mínimo em reais"),
        maxPrice: z.number().nullable().describe("Preço máximo em reais"),
        fuelType: z.string().nullable().describe("Tipo de combustível: gasolina, etanol, flex, diesel, elétrico, híbrido"),
        transmission: z.string().nullable().describe("Câmbio: manual, automático, automatizado, cvt"),
        category: z.string().nullable().describe("Categoria: sedan, hatch, suv, pickup, van, esportivo"),
        maxMileage: z.number().nullable().describe("Quilometragem máxima"),
        searchSummary: z.string().describe("Resumo em pt-BR do que o usuário está procurando, ex: SUV até R$ 80.000"),
      }),
    }),
    system: `Você é um especialista em veículos brasileiro. Extraia filtros de busca da mensagem do usuário.
Normalização:
- Transmissão: "automatico" ou "manual" em lowercase
- Combustível: "flex", "gasolina", "etanol", "diesel", "elétrico", "híbrido" em lowercase
- Categorias: "sedan", "hatch", "suv", "pickup", "van", "esportivo" em lowercase
- Preços mencionados como "50k" = 50000, "cem mil" = 100000
- Se não mencionado, retorne null para o campo`,
    prompt: query,
    maxOutputTokens: 300,
  })

  // Busca no banco com os filtros extraídos
  const conditions: string[] = ["v.status = 'available'", "v.published = true"]
  const params: any[] = []
  let paramIdx = 1

  if (filters?.brand) {
    conditions.push(`b.name ILIKE $${paramIdx++}`)
    params.push(`%${filters.brand}%`)
  }
  if (filters?.minYear) {
    conditions.push(`v.year >= $${paramIdx++}`)
    params.push(filters.minYear)
  }
  if (filters?.maxYear) {
    conditions.push(`v.year <= $${paramIdx++}`)
    params.push(filters.maxYear)
  }
  if (filters?.minPrice) {
    conditions.push(`v.price >= $${paramIdx++}`)
    params.push(filters.minPrice)
  }
  if (filters?.maxPrice) {
    conditions.push(`v.price <= $${paramIdx++}`)
    params.push(filters.maxPrice)
  }
  if (filters?.fuelType) {
    conditions.push(`LOWER(v.fuel_type) ILIKE $${paramIdx++}`)
    params.push(`%${filters.fuelType}%`)
  }
  if (filters?.transmission) {
    conditions.push(`LOWER(v.transmission) ILIKE $${paramIdx++}`)
    params.push(`%${filters.transmission}%`)
  }
  if (filters?.category) {
    conditions.push(`LOWER(c.name) ILIKE $${paramIdx++}`)
    params.push(`%${filters.category}%`)
  }
  if (filters?.maxMileage) {
    conditions.push(`v.mileage <= $${paramIdx++}`)
    params.push(filters.maxMileage)
  }

  const where = conditions.join(" AND ")
  const vehicles = await sql.unsafe(
    `SELECT v.id, v.name, v.year, v.price, v.mileage, v.fuel_type, v.transmission, v.color,
            v.slug, b.name as brand, c.name as category,
            (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY position LIMIT 1) as image
     FROM vehicles v
     LEFT JOIN brands b ON v.brand_id = b.id
     LEFT JOIN categories c ON v.category_id = c.id
     WHERE ${where}
     ORDER BY v.is_featured DESC, v.price ASC
     LIMIT 20`,
    params
  )

  return Response.json({
    vehicles,
    filters,
    summary: filters?.searchSummary || null,
    total: vehicles.length,
  })
}
