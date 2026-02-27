// SEO Utilities - Schema.org Structured Data Generators

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"
const SITE_NAME = "GT Veículos"
const SITE_PHONE = "(12) 3456-7890"
const SITE_ADDRESS = {
  street: "Av. Independência, 1500",
  city: "Taubaté",
  state: "SP",
  postalCode: "12010-000",
  country: "BR"
}

// Organization Schema - Para usar globalmente
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "GT Veículos Taubaté",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512
    },
    image: `${SITE_URL}/og-image.jpg`,
    description: "Concessionária de veículos novos e seminovos em Taubaté. Mais de 15 anos oferecendo os melhores carros com garantia e financiamento facilitado.",
    telephone: SITE_PHONE,
    email: "contato@nacionalveiculos.com.br",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.state,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -23.0226,
      longitude: -45.5558
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00"
      }
    ],
    sameAs: [
      "https://www.facebook.com/nacionalveiculos",
      "https://www.instagram.com/nacionalveiculos",
      "https://www.youtube.com/nacionalveiculos"
    ],
    priceRange: "$$",
    currenciesAccepted: "BRL",
    paymentAccepted: "Cash, Credit Card, Financing",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -23.0226,
        longitude: -45.5558
      },
      geoRadius: "100000"
    }
  }
}

// Local Business Schema - Para páginas de contato
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE_NAME,
    image: `${SITE_URL}/storefront.jpg`,
    "@id": `${SITE_URL}/#localbusiness`,
    url: SITE_URL,
    telephone: SITE_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.state,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -23.0226,
      longitude: -45.5558
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00"
      }
    ]
  }
}

// Vehicle Schema - Melhorado
export function generateVehicleStructuredData(vehicle: any, images: any[]) {
  const primaryImage = images.find((img) => img.is_primary)?.url || images[0]?.url
  
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    "@id": `${SITE_URL}/veiculos/${vehicle.slug}`,
    name: `${vehicle.brand_name} ${vehicle.name}`,
    description: vehicle.description || `${vehicle.brand_name} ${vehicle.name} ${vehicle.year} - ${vehicle.mileage ? `${new Intl.NumberFormat("pt-BR").format(vehicle.mileage)} km` : "0km"}`,
    brand: {
      "@type": "Brand",
      name: vehicle.brand_name,
    },
    manufacturer: {
      "@type": "Organization",
      name: vehicle.brand_name
    },
    model: vehicle.model || vehicle.name,
    modelDate: vehicle.year?.toString(),
    vehicleModelDate: vehicle.year?.toString(),
    productionDate: vehicle.year?.toString(),
    vehicleConfiguration: vehicle.version || vehicle.model,
    bodyType: vehicle.category_name,
    driveWheelConfiguration: vehicle.transmission?.toLowerCase().includes("4x4") ? "FourWheelDriveConfiguration" : "FrontWheelDriveConfiguration",
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuel_type,
    color: vehicle.color,
    vehicleInteriorColor: vehicle.interior_color || "Não especificado",
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage || 0,
      unitCode: "KMT",
    },
    vehicleEngine: vehicle.engine ? {
      "@type": "EngineSpecification",
      name: vehicle.engine
    } : undefined,
    numberOfDoors: vehicle.doors || 4,
    vehicleSeatingCapacity: vehicle.seats || 5,
    offers: {
      "@type": "Offer",
      "@id": `${SITE_URL}/veiculos/${vehicle.slug}#offer`,
      url: `${SITE_URL}/veiculos/${vehicle.slug}`,
      price: vehicle.price,
      priceCurrency: "BRL",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: vehicle.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: vehicle.is_new ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutoDealer",
        name: SITE_NAME,
        url: SITE_URL,
        telephone: SITE_PHONE
      },
    },
    image: images.length > 0 ? images.map((img) => img.url) : [primaryImage],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/veiculos/${vehicle.slug}`
    }
  }
}

// Blog Post Schema - Melhorado
export function generateBlogPostStructuredData(post: any, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`
    },
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featured_image ? {
      "@type": "ImageObject",
      url: post.featured_image,
      width: 1200,
      height: 630
    } : undefined,
    author: {
      "@type": "Person",
      name: authorName || "GT Veículos",
      url: SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    articleSection: "Automotivo",
    inLanguage: "pt-BR",
    keywords: post.keywords || "carros, veículos, taubaté, concessionária"
  }
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  }
}

// FAQ Schema - Para páginas de perguntas frequentes
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
}

// Product List Schema - Para listagens de veículos
export function generateVehicleListSchema(vehicles: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: vehicles.slice(0, 10).map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: `${vehicle.brand_name} ${vehicle.name}`,
        url: `${SITE_URL}/veiculos/${vehicle.slug}`,
        image: vehicle.primary_image,
        offers: {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock"
        }
      }
    }))
  }
}

// WebSite Schema - Para busca
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Concessionária de veículos novos e seminovos em Taubaté",
    publisher: {
      "@id": `${SITE_URL}/#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/veiculos?busca={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    inLanguage: "pt-BR"
  }
}
