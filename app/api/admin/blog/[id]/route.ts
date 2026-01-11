import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const { title, excerpt, content, featured_image, status, is_featured, categories } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()

    // Update blog post
    const [post] = await sql`
      UPDATE blog_posts SET
        title = ${title},
        slug = ${slug},
        excerpt = ${excerpt || null},
        content = ${content},
        featured_image = ${featured_image || null},
        status = ${status},
        is_featured = ${is_featured},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 })
    }

    // Update categories: delete existing and insert new ones
    if (categories) {
      await sql`DELETE FROM blog_post_categories WHERE post_id = ${id}`

      for (const categoryId of categories) {
        await sql`
          INSERT INTO blog_post_categories (post_id, category_id)
          VALUES (${id}, ${categoryId})
        `
      }
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("[v0] Update blog post error:", error)
    return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    await sql`DELETE FROM blog_posts WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete blog post error:", error)
    return NextResponse.json({ error: "Erro ao deletar post" }, { status: 500 })
  }
}
