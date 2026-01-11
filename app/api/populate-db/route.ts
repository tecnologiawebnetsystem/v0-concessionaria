import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Limpar veículos
    await sql`DELETE FROM vehicle_images`
    await sql`DELETE FROM vehicles`

    // SEDANS
    const corolla = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_featured, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='toyota' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='sedans' LIMIT 1),
        'Toyota Corolla XEi 2.0',
        'toyota-corolla-xei-2024',
        'Corolla XEi',
        2024,
        145900,
        0,
        'Prata',
        'Flex',
        'Automático CVT',
        '2.0 16V',
        'Sedan médio mais vendido do Brasil. Conforto, economia e tecnologia de ponta.',
        'available',
        true,
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${corolla[0].id}, '/vehicles/sedan-toyota-corolla.jpg', 'Toyota Corolla XEi 2024', 1, true)`

    const civic = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_featured, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='honda' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='sedans' LIMIT 1),
        'Honda Civic Touring',
        'honda-civic-touring-2024',
        'Civic Touring',
        2024,
        189900,
        0,
        'Preto',
        'Gasolina',
        'Automático CVT',
        '1.5 Turbo 173cv',
        'Design arrojado e motor turbo potente. O sedan premium mais desejado.',
        'available',
        true,
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${civic[0].id}, '/vehicles/sedan-honda-civic.jpg', 'Honda Civic Touring 2024', 1, true)`

    const jetta = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='volkswagen' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='sedans' LIMIT 1),
        'Volkswagen Jetta GLi',
        'vw-jetta-gli-2024',
        'Jetta GLi',
        2024,
        167900,
        0,
        'Branco',
        'Gasolina',
        'Automático',
        '1.4 TSI 150cv',
        'Sedan alemão com tecnologia avançada e design sofisticado.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${jetta[0].id}, '/vehicles/sedan-vw-jetta.jpg', 'VW Jetta GLi 2024', 1, true)`

    const onixPlus = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='chevrolet' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='sedans' LIMIT 1),
        'Chevrolet Onix Plus Premier',
        'chevrolet-onix-plus-2024',
        'Onix Plus',
        2024,
        98900,
        0,
        'Vermelho',
        'Flex',
        'Automático',
        '1.0 Turbo',
        'Sedan compacto mais moderno do Brasil com motor turbo eficiente.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${onixPlus[0].id}, '/vehicles/sedan-chevrolet-onix.jpg', 'Chevrolet Onix Plus 2024', 1, true)`

    const cronos = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='fiat' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='sedans' LIMIT 1),
        'Fiat Cronos Precision',
        'fiat-cronos-precision-2023',
        'Cronos',
        2023,
        82900,
        15000,
        'Cinza',
        'Flex',
        'Automático',
        '1.8 16V',
        'Sedan italiano com ótimo custo-benefício. Seminovo em perfeito estado.',
        'available',
        false,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${cronos[0].id}, '/vehicles/sedan-fiat-cronos.jpg', 'Fiat Cronos 2023', 1, true)`

    // SUVS
    const rav4 = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_featured, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='toyota' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='suvs' LIMIT 1),
        'Toyota RAV4 Hybrid',
        'toyota-rav4-hybrid-2024',
        'RAV4',
        2024,
        249900,
        0,
        'Branco Pérola',
        'Híbrido',
        'Automático',
        '2.5 Híbrido',
        'SUV híbrido premium com tecnologia Toyota de ponta e economia surpreendente.',
        'available',
        true,
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${rav4[0].id}, '/vehicles/suv-toyota-rav4.jpg', 'Toyota RAV4 Hybrid 2024', 1, true)`

    const crv = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_featured, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='honda' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='suvs' LIMIT 1),
        'Honda CR-V Touring',
        'honda-crv-touring-2024',
        'CR-V',
        2024,
        229900,
        0,
        'Preto',
        'Gasolina',
        'Automático CVT',
        '1.5 Turbo',
        'SUV médio premium com espaço e conforto excepcionais.',
        'available',
        true,
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${crv[0].id}, '/vehicles/suv-honda-crv.jpg', 'Honda CR-V 2024', 1, true)`

    const tiguan = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='volkswagen' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='suvs' LIMIT 1),
        'VW Tiguan Allspace',
        'vw-tiguan-allspace-2024',
        'Tiguan',
        2024,
        239900,
        0,
        'Cinza',
        'Gasolina',
        'Automático',
        '1.4 TSI',
        'SUV 7 lugares com qualidade e tecnologia alemã.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${tiguan[0].id}, '/vehicles/suv-volkswagen-tiguan.jpg', 'VW Tiguan 2024', 1, true)`

    const tracker = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='chevrolet' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='suvs' LIMIT 1),
        'Chevrolet Tracker Premier',
        'chevrolet-tracker-premier-2024',
        'Tracker',
        2024,
        159900,
        0,
        'Vermelho',
        'Flex',
        'Automático',
        '1.2 Turbo',
        'SUV compacto moderno e econômico ideal para família.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${tracker[0].id}, '/vehicles/suv-chevrolet-tracker.jpg', 'Chevrolet Tracker 2024', 1, true)`

    // HATCHBACKS
    const polo = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='volkswagen' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='hatchbacks' LIMIT 1),
        'VW Polo GTS',
        'vw-polo-gts-2024',
        'Polo GTS',
        2024,
        119900,
        0,
        'Branco',
        'Flex',
        'Automático',
        '1.0 TSI',
        'Hatch premium com design esportivo e tecnologia VW.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${polo[0].id}, '/vehicles/hatch-vw-polo.jpg', 'VW Polo GTS 2024', 1, true)`

    const onixRS = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_featured, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='chevrolet' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='hatchbacks' LIMIT 1),
        'Chevrolet Onix RS',
        'chevrolet-onix-rs-2024',
        'Onix RS',
        2024,
        94900,
        0,
        'Vermelho',
        'Flex',
        'Automático',
        '1.0 Turbo',
        'Hatch compacto mais vendido do Brasil com visual esportivo.',
        'available',
        true,
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${onixRS[0].id}, '/vehicles/hatch-chevrolet-onix.jpg', 'Chevrolet Onix RS 2024', 1, true)`

    const argo = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='fiat' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='hatchbacks' LIMIT 1),
        'Fiat Argo Trekking',
        'fiat-argo-trekking-2024',
        'Argo',
        2024,
        89900,
        0,
        'Cinza',
        'Flex',
        'Automático',
        '1.3 Firefly',
        'Hatch aventureiro com estilo único e economia.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${argo[0].id}, '/vehicles/hatch-fiat-argo.jpg', 'Fiat Argo 2024', 1, true)`

    const cityHatch = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, is_new, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='honda' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='hatchbacks' LIMIT 1),
        'Honda City Hatch EXL',
        'honda-city-hatch-2024',
        'City Hatch',
        2024,
        109900,
        0,
        'Azul',
        'Flex',
        'Automático CVT',
        '1.5 16V',
        'Hatch médio com qualidade Honda e baixo consumo.',
        'available',
        true,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${cityHatch[0].id}, '/vehicles/hatch-honda-city.jpg', 'Honda City Hatch 2024', 1, true)`

    const yaris = await sql`
      INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, status, published, published_at)
      VALUES (
        (SELECT id FROM brands WHERE slug='toyota' LIMIT 1),
        (SELECT id FROM vehicle_categories WHERE slug='hatchbacks' LIMIT 1),
        'Toyota Yaris XLS',
        'toyota-yaris-xls-2023',
        'Yaris',
        2023,
        89900,
        18000,
        'Prata',
        'Flex',
        'Automático',
        '1.5 16V',
        'Hatch compacto econômico. Seminovo com revisões em dia.',
        'available',
        false,
        true,
        NOW()
      ) RETURNING id
    `
    await sql`INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary) VALUES (${yaris[0].id}, '/vehicles/hatch-toyota-yaris.jpg', 'Toyota Yaris 2023', 1, true)`

    return NextResponse.json({ success: true, message: "14 veículos adicionados com sucesso!" })
  } catch (error: any) {
    console.error("[v0] Erro ao popular banco:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
