import { streamText, convertToModelMessages } from "ai"
import { sql } from "@/lib/db"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Busca veículos disponíveis para contexto
  const vehicles = await sql`
    SELECT v.name, v.year, v.price, v.mileage, v.fuel_type, v.transmission, v.color,
           b.name as brand, c.name as category
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE v.status = 'available' AND v.published = true
    ORDER BY v.is_featured DESC, v.created_at DESC
    LIMIT 30
  `

  const vehicleList = vehicles.map((v: any) =>
    `- ${v.brand} ${v.name} ${v.year} | R$ ${Number(v.price).toLocaleString("pt-BR")} | ${v.mileage ? Number(v.mileage).toLocaleString("pt-BR") + " km" : "0 km"} | ${v.fuel_type} | ${v.transmission} | ${v.color} | ${v.category}`
  ).join("\n")

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `Você é o assistente virtual da GT Veículos, uma concessionária de veículos usados e seminovos localizada em Taubaté, SP.

INFORMAÇÕES DA LOJA:
- Nome: GT Veículos
- Endereço: Av. César Costa, 222 - Taubaté, SP
- Telefone/WhatsApp: (12) 97406-3079
- Instagram: @gtveiculostaubate
- Horário: Segunda a Sexta 8h às 18h | Sábado 9h às 13h
- Site: www.gtveiculos.com.br

ESTOQUE ATUAL DISPONÍVEL:
${vehicleList || "Nenhum veículo disponível no momento."}

DIRETRIZES DE ATENDIMENTO:
- Responda sempre em português brasileiro, de forma amigável, direta e profissional
- Quando o cliente perguntar sobre um veículo específico, consulte o estoque acima e forneça detalhes precisos
- Se o cliente mencionar orçamento ou faixa de preço, sugira veículos compatíveis do estoque
- Para financiamento: parcelas em até 60x, taxas a partir de 0,99% a.m., aprovação em 30 min
- Sempre incentive o cliente a agendar um test drive ou falar no WhatsApp para fechar negócio
- Formate preços sempre em reais (R$) com separador de milhar
- Mantenha respostas concisas (máx 4 parágrafos)
- Não invente veículos que não estejam no estoque listado acima
- Se não souber a resposta, indique o WhatsApp: (12) 97406-3079`,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
  })

  return result.toUIMessageStreamResponse()
}
