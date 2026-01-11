import { neon } from "@neondatabase/serverless"
import { PublicHeader } from "@/components/public/public-header"
import { Footer } from "@/components/public/footer"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

const sql = neon(process.env.DATABASE_URL!)

export const metadata: Metadata = {
  title: "Blog - Nacional Veículos",
  description: "Dicas, notícias e informações sobre o mundo automotivo",
}

async function getBlogPosts() {
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
    WHERE bp.status = 'published' AND bp.published_at <= NOW()
    GROUP BY bp.id, u.name
    ORDER BY bp.published_at DESC
    LIMIT 12
  `

  return posts
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Blog da Nacional Veículos</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Dicas, notícias e informações para você fazer a melhor escolha
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  {post.featured_image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.categories.map((cat: any) => (
                        <Badge key={cat.id} variant="secondary">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold line-clamp-2 text-balance">{post.title}</h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-pretty">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.published_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
