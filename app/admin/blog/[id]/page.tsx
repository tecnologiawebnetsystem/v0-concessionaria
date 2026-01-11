import { BlogPostForm } from "@/components/admin/blog/blog-post-form"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getBlogPost(id: string) {
  const [post] = await sql`SELECT * FROM blog_posts WHERE id = ${id}`
  if (!post) return null

  const postCategories = await sql`
    SELECT category_id FROM blog_post_categories WHERE post_id = ${id}
  `

  return {
    ...post,
    categories: postCategories.map((pc: any) => pc.category_id),
  }
}

async function getCategories() {
  const categories = await sql`
    SELECT * FROM blog_categories 
    WHERE is_active = true 
    ORDER BY display_order, name
  `
  return categories
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories, session] = await Promise.all([getBlogPost(id), getCategories(), getSession()])

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Postagem</h1>
          <p className="text-gray-600">{post.title}</p>
        </div>
      </div>

      <BlogPostForm post={post} categories={categories} authorId={session?.userId} />
    </div>
  )
}
