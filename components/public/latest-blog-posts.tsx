import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function LatestBlogPosts({ posts }: { posts: any[] }) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">Últimas do Blog</h2>
            <p className="mt-4 max-w-2xl text-pretty text-lg text-gray-600">
              Fique por dentro das novidades do mundo automotivo
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/blog">Ver Todos os Posts</Link>
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="group overflow-hidden transition-shadow hover:shadow-xl">
              <Link href={`/blog/${post.slug}`}>
                {post.featured_image && (
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={post.featured_image || "/placeholder.svg?height=400&width=600&query=blog"}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="size-4" />
                    {format(new Date(post.published_at || post.created_at), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">{post.title}</h3>
                  {post.excerpt && <p className="mb-4 line-clamp-3 text-gray-600">{post.excerpt}</p>}
                  <div className="flex items-center gap-2 text-blue-900">
                    <span className="text-sm font-semibold">Ler mais</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/blog">Ver Todos os Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
