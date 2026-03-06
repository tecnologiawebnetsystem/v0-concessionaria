import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { verifySession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    // Tentar obter usuario logado
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    let userId: string | null = null

    if (sessionToken) {
      const session = await verifySession(sessionToken)
      if (session) {
        userId = session.userId
      }
    }

    // Obter session ID do localStorage (via header ou cookie)
    const sessionId = request.headers.get("x-session-id") || 
                      cookieStore.get("session_id")?.value ||
                      `anon_${Date.now()}`

    const recommendations: any[] = []

    // 1. Veiculos vistos recentemente pelo usuario
    if (userId) {
      const viewedVehicles = await sql`
        SELECT DISTINCT v.id, v.name, v.year, v.price, v.slug,
               b.name as brand,
               (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url,
               'viewed' as reason
        FROM vehicle_views vv
        JOIN vehicles v ON v.id = vv.vehicle_id
        LEFT JOIN brands b ON v.brand_id = b.id
        WHERE vv.user_id = ${userId}
        AND v.status = 'available'
        ORDER BY vv.viewed_at DESC
        LIMIT 4
      `
      recommendations.push(...viewedVehicles.map((v: any) => ({ ...v, price: Number(v.price) })))
    }

    // 2. Veiculos similares aos favoritos
    if (userId) {
      const favoriteSimilar = await sql`
        WITH user_favorites AS (
          SELECT v.brand_id, v.category_id, v.price
          FROM favorites f
          JOIN vehicles v ON v.id = f.vehicle_id
          WHERE f.user_id = ${userId}
          LIMIT 3
        )
        SELECT DISTINCT v.id, v.name, v.year, v.price, v.slug,
               b.name as brand,
               (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url,
               'favorite' as reason
        FROM vehicles v
        LEFT JOIN brands b ON v.brand_id = b.id
        WHERE v.status = 'available'
        AND (
          v.brand_id IN (SELECT brand_id FROM user_favorites)
          OR v.category_id IN (SELECT category_id FROM user_favorites)
          OR v.price BETWEEN (SELECT MIN(price) * 0.8 FROM user_favorites) 
                        AND (SELECT MAX(price) * 1.2 FROM user_favorites)
        )
        AND v.id NOT IN (SELECT vehicle_id FROM favorites WHERE user_id = ${userId})
        ORDER BY RANDOM()
        LIMIT 4
      `
      recommendations.push(...favoriteSimilar.map((v: any) => ({ ...v, price: Number(v.price) })))
    }

    // 3. Veiculos em alta (mais visualizados)
    const trending = await sql`
      SELECT v.id, v.name, v.year, v.price, v.slug,
             b.name as brand,
             (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url,
             'trending' as reason,
             COUNT(vv.id) as view_count
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_views vv ON vv.vehicle_id = v.id 
                                AND vv.viewed_at > NOW() - INTERVAL '7 days'
      WHERE v.status = 'available'
      GROUP BY v.id, v.name, v.year, v.price, v.slug, b.name
      ORDER BY view_count DESC, v.created_at DESC
      LIMIT 4
    `
    recommendations.push(...trending.map((v: any) => ({ ...v, price: Number(v.price) })))

    // 4. Veiculos recentes
    const recent = await sql`
      SELECT v.id, v.name, v.year, v.price, v.slug,
             b.name as brand,
             (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url,
             'recent' as reason
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE v.status = 'available'
      AND v.created_at > NOW() - INTERVAL '14 days'
      ORDER BY v.created_at DESC
      LIMIT 4
    `
    recommendations.push(...recent.map((v: any) => ({ ...v, price: Number(v.price) })))

    // Remover duplicatas mantendo a primeira ocorrencia (que tem o reason mais relevante)
    const uniqueIds = new Set()
    const uniqueRecommendations = recommendations.filter((v) => {
      if (uniqueIds.has(v.id)) return false
      uniqueIds.add(v.id)
      return true
    })

    // Limitar a 12 recomendacoes
    return NextResponse.json({
      recommendations: uniqueRecommendations.slice(0, 12),
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    
    // Fallback: retornar veiculos em destaque
    const featured = await sql`
      SELECT v.id, v.name, v.year, v.price, v.slug,
             b.name as brand,
             (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as image_url,
             'trending' as reason
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE v.status = 'available'
      ORDER BY v.is_featured DESC, v.created_at DESC
      LIMIT 8
    `
    
    return NextResponse.json({
      recommendations: featured.map((v: any) => ({ ...v, price: Number(v.price) })),
    })
  }
}
