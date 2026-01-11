import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BlogPostsTable } from "@/components/admin/blog/blog-posts-table"

async function getBlogPosts() {
  const posts = await sql`
    SELECT 
      bp.*,
      u.name as author_name,
      COUNT(DISTINCT bpc.category_id) as category_count
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
    GROUP BY bp.id, u.name
    ORDER BY bp.created_at DESC
  `
  return posts
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Gerencie todos os artigos do blog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/blog/categories">Categorias</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 size-4" />
              Nova Postagem
            </Link>
          </Button>
        </div>
      </div>

      <BlogPostsTable posts={posts} />
    </div>
  )
}
