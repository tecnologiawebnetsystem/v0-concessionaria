import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API Key é obrigatória" }, { status: 400 })
    }

    // Testar a API do Gemini com uma requisição simples
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "Diga apenas 'OK' se você está funcionando." }]
          }]
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ 
        success: false, 
        error: error.error?.message || "Chave inválida ou sem permissão"
      })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    return NextResponse.json({ 
      success: true, 
      message: text || "Conexão estabelecida com sucesso!"
    })
  } catch (error) {
    console.error("Erro ao testar Gemini:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Erro ao conectar com a API do Gemini"
    })
  }
}
