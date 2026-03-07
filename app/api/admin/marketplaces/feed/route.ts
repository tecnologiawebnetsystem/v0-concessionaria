import { NextRequest, NextResponse } from "next/server"
import { generateMarketplaceFeed } from "@/lib/marketplaces"

// GET - Gerar feed de veiculos para marketplace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketplace = searchParams.get('marketplace')

    if (!marketplace) {
      return NextResponse.json(
        { error: "Marketplace e obrigatorio" },
        { status: 400 }
      )
    }

    const validMarketplaces = ['olx', 'webmotors', 'mercadolivre', 'icarros']
    if (!validMarketplaces.includes(marketplace)) {
      return NextResponse.json(
        { error: "Marketplace invalido" },
        { status: 400 }
      )
    }

    const feed = await generateMarketplaceFeed(marketplace)
    const data = JSON.parse(feed)

    return NextResponse.json({
      marketplace,
      generatedAt: new Date().toISOString(),
      count: data.veiculos?.length || data.ads?.length || 0,
      ...data
    })
  } catch (error) {
    console.error("Erro ao gerar feed:", error)
    return NextResponse.json(
      { error: "Erro ao gerar feed" },
      { status: 500 }
    )
  }
}
