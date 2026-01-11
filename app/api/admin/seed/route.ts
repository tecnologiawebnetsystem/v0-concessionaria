import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)

    if (!user || user.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get categories and brands
    const categories = await sql`SELECT id, slug FROM vehicle_categories WHERE is_active = true`
    const brands = await sql`SELECT id, slug FROM brands WHERE is_active = true`

    const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))
    const brandMap = Object.fromEntries(brands.map((b) => [b.slug, b.id]))

    let vehiclesAdded = 0

    // Sedans
    const sedansData = [
      {
        brand: "toyota",
        name: "Toyota Corolla XEi",
        slug: "toyota-corolla-xei-2024",
        year: 2024,
        price: 145900,
        color: "Prata",
        fuel: "Flex",
        trans: "Automático CVT",
        desc: "Sedan médio mais vendido do Brasil",
        features: '["Central multimídia 9\\"", "Câmera de ré", "Sensor de estacionamento"]',
        images: [
          "/vehicles/sedan-toyota-corolla.jpg",
          "/vehicles/sedan-toyota-corolla.jpg",
          "/vehicles/sedan-toyota-corolla.jpg",
        ],
      },
      {
        brand: "honda",
        name: "Honda Civic Touring",
        slug: "honda-civic-touring-2024",
        year: 2024,
        price: 189900,
        color: "Preto",
        fuel: "Gasolina",
        trans: "Automático CVT",
        desc: "Design arrojado com motor turbo",
        features: '["Motor turbo 173cv", "Teto solar panorâmico", "Honda Sensing"]',
        images: [
          "/vehicles/sedan-honda-civic.jpg",
          "/vehicles/sedan-honda-civic.jpg",
          "/vehicles/sedan-honda-civic.jpg",
        ],
      },
      {
        brand: "volkswagen",
        name: "VW Jetta GLi",
        slug: "vw-jetta-gli-2024",
        year: 2024,
        price: 167900,
        color: "Branco",
        fuel: "Gasolina",
        trans: "Automático",
        desc: "Sedan alemão premium",
        features: '["Tela 10\\"", "VW Play", "Faróis Full LED"]',
        images: ["/vehicles/sedan-vw-jetta.jpg", "/vehicles/sedan-vw-jetta.jpg", "/vehicles/sedan-vw-jetta.jpg"],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Onix Plus",
        slug: "chevrolet-onix-plus-2024",
        year: 2024,
        price: 98900,
        color: "Vermelho",
        fuel: "Flex",
        trans: "Automático",
        desc: "Sedan compacto moderno",
        features: '["MyLink 8\\"", "Ar automático", "Câmera traseira"]',
        images: [
          "/vehicles/sedan-chevrolet-onix.jpg",
          "/vehicles/sedan-chevrolet-onix.jpg",
          "/vehicles/sedan-chevrolet-onix.jpg",
        ],
      },
      {
        brand: "fiat",
        name: "Fiat Cronos Precision",
        slug: "fiat-cronos-precision-2023",
        year: 2023,
        price: 82900,
        color: "Cinza",
        fuel: "Flex",
        trans: "Automático",
        desc: "Sedan italiano econômico",
        features: '["Uconnect 7\\"", "Ar automático", "Sensor traseiro"]',
        images: [
          "/vehicles/sedan-fiat-cronos.jpg",
          "/vehicles/sedan-fiat-cronos.jpg",
          "/vehicles/sedan-fiat-cronos.jpg",
        ],
      },
      {
        brand: "toyota",
        name: "Toyota Corolla Hybrid",
        slug: "toyota-corolla-hybrid-2024",
        year: 2024,
        price: 179900,
        color: "Azul",
        fuel: "Híbrido",
        trans: "Automático CVT",
        desc: "Tecnologia híbrida premium",
        features: '["Sistema híbrido", "Painel digital", "Assistente de voz"]',
        images: [
          "/vehicles/sedan-toyota-corolla.jpg",
          "/vehicles/sedan-toyota-corolla.jpg",
          "/vehicles/sedan-toyota-corolla.jpg",
        ],
      },
      {
        brand: "honda",
        name: "Honda Accord EX",
        slug: "honda-accord-ex-2023",
        year: 2023,
        price: 198900,
        color: "Cinza",
        fuel: "Gasolina",
        trans: "Automático",
        desc: "Sedan executivo premium",
        features: '["Bancos em couro", "Teto solar", "Sistema de som premium"]',
        images: [
          "/vehicles/sedan-honda-civic.jpg",
          "/vehicles/sedan-honda-civic.jpg",
          "/vehicles/sedan-honda-civic.jpg",
        ],
      },
      {
        brand: "volkswagen",
        name: "VW Virtus GTS",
        slug: "vw-virtus-gts-2024",
        year: 2024,
        price: 129900,
        color: "Branco",
        fuel: "Flex",
        trans: "Automático",
        desc: "Sedan esportivo nacional",
        features: '["Motor 1.0 TSI", "Rodas 17\\"", "Suspensão esportiva"]',
        images: ["/vehicles/sedan-vw-jetta.jpg", "/vehicles/sedan-vw-jetta.jpg", "/vehicles/sedan-vw-jetta.jpg"],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Cruze LTZ",
        slug: "chevrolet-cruze-ltz-2023",
        year: 2023,
        price: 112900,
        color: "Preto",
        fuel: "Flex",
        trans: "Automático",
        desc: "Sedan médio sofisticado",
        features: '["MyLink", "Ar digital", "Bancos em couro"]',
        images: [
          "/vehicles/sedan-chevrolet-onix.jpg",
          "/vehicles/sedan-chevrolet-onix.jpg",
          "/vehicles/sedan-chevrolet-onix.jpg",
        ],
      },
      {
        brand: "fiat",
        name: "Fiat Cronos Drive",
        slug: "fiat-cronos-drive-2024",
        year: 2024,
        price: 79900,
        color: "Prata",
        fuel: "Flex",
        trans: "Manual",
        desc: "Custo-benefício imbatível",
        features: '["Ar-condicionado", "Direção elétrica", "Vidros elétricos"]',
        images: [
          "/vehicles/sedan-fiat-cronos.jpg",
          "/vehicles/sedan-fiat-cronos.jpg",
          "/vehicles/sedan-fiat-cronos.jpg",
        ],
      },
    ]

    // SUVs
    const suvsData = [
      {
        brand: "toyota",
        name: "Toyota Corolla Cross XRE",
        slug: "toyota-corolla-cross-xre-2024",
        year: 2024,
        price: 169900,
        color: "Branco Pérola",
        fuel: "Flex",
        trans: "Automático CVT",
        desc: "SUV moderno e tecnológico",
        features: '["Tração AWD", "Central 9\\"", "Toyota Safety Sense"]',
        images: ["/vehicles/suv-toyota-rav4.jpg", "/vehicles/suv-toyota-rav4.jpg", "/vehicles/suv-toyota-rav4.jpg"],
      },
      {
        brand: "honda",
        name: "Honda HR-V Touring",
        slug: "honda-hrv-touring-2024",
        year: 2024,
        price: 179900,
        color: "Vermelho",
        fuel: "Gasolina",
        trans: "Automático CVT",
        desc: "SUV compacto premium",
        features: '["Teto solar", "Honda Sensing", "Bancos em couro"]',
        images: ["/vehicles/suv-honda-crv.jpg", "/vehicles/suv-honda-crv.jpg", "/vehicles/suv-honda-crv.jpg"],
      },
      {
        brand: "volkswagen",
        name: "VW Taos Highline",
        slug: "vw-taos-highline-2024",
        year: 2024,
        price: 189900,
        color: "Cinza",
        fuel: "Gasolina",
        trans: "Automático",
        desc: "SUV alemão robusto",
        features: '["IQ.Drive", "Tela 10\\"", "Faróis Matrix LED"]',
        images: [
          "/vehicles/suv-volkswagen-tiguan.jpg",
          "/vehicles/suv-volkswagen-tiguan.jpg",
          "/vehicles/suv-volkswagen-tiguan.jpg",
        ],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Tracker Premier",
        slug: "chevrolet-tracker-premier-2024",
        year: 2024,
        price: 149900,
        color: "Azul",
        fuel: "Flex",
        trans: "Automático",
        desc: "SUV conectado e moderno",
        features: '["MyLink Plus", "OnStar", "Câmera 360°"]',
        images: [
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
        ],
      },
      {
        brand: "fiat",
        name: "Fiat Pulse Abarth",
        slug: "fiat-pulse-abarth-2024",
        year: 2024,
        price: 139900,
        color: "Preto",
        fuel: "Flex",
        trans: "Automático",
        desc: "SUV esportivo italiano",
        features: '["Motor turbo 185cv", "Suspensão esportiva", "Rodas 18\\""]',
        images: ["/vehicles/suv-jeep-compass.jpg", "/vehicles/suv-jeep-compass.jpg", "/vehicles/suv-jeep-compass.jpg"],
      },
      {
        brand: "ford",
        name: "Ford Territory Titanium",
        slug: "ford-territory-titanium-2024",
        year: 2024,
        price: 219900,
        color: "Branco",
        fuel: "Gasolina",
        trans: "Automático",
        desc: "SUV tecnológico premium",
        features: '["SYNC 4", "Tela 12.3\\"", "Co-Pilot 360"]',
        images: [
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
        ],
      },
      {
        brand: "toyota",
        name: "Toyota RAV4 Hybrid",
        slug: "toyota-rav4-hybrid-2024",
        year: 2024,
        price: 289900,
        color: "Prata",
        fuel: "Híbrido",
        trans: "Automático CVT",
        desc: "SUV híbrido avançado",
        features: '["Tração AWD", "Sistema híbrido", "Interior premium"]',
        images: ["/vehicles/suv-toyota-rav4.jpg", "/vehicles/suv-toyota-rav4.jpg", "/vehicles/suv-toyota-rav4.jpg"],
      },
      {
        brand: "honda",
        name: "Honda WR-V EXL",
        slug: "honda-wrv-exl-2024",
        year: 2024,
        price: 129900,
        color: "Laranja",
        fuel: "Flex",
        trans: "Automático CVT",
        desc: "SUV compacto versátil",
        features: '["Central touchscreen", "Câmera de ré", "Controle de estabilidade"]',
        images: ["/vehicles/suv-honda-crv.jpg", "/vehicles/suv-honda-crv.jpg", "/vehicles/suv-honda-crv.jpg"],
      },
      {
        brand: "volkswagen",
        name: "VW Nivus Highline",
        slug: "vw-nivus-highline-2024",
        year: 2024,
        price: 139900,
        color: "Cinza",
        fuel: "Flex",
        trans: "Automático",
        desc: "SUV coupé elegante",
        features: '["VW Play", "Ar digital", "Rodas diamantadas 17\\""]',
        images: [
          "/vehicles/suv-volkswagen-tiguan.jpg",
          "/vehicles/suv-volkswagen-tiguan.jpg",
          "/vehicles/suv-volkswagen-tiguan.jpg",
        ],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Equinox Premier",
        slug: "chevrolet-equinox-premier-2023",
        year: 2023,
        price: 179900,
        color: "Preto",
        fuel: "Gasolina",
        trans: "Automático",
        desc: "SUV médio espaçoso",
        features: '["7 lugares", "MyLink 8\\"", "Teto solar panorâmico"]',
        images: [
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
          "/vehicles/suv-chevrolet-tracker.jpg",
        ],
      },
    ]

    // Hatchbacks
    const hatchbacksData = [
      {
        brand: "volkswagen",
        name: "VW Polo Highline",
        slug: "vw-polo-highline-2024",
        year: 2024,
        price: 99900,
        color: "Vermelho",
        fuel: "Flex",
        trans: "Automático",
        desc: "Hatch premium compacto",
        features: '["VW Play", "Ar digital", "Sensor de estacionamento"]',
        images: [
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
        ],
      },
      {
        brand: "fiat",
        name: "Fiat Argo Trekking",
        slug: "fiat-argo-trekking-2024",
        year: 2024,
        price: 89900,
        color: "Branco",
        fuel: "Flex",
        trans: "Automático",
        desc: "Hatch aventureiro",
        features: '["Visual off-road", "Proteções externas", "Rodas exclusivas"]',
        images: ["/vehicles/hatch-fiat-argo.jpg", "/vehicles/hatch-fiat-argo.jpg", "/vehicles/hatch-fiat-argo.jpg"],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Onix Turbo",
        slug: "chevrolet-onix-turbo-2024",
        year: 2024,
        price: 94900,
        color: "Azul",
        fuel: "Flex",
        trans: "Automático",
        desc: "Hatch mais vendido do Brasil",
        features: '["Motor turbo", "MyLink", "Ar automático"]',
        images: [
          "/vehicles/hatch-chevrolet-onix.jpg",
          "/vehicles/hatch-chevrolet-onix.jpg",
          "/vehicles/hatch-chevrolet-onix.jpg",
        ],
      },
      {
        brand: "toyota",
        name: "Toyota Yaris XLS",
        slug: "toyota-yaris-xls-2024",
        year: 2024,
        price: 109900,
        color: "Prata",
        fuel: "Flex",
        trans: "Automático CVT",
        desc: "Hatch compacto eficiente",
        features: '["Central 7\\"", "Câmera de ré", "Toyota Safety Sense"]',
        images: [
          "/vehicles/hatch-toyota-yaris.jpg",
          "/vehicles/hatch-toyota-yaris.jpg",
          "/vehicles/hatch-toyota-yaris.jpg",
        ],
      },
      {
        brand: "honda",
        name: "Honda City Hatchback",
        slug: "honda-city-hatchback-2024",
        year: 2024,
        price: 112900,
        color: "Cinza",
        fuel: "Gasolina",
        trans: "Automático CVT",
        desc: "Hatch sofisticado",
        features: '["Honda Sensing", "Painel digital", "Carregador wireless"]',
        images: ["/vehicles/hatch-honda-fit.jpg", "/vehicles/hatch-honda-fit.jpg", "/vehicles/hatch-honda-fit.jpg"],
      },
      {
        brand: "volkswagen",
        name: "VW Gol",
        slug: "vw-gol-2024",
        year: 2024,
        price: 69900,
        color: "Branco",
        fuel: "Flex",
        trans: "Manual",
        desc: "Clássico brasileiro",
        features: '["Ar-condicionado", "Direção elétrica", "Som com Bluetooth"]',
        images: [
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
        ],
      },
      {
        brand: "fiat",
        name: "Fiat Mobi Trekking",
        slug: "fiat-mobi-trekking-2024",
        year: 2024,
        price: 64900,
        color: "Verde",
        fuel: "Flex",
        trans: "Manual",
        desc: "Compacto econômico",
        features: '["Visual aventureiro", "Direção elétrica", "Computador de bordo"]',
        images: ["/vehicles/hatch-fiat-argo.jpg", "/vehicles/hatch-fiat-argo.jpg", "/vehicles/hatch-fiat-argo.jpg"],
      },
      {
        brand: "chevrolet",
        name: "Chevrolet Onix RS",
        slug: "chevrolet-onix-rs-2024",
        year: 2024,
        price: 104900,
        color: "Preto",
        fuel: "Flex",
        trans: "Automático",
        desc: "Versão esportiva",
        features: '["Visual RS", "Rodas 17\\"", "Suspensão esportiva"]',
        images: [
          "/vehicles/hatch-chevrolet-onix.jpg",
          "/vehicles/hatch-chevrolet-onix.jpg",
          "/vehicles/hatch-chevrolet-onix.jpg",
        ],
      },
      {
        brand: "toyota",
        name: "Toyota Etios XS",
        slug: "toyota-etios-xs-2023",
        year: 2023,
        price: 74900,
        color: "Prata",
        fuel: "Flex",
        trans: "Manual",
        desc: "Confiabilidade Toyota",
        features: '["Ar-condicionado", "Direção hidráulica", "Vidros elétricos"]',
        images: [
          "/vehicles/hatch-toyota-yaris.jpg",
          "/vehicles/hatch-toyota-yaris.jpg",
          "/vehicles/hatch-toyota-yaris.jpg",
        ],
      },
      {
        brand: "volkswagen",
        name: "VW T-Cross Sense",
        slug: "vw-tcross-sense-2024",
        year: 2024,
        price: 149900,
        color: "Azul",
        fuel: "Flex",
        trans: "Automático",
        desc: "SUV compacto premium",
        features: '["VW Play", "Ar digital", "Faróis LED"]',
        images: [
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
          "/vehicles/hatch-volkswagen-polo.jpg",
        ],
      },
    ]

    // Add all vehicles
    for (const vehicle of [...sedansData, ...suvsData, ...hatchbacksData]) {
      try {
        const result = await sql`
          INSERT INTO vehicles (
            brand_id, category_id, name, slug, model, year, price, mileage,
            color, fuel_type, transmission, engine, description, features,
            specifications, status, is_featured, is_new, published, published_at
          ) VALUES (
            ${brandMap[vehicle.brand]},
            ${sedansData.includes(vehicle) ? categoryMap["sedans"] : suvsData.includes(vehicle) ? categoryMap["suvs"] : categoryMap["hatchbacks"]},
            ${vehicle.name}, ${vehicle.slug}, ${vehicle.name.split(" ").slice(1).join(" ")},
            ${vehicle.year}, ${vehicle.price}, 0, ${vehicle.color}, ${vehicle.fuel},
            ${vehicle.trans}, '1.0', ${vehicle.desc}, ${vehicle.features}::jsonb,
            '{"portas": 4, "airbags": 4}'::jsonb, 'available',
            ${Math.random() > 0.7}, true, true, NOW()
          )
          ON CONFLICT (slug) DO NOTHING
          RETURNING id, slug
        `

        if (result.length > 0) {
          const vehicleId = result[0].id

          // Add 3 images per vehicle using real uploaded images
          await sql`
            INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
            VALUES
              (${vehicleId}, ${vehicle.images[0]}, ${`${vehicle.name} - Frontal`}, 1, true),
              (${vehicleId}, ${vehicle.images[1]}, ${`${vehicle.name} - Lateral`}, 2, false),
              (${vehicleId}, ${vehicle.images[2]}, ${`${vehicle.name} - Interior`}, 3, false)
          `

          vehiclesAdded++
        }
      } catch (error) {
        console.error(`[v0] Error adding ${vehicle.slug}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      vehiclesAdded,
      message: `${vehiclesAdded} veículos adicionados com sucesso!`,
    })
  } catch (error) {
    console.error("[v0] Seed error:", error)
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 })
  }
}
