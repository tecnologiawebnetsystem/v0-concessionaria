-- Sedans (10 veículos)
INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, features, specifications, status, is_featured, is_new, published, published_at)
SELECT 
  (SELECT id FROM brands WHERE slug = 'toyota'),
  (SELECT id FROM vehicle_categories WHERE slug = 'sedans'),
  'Toyota Corolla XEi 2.0',
  'toyota-corolla-xei-2024',
  'Corolla XEi',
  2024,
  145900.00,
  0,
  'Prata',
  'Flex',
  'Automático CVT',
  '2.0 16V',
  'Sedan médio mais vendido do Brasil, oferece conforto, economia e tecnologia de ponta com sistema híbrido opcional.',
  '["Central multimídia 9 polegadas", "Câmera de ré", "Sensor de estacionamento", "Controle de cruzeiro adaptativo", "Ar-condicionado digital dual zone", "Bancos em couro", "Faróis LED", "Chave presencial"]'::jsonb,
  '{"portas": 4, "airbags": 7, "porta_malas": "470 litros", "tanque": "50 litros", "consumo_cidade": "11.2 km/l", "consumo_estrada": "14.8 km/l"}'::jsonb,
  'available',
  true,
  true,
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = 'toyota-corolla-xei-2024');

INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, features, specifications, status, is_featured, is_new, published, published_at)
SELECT 
  (SELECT id FROM brands WHERE slug = 'honda'),
  (SELECT id FROM vehicle_categories WHERE slug = 'sedans'),
  'Honda Civic Touring',
  'honda-civic-touring-2024',
  'Civic Touring',
  2024,
  189900.00,
  0,
  'Preto',
  'Gasolina',
  'Automático CVT',
  '1.5 Turbo 16V',
  'Design arrojado e motor turbo potente. O sedan mais desejado da categoria premium com tecnologia Honda Sensing completa.',
  '["Motor turbo 1.5 173cv", "Teto solar panorâmico", "Sistema Honda Sensing", "Painel digital 10.2 polegadas", "Carregador wireless", "Bancos elétricos", "Piloto automático adaptativo", "Alerta de colisão frontal"]'::jsonb,
  '{"portas": 4, "airbags": 6, "porta_malas": "519 litros", "tanque": "47 litros", "consumo_cidade": "9.8 km/l", "consumo_estrada": "13.5 km/l"}'::jsonb,
  'available',
  true,
  true,
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = 'honda-civic-touring-2024');

INSERT INTO vehicles (brand_id, category_id, name, slug, model, year, price, mileage, color, fuel_type, transmission, engine, description, features, specifications, status, is_new, published, published_at)
SELECT 
  (SELECT id FROM brands WHERE slug = 'volkswagen'),
  (SELECT id FROM vehicle_categories WHERE slug = 'sedans'),
  'Volkswagen Jetta GLi',
  'volkswagen-jetta-gli-2024',
  'Jetta GLi',
  2024,
  167900.00,
  0,
  'Branco Cristal',
  'Gasolina',
  'Automático Tiptronic',
  '1.4 TSI 16V',
  'Sedan alemão com tecnologia e desempenho superior. Combina elegância europeia com eficiência do motor turbo.',
  '["Tela de 10 polegadas", "VW Play", "Faróis Full LED", "Controle de cruzeiro", "Câmera 360 graus", "Estacionamento automático", "Assistente de permanência em faixa", "Volante multifuncional em couro"]'::jsonb,
  '{"portas": 4, "airbags": 6, "porta_malas": "510 litros", "tanque": "50 litros", "consumo_cidade": "10.5 km/l", "consumo_estrada": "14.2 km/l"}'::jsonb,
  'available',
  true,
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE slug = 'volkswagen-jetta-gli-2024');

-- Adicionar imagens para os sedans
INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
SELECT 
  id,
  '/placeholder.svg?height=800&width=1200',
  'Toyota Corolla XEi 2024 - Vista Frontal',
  1,
  true
FROM vehicles WHERE slug = 'toyota-corolla-xei-2024'
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
SELECT 
  id,
  '/placeholder.svg?height=800&width=1200',
  'Toyota Corolla XEi 2024 - Vista Lateral',
  2,
  false
FROM vehicles WHERE slug = 'toyota-corolla-xei-2024'
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
SELECT 
  id,
  '/placeholder.svg?height=800&width=1200',
  'Honda Civic Touring 2024 - Vista Frontal',
  1,
  true
FROM vehicles WHERE slug = 'honda-civic-touring-2024'
ON CONFLICT DO NOTHING;

INSERT INTO vehicle_images (vehicle_id, url, alt_text, display_order, is_primary)
SELECT 
  id,
  '/placeholder.svg?height=800&width=1200',
  'VW Jetta GLi 2024 - Vista Frontal',
  1,
  true
FROM vehicles WHERE slug = 'volkswagen-jetta-gli-2024'
ON CONFLICT DO NOTHING;
