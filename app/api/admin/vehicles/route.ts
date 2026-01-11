import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const {
      name,
      model,
      year,
      price,
      brand_id,
      category_id,
      mileage,
      color,
      fuel_type,
      transmission,
      engine,
      description,
      status,
      is_featured,
      is_new,
      published,
      images,
    } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()

    // Insert vehicle
    const [vehicle] = await sql`
      INSERT INTO vehicles (
        name, slug, model, year, price, brand_id, category_id,
        mileage, color, fuel_type, transmission, engine, description,
        status, is_featured, is_new, published
      ) VALUES (
        ${name}, ${slug}, ${model}, ${year}, ${price}, 
        ${brand_id || null}, ${category_id || null},
        ${mileage || null}, ${color || null}, ${fuel_type || null}, 
        ${transmission || null}, ${engine || null}, ${description || null},
        ${status}, ${is_featured}, ${is_new}, ${published}
      )
      RETURNING *
    `

    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await sql`
          INSERT INTO vehicle_images (vehicle_id, url, display_order, is_primary)
          VALUES (${vehicle.id}, ${images[i]}, ${i}, ${i === 0})
        `
      }
    }

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error("[v0] Create vehicle error:", error)
    return NextResponse.json({ error: "Erro ao criar veículo" }, { status: 500 })
  }
}
