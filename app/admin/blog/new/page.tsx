import { BlogPostForm } from "@/components/admin/blog/blog-post-form"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getCategories() {
  const categories = await sql`
    SELECT * FROM blog_categories 
    WHERE is_active = true 
    ORDER BY display_order, name
  `
  return categories
}

export default async function NewBlogPostPage() {
  const [categories, session] = await Promise.all([getCategories(), getSession()])

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
          <h1 className="text-3xl font-bold text-gray-900">Nova Postagem</h1>
          <p className="text-gray-600">Crie um novo artigo para o blog</p>
        </div>
      </div>

      <BlogPostForm categories={categories} authorId={session?.userId} />
    </div>
  )
}
