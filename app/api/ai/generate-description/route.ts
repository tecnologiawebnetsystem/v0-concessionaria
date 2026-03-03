import { generateText } from "ai"

export async function POST(req: Request) {
  const { brand, model, year, mileage, fuel_type, transmission, engine, color, category } = await req.json()

  if (!brand || !model || !year) {
    return Response.json({ error: "Dados insuficientes" }, { status: 400 })
  }

  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    system: `Você é um especialista em redação de anúncios de veículos para concessionárias brasileiras.
Escreva descrições atraentes, informativas e persuasivas em português brasileiro.
Use linguagem clara, positiva e focada nos benefícios para o comprador.
Não use emojis. Evite clichês como "oportunidade única" ou "não perca". 
Foque em fatos reais: conforto, eficiência, desempenho, estado de conservação.`,
    prompt: `Escreva uma descrição de venda para o veículo:
Marca: ${brand}
Modelo: ${model}
Ano: ${year}
${mileage ? `Quilometragem: ${Number(mileage).toLocaleString("pt-BR")} km` : "Veículo 0 km"}
Combustível: ${fuel_type || "Flex"}
Câmbio: ${transmission || "Automático"}
${engine ? `Motor: ${engine}` : ""}
Cor: ${color || "Não informada"}
${category ? `Categoria: ${category}` : ""}

A descrição deve ter 3 parágrafos: 
1) Apresentação geral do veículo e seus diferenciais
2) Detalhes técnicos e conforto
3) Chamada para ação incentivando o cliente a agendar visita ou test drive na GT Veículos em Taubaté/SP`,
    maxOutputTokens: 400,
  })

  return Response.json({ description: text })
}
