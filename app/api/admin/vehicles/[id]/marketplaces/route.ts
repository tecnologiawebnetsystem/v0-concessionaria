import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { 
  getVehicleForMarketplace, 
  formatForOLX, 
  formatForWebmotors, 
  formatForMercadoLivre,
  formatForICarros,
  saveMarketplaceListing 
} from "@/lib/marketplaces"

// GET - Listar listings de um veiculo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const listings = await sql`
      SELECT * FROM marketplace_listings 
      WHERE vehicle_id = ${id}
      ORDER BY marketplace
    `

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Erro ao buscar listings:", error)
    return NextResponse.json(
      { error: "Erro ao buscar listings" },
      { status: 500 }
    )
  }
}

// POST - Publicar veiculo em marketplace
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { marketplace } = body

    if (!marketplace) {
      return NextResponse.json(
        { error: "Marketplace e obrigatorio" },
        { status: 400 }
      )
    }

    // Buscar dados do veiculo formatados
    const vehicle = await getVehicleForMarketplace(id)
    if (!vehicle) {
      return NextResponse.json(
        { error: "Veiculo nao encontrado" },
        { status: 404 }
      )
    }

    // Formatar para o marketplace especifico
    let formattedData
    switch (marketplace) {
      case 'olx':
        formattedData = formatForOLX(vehicle)
        break
      case 'webmotors':
        formattedData = formatForWebmotors(vehicle)
        break
      case 'mercadolivre':
        formattedData = formatForMercadoLivre(vehicle)
        break
      case 'icarros':
        formattedData = formatForICarros(vehicle)
        break
      default:
        return NextResponse.json(
          { error: "Marketplace nao suportado" },
          { status: 400 }
        )
    }

    // Aqui seria a integracao real com a API do marketplace
    // Por enquanto, salvamos como pendente
    await saveMarketplaceListing(id, marketplace, undefined, 'pending')

    // Log da acao
    await sql`
      INSERT INTO admin_logs (action, entity_type, entity_id, details, created_at)
      VALUES (
        'marketplace_publish',
        'vehicle',
        ${id},
        ${JSON.stringify({ marketplace, data: formattedData })}::jsonb,
        NOW()
      )
    `.catch(() => {})

    return NextResponse.json({ 
      success: true, 
      message: `Veiculo enviado para ${marketplace}`,
      data: formattedData
    })
  } catch (error) {
    console.error("Erro ao publicar:", error)
    return NextResponse.json(
      { error: "Erro ao publicar no marketplace" },
      { status: 500 }
    )
  }
}

// DELETE - Remover veiculo do marketplace
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const marketplace = searchParams.get('marketplace')

    if (!marketplace) {
      const body = await request.json().catch(() => ({}))
      if (!body.marketplace) {
        return NextResponse.json(
          { error: "Marketplace e obrigatorio" },
          { status: 400 }
        )
      }
      
      await sql`
        UPDATE marketplace_listings 
        SET status = 'removed', updated_at = NOW()
        WHERE vehicle_id = ${id} AND marketplace = ${body.marketplace}
      `
    } else {
      await sql`
        UPDATE marketplace_listings 
        SET status = 'removed', updated_at = NOW()
        WHERE vehicle_id = ${id} AND marketplace = ${marketplace}
      `
    }

    return NextResponse.json({ 
      success: true, 
      message: "Anuncio removido" 
    })
  } catch (error) {
    console.error("Erro ao remover:", error)
    return NextResponse.json(
      { error: "Erro ao remover do marketplace" },
      { status: 500 }
    )
  }
}
