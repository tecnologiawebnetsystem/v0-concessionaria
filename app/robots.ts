import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/veiculos", "/blog", "/sobre", "/contato"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/login",
          "/registro",
          "/minha-conta",
          "/minha-conta/*",
          "/seller",
          "/seller/*",
          "/_next",
          "/private",
          "/*.json$",
          "/*?*" // Prevent crawling of query parameters
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api", "/login", "/registro", "/minha-conta", "/seller"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/veiculos", "/blog"],
        disallow: ["/admin", "/api"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/api", "/login", "/registro", "/minha-conta", "/seller"],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
