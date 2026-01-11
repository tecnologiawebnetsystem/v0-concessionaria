import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nacional Veículos - Concessionária de Carros",
    short_name: "Nacional Veículos",
    description: "A melhor concessionária de veículos do Brasil. Encontre carros seminovos e 0km.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e3a8a",
    theme_color: "#1e3a8a",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
