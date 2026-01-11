import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function seedVehicles() {
  console.log("[v0] Starting vehicle seed...")

  // Get category and brand IDs
  const [sedansCategory] = await sql`SELECT id FROM vehicle_categories WHERE slug = 'sedans'`
  const [suvsCategory] = await sql`SELECT id FROM vehicle_categories WHERE slug = 'suvs'`
  const [hatchbacksCategory] = await sql`SELECT id FROM vehicle_categories WHERE slug = 'hatchbacks'`
  const [pickupsCategory] = await sql`SELECT id FROM vehicle_categories WHERE slug = 'pickups'`
  const [esportivosCategory] = await sql`SELECT id FROM vehicle_categories WHERE slug = 'esportivos'`

  const [toyotaBrand] = await sql`SELECT id FROM brands WHERE slug = 'toyota'`
  const [hondaBrand] = await sql`SELECT id FROM brands WHERE slug = 'honda'`
  const [fordBrand] = await sql`SELECT id FROM brands WHERE slug = 'ford'`
  const [chevroletBrand] = await sql`SELECT id FROM brands WHERE slug = 'chevrolet'`
  const [vwBrand] = await sql`SELECT id FROM brands WHERE slug = 'volkswagen'`
  const [fiatBrand] = await sql`SELECT id FROM brands WHERE slug = 'fiat'`

  // Sedans
  const sedans = [
    {
      brand_id: toyotaBrand.id,
      category_id: sedansCategory.id,
      name: "Toyota Corolla XEi 2.0",
      slug: "toyota-corolla-xei-2024",
      model: "Corolla XEi",
      year: 2024,
      price: 145900,
      mileage: 0,
      color: "Prata",
      fuel_type: "Flex",
      transmission: "Automático CVT",
      engine: "2.0 16V",
      description: "Sedan médio mais vendido do Brasil com tecnologia de ponta.",
      features: JSON.stringify(['Central multimídia 9"', "Câmera de ré", "Sensor de estacionamento"]),
      specifications: JSON.stringify({ portas: 4, airbags: 7 }),
      status: "available",
      is_featured: true,
      is_new: true,
      published: true,
      published_at: new Date(),
    },
    {
      brand_id: hondaBrand.id,
      category_id: sedansCategory.id,
      name: "Honda Civic Touring",
      slug: "honda-civic-touring-2024",
      model: "Civic Touring",
      year: 2024,
      price: 189900,
      mileage: 0,
      color: "Preto",
      fuel_type: "Gasolina",
      transmission: "Automático CVT",
      engine: "1.5 Turbo",
      description: "Design arrojado com motor turbo potente de 173cv.",
      features: JSON.stringify(["Motor turbo", "Teto solar", "Honda Sensing"]),
      specifications: JSON.stringify({ portas: 4, airbags: 6 }),
      status: "available",
      is_featured: true,
      is_new: true,
      published: true,
      published_at: new Date(),
    },
    // Continue com mais 8 sedans...
  ]

  for (const vehicle of sedans) {
    try {
      const [insertedVehicle] = await sql`
        INSERT INTO vehicles ${sql([vehicle], ...Object.keys(vehicle))}
        ON CONFLICT (slug) DO NOTHING
        RETURNING id, slug
      `

      if (insertedVehicle) {
        console.log(`[v0] Added vehicle: ${insertedVehicle.slug}`)

        // Add images
        await sql`
          INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
          VALUES (
            ${insertedVehicle.id},
            ${`/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(vehicle.name + " front view")}`},
            ${`${vehicle.name} - Vista Frontal`},
            1,
            true
          )
        `

        await sql`
          INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
          VALUES (
            ${insertedVehicle.id},
            ${`/placeholder.svg?height=800&width=1200&query=${encodeURIComponent(vehicle.name + " side view")}`},
            ${`${vehicle.name} - Vista Lateral`},
            2,
            false
          )
        `
      }
    } catch (error) {
      console.error(`[v0] Error adding ${vehicle.slug}:`, error)
    }
  }

  console.log("[v0] Vehicle seed completed!")
}

seedVehicles().catch(console.error)
