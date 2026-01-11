import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  // Limpar dados
  await sql`DELETE FROM vehicle_images`
  await sql`DELETE FROM vehicles`

  console.log("[v0] Adding sedans...")

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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${corolla[0].id}, '/vehicles/sedan-toyota-corolla.jpg', 'Toyota Corolla XEi 2024', 1, true)
  `

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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${civic[0].id}, '/vehicles/sedan-honda-civic.jpg', 'Honda Civic Touring 2024', 1, true)
  `

  console.log("[v0] Sedans added!")
  console.log("[v0] Adding SUVs...")

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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${rav4[0].id}, '/vehicles/suv-toyota-rav4.jpg', 'Toyota RAV4 Hybrid 2024', 1, true)
  `

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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${crv[0].id}, '/vehicles/suv-honda-crv.jpg', 'Honda CR-V 2024', 1, true)
  `

  console.log("[v0] SUVs added!")
  console.log("[v0] Adding hatchbacks...")

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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${polo[0].id}, '/vehicles/hatch-vw-polo.jpg', 'VW Polo GTS 2024', 1, true)
  `

  const onix = await sql`
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

  await sql`
    INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
    VALUES (${onix[0].id}, '/vehicles/hatch-chevrolet-onix.jpg', 'Chevrolet Onix RS 2024', 1, true)
  `

  console.log("[v0] Hatchbacks added!")
  console.log("[v0] Database populated successfully!")
}

main()
