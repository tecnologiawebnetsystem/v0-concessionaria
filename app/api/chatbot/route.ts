import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getGeminiClient, generateVehicleRecommendations } from "@/lib/gemini"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, history = [] } = body

    if (!message) {
      return NextResponse.json({ error: "Mensagem obrigatoria" }, { status: 400 })
    }

    // Buscar veiculos disponiveis para contexto
    const vehicles = await sql`
      SELECT 
        v.id, v.name, v.model, v.year, v.price, v.mileage, 
        v.fuel_type, v.transmission, v.color, v.description, v.slug,
        b.name as brand_name,
        c.name as category_name,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories c ON v.category_id = c.id
      WHERE v.status = 'available'
      ORDER BY v.created_at DESC
      LIMIT 50
    `

    // Criar contexto do estoque
    const stockContext = vehicles.map((v: any) => ({
      id: v.id,
      nome: `${v.brand_name} ${v.name}`,
      ano: v.year,
      preco: v.price,
      km: v.mileage,
      combustivel: v.fuel_type,
      cambio: v.transmission,
      cor: v.color,
      categoria: v.category_name,
      slug: v.slug,
    }))

    // Tentar usar Gemini
    const gemini = await getGeminiClient()
    
    if (gemini) {
      // Usar IA para responder
      const systemPrompt = `Voce e um assistente virtual de uma concessionaria de veiculos no Brasil.
Seu objetivo e ajudar clientes a encontrar o veiculo ideal, tirar duvidas e gerar leads.

ESTOQUE ATUAL (${vehicles.length} veiculos):
${JSON.stringify(stockContext, null, 2)}

REGRAS:
1. Seja sempre educado, profissional e prestativo
2. Responda SEMPRE em portugues brasileiro
3. Quando o cliente perguntar sobre veiculos, analise o estoque e sugira opcoes relevantes
4. Se o cliente mencionar um orcamento, filtre veiculos dentro dessa faixa
5. Se perguntar sobre financiamento, explique que trabalhamos com varios bancos e taxas a partir de 1.29% ao mes
6. Se quiser agendar test drive, pergunte qual veiculo e horario preferido
7. Se nao houver veiculos que atendam ao pedido, seja honesto e sugira alternativas
8. Mantenha respostas concisas (maximo 3 paragrafos)
9. NAO invente veiculos que nao estao no estoque

Quando sugerir veiculos, retorne no formato:
[VEICULOS_SUGERIDOS: id1, id2, id3]`

      const chatHistory = history.map((m: ChatMessage) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }))

      const result = await gemini.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Entendido! Estou pronto para ajudar os clientes." }] },
          ...chatHistory,
          { role: "user", parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      })

      const responseText = result.response.text()

      // Extrair veiculos sugeridos
      const vehicleMatch = responseText.match(/\[VEICULOS_SUGERIDOS:\s*([^\]]+)\]/)
      let suggestedVehicles: any[] = []

      if (vehicleMatch) {
        const ids = vehicleMatch[1].split(",").map((id: string) => id.trim())
        suggestedVehicles = vehicles
          .filter((v: any) => ids.includes(v.id))
          .map((v: any) => ({
            id: v.id,
            name: v.name,
            brand: v.brand_name,
            year: v.year,
            price: Number(v.price),
            image_url: v.image_url,
            slug: v.slug,
          }))
      }

      // Limpar a resposta removendo o marcador de veiculos
      const cleanResponse = responseText.replace(/\[VEICULOS_SUGERIDOS:[^\]]+\]/g, "").trim()

      // Salvar conversa no banco
      await sql`
        INSERT INTO chatbot_conversations (session_id, messages, context)
        VALUES (
          ${sessionId},
          ${JSON.stringify([...history, { role: "user", content: message }, { role: "assistant", content: cleanResponse }])},
          ${JSON.stringify({ suggested_vehicles: suggestedVehicles.map(v => v.id) })}
        )
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          messages = ${JSON.stringify([...history, { role: "user", content: message }, { role: "assistant", content: cleanResponse }])},
          last_message_at = NOW()
      `

      return NextResponse.json({
        response: cleanResponse,
        vehicles: suggestedVehicles,
      })
    }

    // Fallback: resposta sem IA
    const fallbackResponse = await generateFallbackResponse(message, vehicles)
    
    return NextResponse.json(fallbackResponse)
  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({
      response: "Desculpe, estou com dificuldades tecnicas no momento. Por favor, entre em contato pelo WhatsApp ou telefone.",
      vehicles: [],
    })
  }
}

// Resposta fallback sem IA
async function generateFallbackResponse(message: string, vehicles: any[]) {
  const lowerMessage = message.toLowerCase()

  // Detectar intencao
  if (lowerMessage.includes("suv") || lowerMessage.includes("utilitario")) {
    const suvs = vehicles.filter((v: any) => 
      v.category_name?.toLowerCase().includes("suv") || 
      v.category_name?.toLowerCase().includes("utilitario")
    ).slice(0, 3)
    
    return {
      response: suvs.length > 0 
        ? `Temos ${suvs.length} SUVs disponiveis! Veja algumas opcoes:`
        : "No momento nao temos SUVs disponiveis, mas temos outras otimas opcoes. Posso mostrar?",
      vehicles: suvs.map((v: any) => ({
        id: v.id,
        name: v.name,
        brand: v.brand_name,
        year: v.year,
        price: Number(v.price),
        image_url: v.image_url,
        slug: v.slug,
      })),
    }
  }

  if (lowerMessage.includes("automatico") || lowerMessage.includes("automatica")) {
    const autos = vehicles.filter((v: any) => 
      v.transmission?.toLowerCase().includes("automat")
    ).slice(0, 3)
    
    return {
      response: autos.length > 0 
        ? `Temos ${autos.length} veiculos automaticos! Confira:`
        : "No momento nao temos veiculos automaticos disponiveis.",
      vehicles: autos.map((v: any) => ({
        id: v.id,
        name: v.name,
        brand: v.brand_name,
        year: v.year,
        price: Number(v.price),
        image_url: v.image_url,
        slug: v.slug,
      })),
    }
  }

  // Detectar faixa de preco
  const priceMatch = lowerMessage.match(/(\d{2,3})[\.\s]?(?:mil|000)/)
  if (priceMatch || lowerMessage.includes("barato") || lowerMessage.includes("orcamento")) {
    let maxPrice = 50000
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1]) * 1000
    }
    
    const affordable = vehicles.filter((v: any) => Number(v.price) <= maxPrice).slice(0, 3)
    
    return {
      response: affordable.length > 0 
        ? `Encontrei ${affordable.length} veiculos ate R$ ${maxPrice.toLocaleString("pt-BR")}:`
        : `Nao encontrei veiculos ate R$ ${maxPrice.toLocaleString("pt-BR")}. Posso mostrar outras opcoes?`,
      vehicles: affordable.map((v: any) => ({
        id: v.id,
        name: v.name,
        brand: v.brand_name,
        year: v.year,
        price: Number(v.price),
        image_url: v.image_url,
        slug: v.slug,
      })),
    }
  }

  if (lowerMessage.includes("financiamento") || lowerMessage.includes("parcela")) {
    return {
      response: "Trabalhamos com os melhores bancos do mercado! Taxas a partir de 1.29% ao mes, entrada facilitada e aprovacao em ate 24h. Qual veiculo voce tem interesse em financiar?",
      vehicles: [],
    }
  }

  if (lowerMessage.includes("test drive") || lowerMessage.includes("visita")) {
    return {
      response: "Otimo! Adoramos receber visitas. Nosso horario de funcionamento e de segunda a sexta das 8h as 18h e sabados das 8h as 13h. Qual veiculo voce gostaria de conhecer?",
      vehicles: [],
    }
  }

  // Resposta generica
  const featured = vehicles.slice(0, 3)
  return {
    response: "Posso ajudar voce a encontrar o veiculo ideal! Temos varias opcoes disponiveis. Voce tem preferencia por algum tipo de veiculo, marca ou faixa de preco?",
    vehicles: featured.map((v: any) => ({
      id: v.id,
      name: v.name,
      brand: v.brand_name,
      year: v.year,
      price: Number(v.price),
      image_url: v.image_url,
      slug: v.slug,
    })),
  }
}
