import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, name, brand, year, price, mileage, fuel_type, transmission, image_url } = body

    // Buscar imagem do veículo se não foi passada
    let vehicleImageUrl = image_url
    if (!vehicleImageUrl && vehicleId) {
      const [image] = await sql`
        SELECT url FROM vehicle_images 
        WHERE vehicle_id = ${vehicleId} 
        ORDER BY is_primary DESC, display_order ASC 
        LIMIT 1
      `
      vehicleImageUrl = image?.url
    }

    // Formatar preço
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(Number(price))

    // Formatar quilometragem
    const formattedMileage = mileage ? `${Number(mileage).toLocaleString("pt-BR")} km` : null

    // Criar SVG com overlay de informações
    // Dimensões: 1080x1080 (formato quadrado do Instagram)
    const svgContent = `
      <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
            <stop offset="50%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.85);stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.5"/>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="1080" height="1080" fill="#1a1a1a"/>
        
        <!-- Gradient overlay -->
        <rect width="1080" height="1080" fill="url(#overlay)"/>
        
        <!-- Top badge -->
        <rect x="40" y="40" width="200" height="50" rx="25" fill="#dc2626"/>
        <text x="140" y="72" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">DISPONÍVEL</text>
        
        <!-- Vehicle info at bottom -->
        <text x="60" y="880" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="white" filter="url(#shadow)">${brand || ""} ${name}</text>
        <text x="60" y="930" font-family="Arial, sans-serif" font-size="28" fill="#e5e5e5">${year}${formattedMileage ? ` • ${formattedMileage}` : ""}${fuel_type ? ` • ${fuel_type}` : ""}${transmission ? ` • ${transmission}` : ""}</text>
        
        <!-- Price -->
        <rect x="60" y="960" width="400" height="70" rx="10" fill="#dc2626"/>
        <text x="260" y="1008" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${formattedPrice}</text>
        
        <!-- CTA -->
        <text x="1020" y="1008" font-family="Arial, sans-serif" font-size="20" fill="#a3a3a3" text-anchor="end">Link na bio</text>
      </svg>
    `

    // Se temos uma imagem do veículo, vamos criar uma versão composta
    // Por enquanto, retornamos o SVG como data URL
    const svgBase64 = Buffer.from(svgContent).toString("base64")
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`

    // Se tiver imagem do veículo, podemos usar uma API de composição
    // Por enquanto, retornamos informações para o cliente renderizar
    return NextResponse.json({
      imageUrl: vehicleImageUrl || dataUrl,
      overlayData: {
        brand,
        name,
        year,
        price: formattedPrice,
        mileage: formattedMileage,
        fuel_type,
        transmission,
      },
      svgOverlay: dataUrl,
    })
  } catch (error) {
    console.error("Error generating Instagram image:", error)
    return NextResponse.json({ error: "Erro ao gerar imagem" }, { status: 500 })
  }
}
