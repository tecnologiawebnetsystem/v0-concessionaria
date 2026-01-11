import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { PublicHeader } from "@/components/public/public-header"
import { Footer } from "@/components/public/footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"

const sql = neon(process.env.DATABASE_URL!)

async function getBlogPost(slug: string) {
  const posts = await sql`
    SELECT 
      bp.*,
      u.name as author_name,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug)
        ) FILTER (WHERE bc.id IS NOT NULL),
        '[]'
      ) as categories
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
    LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
    WHERE bp.slug = ${slug} AND bp.status = 'published'
    GROUP BY bp.id, u.name
  `

  if (posts.length === 0) return null

  // Increment view count
  await sql`
    UPDATE blog_posts 
    SET views_count = views_count + 1 
    WHERE id = ${posts[0].id}
  `

  return posts[0]
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post não encontrado",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {post.featured_image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat: any) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.published_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.views_count} visualizações</span>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
