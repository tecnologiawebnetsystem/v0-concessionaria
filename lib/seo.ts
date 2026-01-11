export function generateVehicleStructuredData(vehicle: any, images: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.name,
    description: vehicle.description || `${vehicle.name} ${vehicle.year}`,
    brand: {
      "@type": "Brand",
      name: vehicle.brand_name,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage || 0,
      unitCode: "KMT",
    },
    fuelType: vehicle.fuel_type,
    color: vehicle.color,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "BRL",
      availability: vehicle.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "AutoDealer",
        name: "Nacional Veículos",
      },
    },
    image: images.map((img) => img.url),
  }
}

export function generateBlogPostStructuredData(post: any, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featured_image,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Nacional Veículos",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nacionalveiculos.com.br"}/logo.png`,
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
  }
}
