import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page     = parseInt(searchParams.get("page") ?? "1")
  const limit    = parseInt(searchParams.get("limit") ?? "9")
  const offset   = (page - 1) * limit
  const category = searchParams.get("category") ?? ""
  const search   = searchParams.get("search") ?? ""

  try {
    const posts = await sql`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.published_at,
        bp.read_time,
        bp.views,
        u.name AS author_name
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.published = true
        AND (${search} = '' OR bp.title ILIKE ${'%' + search + '%'} OR bp.excerpt ILIKE ${'%' + search + '%'})
        AND (
          ${category} = '' OR
          EXISTS (
            SELECT 1 FROM blog_post_categories bpc
            JOIN blog_categories bc ON bpc.category_id = bc.id
            WHERE bpc.post_id = bp.id AND bc.slug = ${category}
          )
        )
      ORDER BY bp.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const [countRow] = await sql`
      SELECT COUNT(*) as total
      FROM blog_posts bp
      WHERE bp.published = true
        AND (${search} = '' OR bp.title ILIKE ${'%' + search + '%'} OR bp.excerpt ILIKE ${'%' + search + '%'})
        AND (
          ${category} = '' OR
          EXISTS (
            SELECT 1 FROM blog_post_categories bpc
            JOIN blog_categories bc ON bpc.category_id = bc.id
            WHERE bpc.post_id = bp.id AND bc.slug = ${category}
          )
        )
    `

    const total = Number(countRow.total)
    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] /api/blog error:", error)
    return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 })
  }
}
