import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getVehicleForMarketplace, formatForOLX, formatForWebmotors } from "@/lib/marketplaces"

// POST - Sincronizar veiculo com marketplace especifico
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

    // Verificar se existe listing
    const listings = await sql`
      SELECT * FROM marketplace_listings 
      WHERE vehicle_id = ${id} AND marketplace = ${marketplace}
    `

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing nao encontrado. Publique primeiro." },
        { status: 404 }
      )
    }

    const listing = listings[0]

    // Buscar dados atualizados do veiculo
    const vehicle = await getVehicleForMarketplace(id)
    if (!vehicle) {
      return NextResponse.json(
        { error: "Veiculo nao encontrado" },
        { status: 404 }
      )
    }

    // Aqui seria a chamada real a API do marketplace para atualizar
    // Simulando sucesso
    const success = true
    const externalId = listing.external_id || `${marketplace.toUpperCase()}${Date.now()}`

    if (success) {
      await sql`
        UPDATE marketplace_listings 
        SET 
          status = 'active',
          external_id = ${externalId},
          last_sync = NOW(),
          error_message = NULL,
          updated_at = NOW()
        WHERE vehicle_id = ${id} AND marketplace = ${marketplace}
      `

      return NextResponse.json({ 
        success: true, 
        message: "Sincronizado com sucesso",
        externalId
      })
    } else {
      await sql`
        UPDATE marketplace_listings 
        SET 
          status = 'error',
          error_message = 'Falha na sincronizacao',
          updated_at = NOW()
        WHERE vehicle_id = ${id} AND marketplace = ${marketplace}
      `

      return NextResponse.json(
        { error: "Falha na sincronizacao" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Erro ao sincronizar:", error)
    return NextResponse.json(
      { error: "Erro ao sincronizar" },
      { status: 500 }
    )
  }
}
