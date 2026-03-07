import { sql } from "@/lib/db"

// Tipos
export interface MarketplaceVehicle {
  id: string
  title: string
  description: string
  price: number
  year: number
  mileage: number
  brand: string
  model: string
  version?: string
  color: string
  fuelType: string
  transmission: string
  doors?: number
  plate?: string
  images: string[]
  features: string[]
  location: {
    city: string
    state: string
    cep?: string
  }
}

export interface MarketplaceListing {
  id: string
  vehicleId: string
  marketplace: 'olx' | 'webmotors' | 'mercadolivre' | 'icarros'
  externalId?: string
  status: 'pending' | 'active' | 'paused' | 'error' | 'removed'
  lastSync?: Date
  errorMessage?: string
}

// Mapeamentos de campos para cada marketplace
const FUEL_TYPE_MAP: Record<string, Record<string, string>> = {
  olx: {
    'Gasolina': 'gasoline',
    'Etanol': 'ethanol',
    'Flex': 'flex',
    'Diesel': 'diesel',
    'Eletrico': 'electric',
    'Hibrido': 'hybrid'
  },
  webmotors: {
    'Gasolina': 'G',
    'Etanol': 'A',
    'Flex': 'F',
    'Diesel': 'D',
    'Eletrico': 'E',
    'Hibrido': 'H'
  }
}

const TRANSMISSION_MAP: Record<string, Record<string, string>> = {
  olx: {
    'Manual': 'manual',
    'Automatico': 'automatic',
    'CVT': 'cvt',
    'Automatizada': 'automated'
  },
  webmotors: {
    'Manual': 'M',
    'Automatico': 'A',
    'CVT': 'C',
    'Automatizada': 'S'
  }
}

// Funcao para buscar veiculo formatado para marketplace
export async function getVehicleForMarketplace(vehicleId: string): Promise<MarketplaceVehicle | null> {
  const vehicles = await sql`
    SELECT 
      v.*,
      b.name as brand_name,
      array_agg(DISTINCT vi.url) FILTER (WHERE vi.url IS NOT NULL) as images
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_images vi ON vi.vehicle_id = v.id
    WHERE v.id = ${vehicleId}
    GROUP BY v.id, b.name
  `

  if (vehicles.length === 0) return null

  const v = vehicles[0]

  return {
    id: v.id,
    title: `${v.brand_name} ${v.name} ${v.year}`,
    description: v.description || generateDescription(v),
    price: Number(v.price),
    year: v.year,
    mileage: v.mileage ? Number(v.mileage) : 0,
    brand: v.brand_name,
    model: v.name,
    version: v.model,
    color: v.color || 'Nao informado',
    fuelType: v.fuel_type || 'Flex',
    transmission: v.transmission || 'Manual',
    doors: v.doors || 4,
    plate: v.plate,
    images: v.images || [],
    features: v.features || [],
    location: {
      city: 'Sao Jose dos Campos',
      state: 'SP',
      cep: '12200-000'
    }
  }
}

function generateDescription(vehicle: any): string {
  const lines = [
    `${vehicle.brand_name} ${vehicle.name} ${vehicle.year}`,
    '',
    'CARACTERISTICAS:',
    `- Ano: ${vehicle.year}`,
    vehicle.mileage ? `- Km: ${Number(vehicle.mileage).toLocaleString('pt-BR')}` : null,
    vehicle.fuel_type ? `- Combustivel: ${vehicle.fuel_type}` : null,
    vehicle.transmission ? `- Cambio: ${vehicle.transmission}` : null,
    vehicle.color ? `- Cor: ${vehicle.color}` : null,
    vehicle.engine ? `- Motor: ${vehicle.engine}` : null,
    '',
    'Veiculo revisado e com garantia!',
    '',
    'Financiamos em ate 60x',
    'Aceitamos seu usado como entrada',
    '',
    'Venha conferir!'
  ]

  return lines.filter(Boolean).join('\n')
}

// Export para formato OLX
export function formatForOLX(vehicle: MarketplaceVehicle): Record<string, any> {
  return {
    subject: vehicle.title,
    body: vehicle.description,
    category: 2020, // Carros, vans e utilitarios
    price: vehicle.price,
    params: {
      regdate: vehicle.year.toString(),
      mileage: vehicle.mileage,
      fuel: FUEL_TYPE_MAP.olx[vehicle.fuelType] || 'flex',
      gearbox: TRANSMISSION_MAP.olx[vehicle.transmission] || 'manual',
      carcolor: vehicle.color.toLowerCase(),
      carbrand: vehicle.brand.toLowerCase(),
      carmodel: vehicle.model.toLowerCase(),
    },
    images: vehicle.images.slice(0, 20), // OLX permite ate 20 imagens
    location: {
      zipcode: vehicle.location.cep,
      municipality: vehicle.location.city,
      uf: vehicle.location.state
    }
  }
}

// Export para formato Webmotors
export function formatForWebmotors(vehicle: MarketplaceVehicle): Record<string, any> {
  return {
    Titulo: vehicle.title,
    Descricao: vehicle.description,
    Preco: vehicle.price,
    Ano: vehicle.year,
    AnoModelo: vehicle.year,
    Km: vehicle.mileage,
    Combustivel: FUEL_TYPE_MAP.webmotors[vehicle.fuelType] || 'F',
    Cambio: TRANSMISSION_MAP.webmotors[vehicle.transmission] || 'M',
    Cor: vehicle.color,
    Marca: vehicle.brand,
    Modelo: vehicle.model,
    Versao: vehicle.version || '',
    Portas: vehicle.doors,
    Placa: vehicle.plate?.substring(0, 3) || '',
    Fotos: vehicle.images.slice(0, 30).map((url, i) => ({
      Url: url,
      Ordem: i + 1,
      Principal: i === 0
    })),
    Cidade: vehicle.location.city,
    Estado: vehicle.location.state
  }
}

// Export para formato Mercado Livre
export function formatForMercadoLivre(vehicle: MarketplaceVehicle): Record<string, any> {
  return {
    title: vehicle.title.substring(0, 60),
    category_id: 'MLB1744', // Carros
    price: vehicle.price,
    currency_id: 'BRL',
    available_quantity: 1,
    buying_mode: 'classified',
    listing_type_id: 'gold_special',
    condition: 'used',
    description: { plain_text: vehicle.description },
    pictures: vehicle.images.slice(0, 12).map(url => ({ source: url })),
    attributes: [
      { id: 'BRAND', value_name: vehicle.brand },
      { id: 'MODEL', value_name: vehicle.model },
      { id: 'VEHICLE_YEAR', value_name: vehicle.year.toString() },
      { id: 'KILOMETERS', value_name: vehicle.mileage.toString() },
      { id: 'FUEL_TYPE', value_name: vehicle.fuelType },
      { id: 'TRANSMISSION', value_name: vehicle.transmission },
      { id: 'COLOR', value_name: vehicle.color },
    ]
  }
}

// Export para formato iCarros
export function formatForICarros(vehicle: MarketplaceVehicle): Record<string, any> {
  return {
    titulo: vehicle.title,
    descricao: vehicle.description,
    valor: vehicle.price,
    ano_fabricacao: vehicle.year,
    ano_modelo: vehicle.year,
    quilometragem: vehicle.mileage,
    combustivel: vehicle.fuelType,
    cambio: vehicle.transmission,
    cor: vehicle.color,
    marca: vehicle.brand,
    modelo: vehicle.model,
    versao: vehicle.version,
    fotos: vehicle.images,
    cidade: vehicle.location.city,
    estado: vehicle.location.state
  }
}

// Salvar listing no banco
export async function saveMarketplaceListing(
  vehicleId: string,
  marketplace: string,
  externalId?: string,
  status: string = 'pending'
): Promise<void> {
  await sql`
    INSERT INTO marketplace_listings (vehicle_id, marketplace, external_id, status, created_at, updated_at)
    VALUES (${vehicleId}, ${marketplace}, ${externalId || null}, ${status}, NOW(), NOW())
    ON CONFLICT (vehicle_id, marketplace) 
    DO UPDATE SET external_id = ${externalId || null}, status = ${status}, updated_at = NOW()
  `
}

// Buscar listings de um veiculo
export async function getVehicleListings(vehicleId: string): Promise<MarketplaceListing[]> {
  const listings = await sql`
    SELECT * FROM marketplace_listings WHERE vehicle_id = ${vehicleId}
  `
  return listings as MarketplaceListing[]
}

// Gerar XML para integracao em lote (feed)
export async function generateMarketplaceFeed(marketplace: string): Promise<string> {
  const vehicles = await sql`
    SELECT 
      v.*,
      b.name as brand_name,
      array_agg(DISTINCT vi.url) FILTER (WHERE vi.url IS NOT NULL) as images
    FROM vehicles v
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN vehicle_images vi ON vi.vehicle_id = v.id
    WHERE v.status = 'available' OR v.status = 'active'
    GROUP BY v.id, b.name
  `

  if (marketplace === 'webmotors') {
    return generateWebmotorsFeed(vehicles)
  }

  if (marketplace === 'olx') {
    return generateOLXFeed(vehicles)
  }

  return ''
}

function generateWebmotorsFeed(vehicles: any[]): string {
  const items = vehicles.map(v => {
    const vehicle = {
      id: v.id,
      title: `${v.brand_name} ${v.name} ${v.year}`,
      description: v.description || '',
      price: Number(v.price),
      year: v.year,
      mileage: v.mileage ? Number(v.mileage) : 0,
      brand: v.brand_name,
      model: v.name,
      version: v.model,
      color: v.color || '',
      fuelType: v.fuel_type || 'Flex',
      transmission: v.transmission || 'Manual',
      images: v.images || [],
      location: { city: 'Sao Jose dos Campos', state: 'SP' }
    }
    return formatForWebmotors(vehicle as MarketplaceVehicle)
  })

  return JSON.stringify({ veiculos: items }, null, 2)
}

function generateOLXFeed(vehicles: any[]): string {
  const items = vehicles.map(v => {
    const vehicle = {
      id: v.id,
      title: `${v.brand_name} ${v.name} ${v.year}`,
      description: v.description || '',
      price: Number(v.price),
      year: v.year,
      mileage: v.mileage ? Number(v.mileage) : 0,
      brand: v.brand_name,
      model: v.name,
      color: v.color || '',
      fuelType: v.fuel_type || 'Flex',
      transmission: v.transmission || 'Manual',
      images: v.images || [],
      location: { city: 'Sao Jose dos Campos', state: 'SP', cep: '12200-000' }
    }
    return formatForOLX(vehicle as MarketplaceVehicle)
  })

  return JSON.stringify({ ads: items }, null, 2)
}
