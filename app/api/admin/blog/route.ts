import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { title, excerpt, content, featured_image, status, is_featured, categories, author_id } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()

    // Insert blog post
    const [post] = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, 
        status, is_featured, author_id
      ) VALUES (
        ${title}, ${slug}, ${excerpt || null}, ${content}, ${featured_image || null},
        ${status}, ${is_featured}, ${author_id || null}
      )
      RETURNING *
    `

    // Insert categories
    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        await sql`
          INSERT INTO blog_post_categories (post_id, category_id)
          VALUES (${post.id}, ${categoryId})
        `
      }
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("[v0] Create blog post error:", error)
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 })
  }
}
