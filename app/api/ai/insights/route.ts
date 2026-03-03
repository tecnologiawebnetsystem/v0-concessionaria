import { generateText, Output } from "ai"
import { z } from "zod"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== "super_admin") {
    return Response.json({ error: "Sem permissão" }, { status: 403 })
  }

  // Veículos parados há mais de 30 dias
  const stuckVehicles = await sql`
    SELECT v.id, v.name, v.year, v.price, v.created_at,
           b.name as brand,
           EXTRACT(DAY FROM NOW() - v.created_at)::int as days_listed,
           (SELECT COUNT(*) FROM vehicle_views WHERE vehicle_id = v.id)::int as view_count
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    WHERE v.status = 'available' AND v.published = true
      AND v.created_at < NOW() - INTERVAL '30 days'
    ORDER BY days_listed DESC
    LIMIT 10
  `

  if (stuckVehicles.length === 0) {
    return Response.json({ insights: [], summary: "Nenhum veículo parado há mais de 30 dias." })
  }

  const vehicleList = stuckVehicles.map((v: any) =>
    `- ${v.brand} ${v.name} ${v.year} | R$ ${Number(v.price).toLocaleString("pt-BR")} | ${v.days_listed} dias no estoque | ${v.view_count} visualizações`
  ).join("\n")

  const { experimental_output } = await generateText({
    model: "openai/gpt-4o-mini",
    experimental_output: Output.object({
      schema: z.object({
        insights: z.array(z.object({
          vehicleName: z.string(),
          daysListed: z.number(),
          recommendation: z.string().describe("Ação recomendada em até 1 frase"),
          action: z.enum(["discount", "feature", "repost", "review"]).describe("Tipo de ação sugerida"),
          urgency: z.enum(["high", "medium", "low"]),
        })),
        summary: z.string().describe("Resumo geral da situação do estoque em 1 frase"),
      }),
    }),
    system: `Você é um consultor de vendas de concessionária brasileira. 
Analise os veículos parados e sugira ações práticas e diretas.
Ações possíveis: discount=reduzir preço, feature=destacar no site, repost=repostar nas redes sociais, review=revisar anúncio.`,
    prompt: `Veículos parados no estoque:\n${vehicleList}`,
    maxOutputTokens: 400,
  })

  return Response.json(experimental_output)
}
