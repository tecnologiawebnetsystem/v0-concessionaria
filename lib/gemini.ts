import { sql } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
  error?: {
    message?: string
  }
}

async function getGeminiApiKey(): Promise<string | null> {
  try {
    const result = await sql`
      SELECT value FROM site_settings 
      WHERE key = 'gemini_api_key' AND category = 'integrations'
      LIMIT 1
    `
    return result[0]?.value || null
  } catch {
    return null
  }
}

export async function getGeminiClient() {
  const apiKey = await getGeminiApiKey()
  if (!apiKey) return null
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  } catch {
    return null
  }
}

export { generateVehicleDescription as generateVehicleRecommendations }

export async function generateWithGemini(prompt: string): Promise<{ success: boolean; text?: string; error?: string }> {
  const apiKey = await getGeminiApiKey()
  
  if (!apiKey) {
    return { success: false, error: "Chave da API do Gemini nao configurada. Configure em Configuracoes > Integracoes." }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    const data: GeminiResponse = await response.json()

    if (data.error) {
      return { success: false, error: data.error.message || "Erro na API do Gemini" }
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!text) {
      return { success: false, error: "Resposta vazia do Gemini" }
    }

    return { success: true, text }
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error)
    return { success: false, error: "Erro de conexao com o Gemini" }
  }
}

export async function generateVehicleDescription(vehicle: {
  brand: string
  model: string
  year: number
  mileage?: number
  fuel_type?: string
  transmission?: string
  color?: string
  price?: number
  features?: string[]
}): Promise<{ success: boolean; description?: string; error?: string }> {
  const featuresText = vehicle.features?.length 
    ? `Opcionais: ${vehicle.features.join(", ")}.` 
    : ""

  const prompt = `Voce e um especialista em vendas de veiculos. Crie uma descricao profissional e persuasiva para anuncio de veiculo com as seguintes caracteristicas:

Marca: ${vehicle.brand}
Modelo: ${vehicle.model}
Ano: ${vehicle.year}
${vehicle.mileage ? `Quilometragem: ${vehicle.mileage.toLocaleString("pt-BR")} km` : ""}
${vehicle.fuel_type ? `Combustivel: ${vehicle.fuel_type}` : ""}
${vehicle.transmission ? `Cambio: ${vehicle.transmission}` : ""}
${vehicle.color ? `Cor: ${vehicle.color}` : ""}
${featuresText}

Regras:
- Escreva em portugues brasileiro
- Use linguagem profissional mas acessivel
- Destaque os pontos fortes do veiculo
- Inclua chamadas para acao sutis
- Maximo de 3 paragrafos
- Nao inclua precos ou informacoes inventadas
- Nao use emojis`

  const result = await generateWithGemini(prompt)
  
  if (result.success && result.text) {
    return { success: true, description: result.text }
  }
  
  return { success: false, error: result.error }
}

export async function generateVehicleSEO(vehicle: {
  brand: string
  model: string
  year: number
  price?: number
}): Promise<{ 
  success: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  error?: string 
}> {
  const prompt = `Gere SEO otimizado para um anuncio de veiculo:

Veiculo: ${vehicle.brand} ${vehicle.model} ${vehicle.year}

Retorne APENAS um JSON valido (sem markdown) com os campos:
- meta_title: titulo SEO (max 60 caracteres)
- meta_description: descricao SEO (max 155 caracteres)  
- meta_keywords: palavras-chave separadas por virgula

Foque em termos de busca brasileiros para compra de veiculos.`

  const result = await generateWithGemini(prompt)
  
  if (result.success && result.text) {
    try {
      // Limpar possivel markdown do JSON
      const cleanJson = result.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      
      const seo = JSON.parse(cleanJson)
      return { 
        success: true, 
        meta_title: seo.meta_title,
        meta_description: seo.meta_description,
        meta_keywords: seo.meta_keywords
      }
    } catch {
      return { success: false, error: "Erro ao processar resposta do Gemini" }
    }
  }
  
  return { success: false, error: result.error }
}

export async function answerCustomerQuestion(
  question: string,
  vehicleContext?: {
    brand: string
    model: string
    year: number
    price?: number
    features?: string[]
  }
): Promise<{ success: boolean; answer?: string; error?: string }> {
  const vehicleInfo = vehicleContext
    ? `
Contexto do veiculo em questao:
- ${vehicleContext.brand} ${vehicleContext.model} ${vehicleContext.year}
${vehicleContext.price ? `- Preco: R$ ${vehicleContext.price.toLocaleString("pt-BR")}` : ""}
${vehicleContext.features?.length ? `- Opcionais: ${vehicleContext.features.join(", ")}` : ""}
`
    : ""

  const prompt = `Voce e um assistente virtual de uma concessionaria de veiculos chamada GT Veiculos, localizada no Vale do Paraiba - SP.

${vehicleInfo}

Pergunta do cliente: "${question}"

Responda de forma:
- Profissional e cordial
- Objetiva (maximo 2-3 paragrafos)
- Em portugues brasileiro
- Se nao souber algo especifico, sugira que o cliente entre em contato
- Nao invente informacoes sobre o veiculo
- Nao use emojis`

  const result = await generateWithGemini(prompt)
  
  if (result.success && result.text) {
    return { success: true, answer: result.text }
  }
  
  return { success: false, error: result.error }
}
