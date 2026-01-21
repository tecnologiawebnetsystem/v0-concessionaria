import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nacional Veículos - Concessionária de Carros em Taubaté",
    short_name: "Nacional Veículos",
    description: "Concessionária de veículos novos e seminovos em Taubaté. Carros com garantia e financiamento facilitado.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#1e3a8a",
    categories: ["automotive", "shopping", "business"],
    lang: "pt-BR",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
    shortcuts: [
      {
        name: "Ver Veículos",
        short_name: "Veículos",
        description: "Veja nosso estoque de veículos",
        url: "/veiculos",
        icons: [{ src: "/icon-96x96.png", sizes: "96x96" }]
      },
      {
        name: "Contato",
        short_name: "Contato",
        description: "Entre em contato conosco",
        url: "/contato",
        icons: [{ src: "/icon-96x96.png", sizes: "96x96" }]
      }
    ],
    related_applications: [],
    handle_links: "preferred"
  }
}
