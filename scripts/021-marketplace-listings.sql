-- Tabela para gerenciar listings em marketplaces
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  marketplace VARCHAR(50) NOT NULL, -- olx, webmotors, mercadolivre, icarros
  external_id VARCHAR(255), -- ID do anuncio no marketplace
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, paused, error, removed
  url TEXT, -- URL do anuncio no marketplace
  last_sync TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vehicle_id, marketplace)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_vehicle ON marketplace_listings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_marketplace ON marketplace_listings(marketplace);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);

-- Tabela para configuracoes de marketplaces
CREATE TABLE IF NOT EXISTS marketplace_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace VARCHAR(50) UNIQUE NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  account_id VARCHAR(255),
  is_active BOOLEAN DEFAULT false,
  auto_sync BOOLEAN DEFAULT false,
  sync_interval_hours INT DEFAULT 24,
  last_full_sync TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir marketplaces padrao
INSERT INTO marketplace_settings (marketplace, is_active) VALUES
  ('olx', false),
  ('webmotors', false),
  ('mercadolivre', false),
  ('icarros', false)
ON CONFLICT (marketplace) DO NOTHING;

-- Tabela de logs de sync
CREATE TABLE IF NOT EXISTS marketplace_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace VARCHAR(50) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL, -- create, update, delete, sync
  status VARCHAR(20) NOT NULL, -- success, error
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  duration_ms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_sync_logs_marketplace ON marketplace_sync_logs(marketplace);
CREATE INDEX IF NOT EXISTS idx_marketplace_sync_logs_created ON marketplace_sync_logs(created_at DESC);
