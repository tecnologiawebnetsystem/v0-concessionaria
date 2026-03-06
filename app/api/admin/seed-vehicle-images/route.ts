import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

const SAMPLE_IMAGES = [
  { url: "/images/vehicles/car-main.jpg", alt: "Foto principal do veiculo", isPrimary: true },
  { url: "/images/vehicles/car-interior.jpg", alt: "Interior do veiculo", isPrimary: false },
  { url: "/images/vehicles/car-engine.jpg", alt: "Motor do veiculo", isPrimary: false },
  { url: "/images/vehicles/car-wheels.jpg", alt: "Rodas e pneus", isPrimary: false },
  { url: "/images/vehicles/car-rear.jpg", alt: "Traseira do veiculo", isPrimary: false },
]

export async function POST() {
  const session = await getSession()
  
  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    // Buscar todos os veiculos
    const vehicles = await sql`SELECT id FROM vehicles`
    
    if (vehicles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Nenhum veiculo encontrado para adicionar imagens" 
      })
    }

    let totalImagesAdded = 0
    let vehiclesUpdated = 0

    for (const vehicle of vehicles) {
      // Verificar se o veiculo ja tem imagens
      const existingImages = await sql`
        SELECT COUNT(*) as count FROM vehicle_images WHERE vehicle_id = ${vehicle.id}
      `
      
      const imageCount = Number(existingImages[0].count)
      
      // Se tiver menos de 5 imagens, adicionar as que faltam
      if (imageCount < 5) {
        const imagesToAdd = SAMPLE_IMAGES.slice(imageCount)
        
        for (let i = 0; i < imagesToAdd.length; i++) {
          const img = imagesToAdd[i]
          await sql`
            INSERT INTO vehicle_images (id, vehicle_id, url, alt_text, is_primary, display_order, created_at)
            VALUES (
              gen_random_uuid(),
              ${vehicle.id},
              ${img.url},
              ${img.alt},
              ${imageCount === 0 && i === 0},
              ${imageCount + i + 1},
              NOW()
            )
          `
          totalImagesAdded++
        }
        vehiclesUpdated++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Adicionadas ${totalImagesAdded} imagens em ${vehiclesUpdated} veiculos`,
      totalImages: totalImagesAdded,
      vehiclesUpdated
    })
  } catch (error) {
    console.error("Erro ao popular imagens:", error)
    return NextResponse.json({ error: "Erro ao popular imagens" }, { status: 500 })
  }
}
