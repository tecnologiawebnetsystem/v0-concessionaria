import { neon } from "@neondatabase/serverless"
import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Eye, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

const sql = neon(process.env.DATABASE_URL!)

export const metadata: Metadata = {
  title: "Blog - Nacional Veículos Taubaté | Dicas e Notícias sobre Carros",
  description: "Blog da Nacional Veículos em Taubaté. Dicas de compra, manutenção, financiamento e as últimas novidades do mercado automotivo.",
  keywords: "blog carros taubaté, dicas automotivas, nacional veículos blog, comprar carro taubaté",
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
    LIMIT 50
  `

  return posts
}

async function getBlogCategories() {
  const categories = await sql`
    SELECT bc.*, COUNT(bpc.post_id) as post_count
    FROM blog_categories bc
    LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
    WHERE bc.is_active = true
    GROUP BY bc.id
    ORDER BY bc.display_order ASC
  `
  return categories
}

async function getFeaturedPosts() {
  const posts = await sql`
    SELECT bp.*, u.name as author_name
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.status = 'published' AND bp.is_featured = true
    ORDER BY bp.views_count DESC
    LIMIT 3
  `
  return posts
}

export default async function BlogPage() {
  const [posts, categories, featuredPosts] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getFeaturedPosts(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <WhatsAppFloat />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-400/20 text-blue-100 border-blue-300/30">
                <BookOpen className="h-3 w-3 mr-1" />
                Blog Nacional Veículos
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Dicas e Notícias Automotivas
              </h1>
              <p className="text-lg text-blue-100/90 max-w-2xl mx-auto mb-8">
                Tudo sobre carros, manutenção, financiamento e as melhores dicas para você fazer a escolha certa em Taubaté
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Buscar artigos..." 
                  className="pl-12 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-8 bg-slate-50 border-b">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="px-4 py-2 bg-blue-600 text-white border-blue-600">
                  Todos
                </Badge>
                {categories.map((cat: any) => (
                  <Badge 
                    key={cat.id} 
                    variant="outline" 
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {cat.name} ({cat.post_count})
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-2xl font-bold mb-8 text-blue-900">Artigos em Destaque</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post: any, index: number) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className={`overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                      <div className={`relative ${index === 0 ? 'h-64 md:h-full' : 'h-48'} bg-gradient-to-br from-blue-100 to-indigo-100`}>
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-blue-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <Badge className="mb-2 bg-amber-500">Destaque</Badge>
                          <h3 className={`font-bold line-clamp-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views_count || 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.published_at).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl font-bold mb-8 text-blue-900">Todos os Artigos</h2>
            
            {posts.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum artigo publicado</h3>
                <p className="text-gray-500">Em breve teremos conteúdo para você!</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full group">
                      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                        {post.is_featured && (
                          <Badge className="absolute top-3 left-3 bg-amber-500">Destaque</Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.categories?.slice(0, 2).map((cat: any) => (
                            <Badge key={cat.id} variant="secondary" className="text-xs">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_at).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views_count || 0}
                          </span>
                        </div>
                        <span className="text-blue-600 font-medium flex items-center gap-1">
                          Ler mais <ArrowRight className="h-3 w-3" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
