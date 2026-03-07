import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { generateVehicleDescription, generateVehicleSEO } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session || (session.role !== "admin" && session.role !== "super_admin" && session.role !== "seller")) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { brand, model, year, mileage, fuel_type, transmission, color, price, features, type } = body

    if (!brand || !model || !year) {
      return NextResponse.json({ error: "Marca, modelo e ano sao obrigatorios" }, { status: 400 })
    }

    if (type === "seo") {
      const result = await generateVehicleSEO({ brand, model, year, price })
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          meta_title: result.meta_title,
          meta_description: result.meta_description,
          meta_keywords: result.meta_keywords
        })
      }
      
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // Default: gerar descricao
    const result = await generateVehicleDescription({
      brand,
      model,
      year,
      mileage,
      fuel_type,
      transmission,
      color,
      price,
      features
    })

    if (result.success) {
      return NextResponse.json({ success: true, description: result.description })
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    console.error("Erro ao gerar conteudo:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
