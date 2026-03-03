import { generateText, Output } from "ai"
import { z } from "zod"
import { sql } from "@/lib/db"

export async function POST(req: Request) {
  const { brand, model, year, mileage, fuel_type, transmission } = await req.json()

  if (!brand || !model || !year) {
    return Response.json({ error: "Dados insuficientes" }, { status: 400 })
  }

  const similar = await sql`
    SELECT v.price, v.year, v.mileage, b.name as brand
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    WHERE b.name ILIKE ${`%${brand}%`}
      AND v.year BETWEEN ${Number(year) - 2} AND ${Number(year) + 2}
      AND v.status = 'available'
    ORDER BY v.created_at DESC
    LIMIT 5
  `

  const similarContext = similar.length > 0
    ? `\n\nVeículos similares no estoque atual:\n${similar.map((v: any) =>
        `- ${v.brand} ${v.year} | ${v.mileage ? Number(v.mileage).toLocaleString("pt-BR") + " km" : "0 km"} | R$ ${Number(v.price).toLocaleString("pt-BR")}`
      ).join("\n")}`
    : ""

  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    output: Output.object({
      schema: z.object({
        suggestedPrice: z.number().describe("Preço sugerido em reais"),
        minPrice: z.number().describe("Preço mínimo aceitável"),
        maxPrice: z.number().describe("Preço máximo de mercado"),
        reasoning: z.string().nullable().describe("Justificativa resumida em até 2 frases"),
      }),
    }),
    system: `Você é um especialista em avaliação de veículos usados no mercado brasileiro.
Considere tabela FIPE, condições de mercado em Taubaté/SP e interior de São Paulo.
Retorne preços em reais (números inteiros, sem casas decimais).`,
    prompt: `Sugira um preço de venda para:
Marca: ${brand}
Modelo: ${model}
Ano: ${year}
Quilometragem: ${mileage ? Number(mileage).toLocaleString("pt-BR") + " km" : "0 km (novo)"}
Combustível: ${fuel_type || "Flex"}
Câmbio: ${transmission || "Automático"}
${similarContext}`,
    maxOutputTokens: 200,
  })

  try {
    const result = JSON.parse(text)
    return Response.json(result)
  } catch {
    return Response.json({ error: "Erro ao processar resposta" }, { status: 500 })
  }
}

