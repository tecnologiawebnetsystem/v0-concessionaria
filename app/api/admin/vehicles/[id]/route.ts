import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

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

    // Update vehicle
    const [vehicle] = await sql`
      UPDATE vehicles SET
        name = ${name},
        slug = ${slug},
        model = ${model},
        year = ${year},
        price = ${price},
        brand_id = ${brand_id || null},
        category_id = ${category_id || null},
        mileage = ${mileage || null},
        color = ${color || null},
        fuel_type = ${fuel_type || null},
        transmission = ${transmission || null},
        engine = ${engine || null},
        description = ${description || null},
        status = ${status},
        is_featured = ${is_featured},
        is_new = ${is_new},
        published = ${published},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!vehicle) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    // Update images: delete existing and insert new ones
    if (images) {
      await sql`DELETE FROM vehicle_images WHERE vehicle_id = ${id}`

      for (let i = 0; i < images.length; i++) {
        await sql`
          INSERT INTO vehicle_images (vehicle_id, url, display_order, is_primary)
          VALUES (${id}, ${images[i]}, ${i}, ${i === 0})
        `
      }
    }

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error("[v0] Update vehicle error:", error)
    return NextResponse.json({ error: "Erro ao atualizar veículo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    await sql`DELETE FROM vehicles WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete vehicle error:", error)
    return NextResponse.json({ error: "Erro ao deletar veículo" }, { status: 500 })
  }
}
