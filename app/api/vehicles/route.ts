import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search    = searchParams.get("search") ?? ""
  const brand     = searchParams.get("brand") ?? ""
  const category  = searchParams.get("category") ?? ""
  const minPrice  = searchParams.get("min_price") ?? ""
  const maxPrice  = searchParams.get("max_price") ?? ""
  const minYear   = searchParams.get("min_year") ?? ""
  const maxYear   = searchParams.get("max_year") ?? ""
  const fuel      = searchParams.get("fuel") ?? ""
  const sort      = searchParams.get("sort") ?? "newest"
  const page      = parseInt(searchParams.get("page") ?? "1")
  const limit     = parseInt(searchParams.get("limit") ?? "12")
  const offset    = (page - 1) * limit

  try {
    const vehicles = await sql`
      SELECT
        v.id,
        v.name,
        v.slug,
        v.price,
        v.year,
        v.mileage,
        v.fuel_type,
        v.transmission,
        v.color,
        v.status,
        v.published,
        v.description,
        v.created_at,
        b.name AS brand_name,
        b.slug AS brand_slug,
        vc.name AS category_name,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) AS main_image,
        (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) AS image_count
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.id
      WHERE v.published = true
        AND v.status = 'available'
        AND (
          ${search} = '' OR
          v.name ILIKE ${'%' + search + '%'} OR
          b.name ILIKE ${'%' + search + '%'}
        )
        AND (${brand} = '' OR b.slug = ${brand})
        AND (${category} = '' OR vc.slug = ${category})
        AND (${minPrice} = '' OR v.price >= ${minPrice === '' ? 0 : Number(minPrice)})
        AND (${maxPrice} = '' OR v.price <= ${maxPrice === '' ? 999999999 : Number(maxPrice)})
        AND (${minYear} = '' OR v.year >= ${minYear === '' ? 0 : Number(minYear)})
        AND (${maxYear} = '' OR v.year <= ${maxYear === '' ? 9999 : Number(maxYear)})
        AND (${fuel} = '' OR v.fuel_type = ${fuel})
      ORDER BY
        CASE WHEN ${sort} = 'newest'    THEN v.created_at::text END DESC,
        CASE WHEN ${sort} = 'price_asc' THEN v.price::text END ASC,
        CASE WHEN ${sort} = 'price_desc' THEN v.price::text END DESC,
        CASE WHEN ${sort} = 'year_desc' THEN v.year::text END DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [countRow] = await sql`
      SELECT COUNT(*) as total
      FROM vehicles v
      LEFT JOIN brands b ON v.brand_id = b.id
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.id
      WHERE v.published = true
        AND v.status = 'available'
        AND (${search} = '' OR v.name ILIKE ${'%' + search + '%'} OR b.name ILIKE ${'%' + search + '%'})
        AND (${brand} = '' OR b.slug = ${brand})
        AND (${category} = '' OR vc.slug = ${category})
        AND (${minPrice} = '' OR v.price >= ${minPrice === '' ? 0 : Number(minPrice)})
        AND (${maxPrice} = '' OR v.price <= ${maxPrice === '' ? 999999999 : Number(maxPrice)})
        AND (${minYear} = '' OR v.year >= ${minYear === '' ? 0 : Number(minYear)})
        AND (${maxYear} = '' OR v.year <= ${maxYear === '' ? 9999 : Number(maxYear)})
        AND (${fuel} = '' OR v.fuel_type = ${fuel})
    `

    const total = Number(countRow.total)
    return NextResponse.json({
      vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] /api/vehicles error:", error)
    return NextResponse.json({ error: "Erro ao buscar veiculos" }, { status: 500 })
  }
}
