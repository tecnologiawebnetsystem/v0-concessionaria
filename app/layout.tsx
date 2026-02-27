import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { VehicleProvider } from "@/contexts/vehicle-context"
import { ThemeProvider } from "@/components/theme-provider"
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo"
import "./globals.css"

const geistSans = Geist({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono"
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a8a" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
  colorScheme: "light dark"
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GT Veículos - Concessionária de Carros em Taubaté | Seminovos e 0km",
    template: "%s | GT Veículos Taubaté"
  },
  description: "Concessionária de veículos em Taubaté. Mais de 15 anos oferecendo carros seminovos e 0km com garantia, financiamento facilitado e as melhores condições. Visite-nos!",
  keywords: [
    "concessionária taubaté",
    "carros seminovos taubaté",
    "carros 0km taubaté",
    "financiamento de veículos",
    "comprar carro taubaté",
    "nacional veículos",
    "carros usados vale do paraíba",
    "concessionária são josé dos campos",
    "carros com garantia"
  ],
  authors: [{ name: "GT Veículos", url: SITE_URL }],
  creator: "GT Veículos",
  publisher: "GT Veículos",
  formatDetection: {
    email: true,
    address: true,
    telephone: true
  },
  category: "Automotive",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  applicationName: "GT Veículos",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "GT Veículos",
    title: "GT Veículos - Concessionária de Carros em Taubaté",
    description: "Concessionária de veículos em Taubaté. Carros seminovos e 0km com garantia e financiamento facilitado.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "GT Veículos - Concessionária em Taubaté",
        type: "image/jpeg"
      }
    ]
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "GT Veículos - Concessionária em Taubaté",
    description: "Carros seminovos e 0km com garantia e financiamento facilitado.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@nacionalveiculos",
    site: "@nacionalveiculos"
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)", sizes: "32x32" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)", sizes: "32x32" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" }
    ],
    shortcut: "/favicon.ico"
  },
  
  // Manifest
  manifest: "/manifest.webmanifest",
  
  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // yandex: "",
    // yahoo: "",
  },
  
  // Alternates
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL
    }
  },
  
  // Other
  other: {
    "msapplication-TileColor": "#1e3a8a",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "GT Veículos"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()
  
  return (
    <html 
      lang="pt-BR" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <VehicleProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </VehicleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
