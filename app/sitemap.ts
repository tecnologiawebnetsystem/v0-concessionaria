import { sql } from "@/lib/db"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

  // Get all published vehicles
  const vehicles = await sql`
    SELECT slug, updated_at, is_featured FROM vehicles 
    WHERE published = true AND status = 'available'
    ORDER BY is_featured DESC, updated_at DESC
  `

  // Get all published blog posts
  const posts = await sql`
    SELECT slug, updated_at, is_featured FROM blog_posts 
    WHERE status = 'published' 
    ORDER BY is_featured DESC, updated_at DESC
  `

  // Get all active brands
  const brands = await sql`
    SELECT slug, updated_at FROM brands 
    WHERE is_active = true 
    ORDER BY name
  `

  // Get all active categories
  const categories = await sql`
    SELECT slug, updated_at FROM vehicle_categories 
    WHERE is_active = true 
    ORDER BY name
  `

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/financiamento`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/comparar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ]

  // Vehicle pages - Featured get higher priority
  const vehicleUrls: MetadataRoute.Sitemap = vehicles.map((vehicle: any) => ({
    url: `${baseUrl}/veiculos/${vehicle.slug}`,
    lastModified: new Date(vehicle.updated_at),
    changeFrequency: "weekly" as const,
    priority: vehicle.is_featured ? 0.9 : 0.8,
  }))

  // Blog pages - Featured get higher priority
  const blogUrls: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: post.is_featured ? 0.8 : 0.7,
  }))

  // Category filter pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/veiculos?categoria=${category.slug}`,
    lastModified: new Date(category.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  // Brand filter pages
  const brandUrls: MetadataRoute.Sitemap = brands.map((brand: any) => ({
    url: `${baseUrl}/veiculos?marca=${brand.slug}`,
    lastModified: new Date(brand.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  return [
    ...staticPages,
    ...vehicleUrls,
    ...blogUrls,
    ...categoryUrls,
    ...brandUrls,
  ]
}
