import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getGeminiClient } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query obrigatoria" }, { status: 400 })
    }

    // Tentar usar IA para interpretar a busca
    const gemini = await getGeminiClient()
    let filters: any = {}

    if (gemini) {
      try {
        const prompt = `Analise esta busca de veiculo e extraia os filtros em JSON:
"${query}"

Retorne APENAS um JSON valido com os campos aplicaveis:
{
  "category": "SUV" | "Sedan" | "Hatch" | "Pickup" | "Esportivo" | null,
  "brand": "nome da marca" | null,
  "priceMin": numero | null,
  "priceMax": numero | null,
  "yearMin": numero | null,
  "yearMax": numero | null,
  "transmission": "Automatico" | "Manual" | null,
  "fuel": "Gasolina" | "Flex" | "Diesel" | "Eletrico" | "Hibrido" | null,
  "color": "cor" | null,
  "keywords": ["palavra1", "palavra2"]
}

Exemplos:
- "SUV automatico ate 100 mil" -> {"category": "SUV", "transmission": "Automatico", "priceMax": 100000}
- "carro popular economico" -> {"priceMax": 50000, "keywords": ["popular", "economico"]}
- "pickup diesel 4x4" -> {"category": "Pickup", "fuel": "Diesel", "keywords": ["4x4"]}`

        const result = await gemini.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 },
        })

        const responseText = result.response.text()
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          filters = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error("AI parsing error:", e)
      }
    }

    // Fallback: parsing manual
    if (Object.keys(filters).length === 0) {
      filters = parseQueryManually(query)
    }

    // Construir query SQL dinamica
    let sqlQuery = `
      SELECT 
        v.id, v.name, v.year, v.price, v.slug,
        b.name as brand,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories c ON v.category_id = c.id
      WHERE v.status = 'available'
    `

    const conditions: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (filters.category) {
      conditions.push(`LOWER(c.name) LIKE LOWER($${paramIndex})`)
      params.push(`%${filters.category}%`)
      paramIndex++
    }

    if (filters.brand) {
      conditions.push(`LOWER(b.name) LIKE LOWER($${paramIndex})`)
      params.push(`%${filters.brand}%`)
      paramIndex++
    }

    if (filters.priceMin) {
      conditions.push(`v.price >= $${paramIndex}`)
      params.push(filters.priceMin)
      paramIndex++
    }

    if (filters.priceMax) {
      conditions.push(`v.price <= $${paramIndex}`)
      params.push(filters.priceMax)
      paramIndex++
    }

    if (filters.yearMin) {
      conditions.push(`v.year >= $${paramIndex}`)
      params.push(filters.yearMin)
      paramIndex++
    }

    if (filters.yearMax) {
      conditions.push(`v.year <= $${paramIndex}`)
      params.push(filters.yearMax)
      paramIndex++
    }

    if (filters.transmission) {
      conditions.push(`LOWER(v.transmission) LIKE LOWER($${paramIndex})`)
      params.push(`%${filters.transmission}%`)
      paramIndex++
    }

    if (filters.fuel) {
      conditions.push(`LOWER(v.fuel_type) LIKE LOWER($${paramIndex})`)
      params.push(`%${filters.fuel}%`)
      paramIndex++
    }

    if (conditions.length > 0) {
      sqlQuery += ` AND ${conditions.join(" AND ")}`
    }

    sqlQuery += ` ORDER BY v.is_featured DESC, v.created_at DESC LIMIT 10`

    // Executar query
    const results = await sql.unsafe(sqlQuery, params)

    // Salvar busca para analytics
    try {
      await sql`
        INSERT INTO natural_searches (original_query, parsed_filters, results_count)
        VALUES (${query}, ${JSON.stringify(filters)}, ${results.length})
      `
    } catch (e) {
      // Ignorar erro de analytics
    }

    return NextResponse.json({
      results: results.map((v: any) => ({
        id: v.id,
        name: v.name,
        brand: v.brand,
        year: v.year,
        price: Number(v.price),
        image_url: v.image_url,
        slug: v.slug,
      })),
      filters,
    })
  } catch (error) {
    console.error("Natural search error:", error)
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 })
  }
}

// Parsing manual sem IA
function parseQueryManually(query: string): any {
  const lower = query.toLowerCase()
  const filters: any = {}

  // Categorias
  if (lower.includes("suv")) filters.category = "SUV"
  else if (lower.includes("sedan")) filters.category = "Sedan"
  else if (lower.includes("hatch")) filters.category = "Hatch"
  else if (lower.includes("pickup") || lower.includes("picape")) filters.category = "Pickup"
  else if (lower.includes("esportivo")) filters.category = "Esportivo"

  // Transmissao
  if (lower.includes("automatic") || lower.includes("automatico")) {
    filters.transmission = "Automatico"
  } else if (lower.includes("manual")) {
    filters.transmission = "Manual"
  }

  // Combustivel
  if (lower.includes("diesel")) filters.fuel = "Diesel"
  else if (lower.includes("flex")) filters.fuel = "Flex"
  else if (lower.includes("eletrico")) filters.fuel = "Eletrico"
  else if (lower.includes("hibrido")) filters.fuel = "Hibrido"

  // Preco
  const priceMatch = lower.match(/(\d{2,3})[\.\s]?(?:mil|000)/)
  if (priceMatch) {
    filters.priceMax = parseInt(priceMatch[1]) * 1000
  }
  if (lower.includes("barato") || lower.includes("economico") || lower.includes("popular")) {
    filters.priceMax = filters.priceMax || 50000
  }

  // Ano
  const yearMatch = lower.match(/20[12]\d/)
  if (yearMatch) {
    filters.yearMin = parseInt(yearMatch[0])
  }

  return filters
}
