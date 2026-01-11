import { sql } from "@/lib/db"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

  // Get all published vehicles
  const vehicles = await sql`
    SELECT slug, updated_at FROM vehicles 
    WHERE published = true 
    ORDER BY updated_at DESC
  `

  // Get all published blog posts
  const posts = await sql`
    SELECT slug, updated_at FROM blog_posts 
    WHERE status = 'published' 
    ORDER BY updated_at DESC
  `

  const vehicleUrls = vehicles.map((vehicle: any) => ({
    url: `${baseUrl}/veiculos/${vehicle.slug}`,
    lastModified: new Date(vehicle.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/veiculos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...vehicleUrls,
    ...blogUrls,
  ]
}
