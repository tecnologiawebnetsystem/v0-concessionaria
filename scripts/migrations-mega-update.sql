-- =====================================================
-- MEGA UPDATE: Novas funcionalidades do sistema
-- =====================================================

-- 1. EXPERIENCIA VISUAL IMERSIVA
-- Tabela para imagens 360 e videos dos veiculos
CREATE TABLE IF NOT EXISTS vehicle_media_360 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('360_exterior', '360_interior', 'video', 'tour_virtual')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title VARCHAR(255),
  duration_seconds INTEGER, -- para videos
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_media_360_vehicle ON vehicle_media_360(vehicle_id);

-- 2. INTELIGENCIA ARTIFICIAL
-- Historico de conversas do chatbot
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB DEFAULT '{}', -- veiculos visualizados, preferencias detectadas
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_converted BOOLEAN DEFAULT false, -- se gerou lead/proposta
  sentiment_score DECIMAL(3,2), -- analise de sentimento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_user ON chatbot_conversations(user_id);

-- Recomendacoes personalizadas
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- para usuarios nao logados
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  score DECIMAL(5,4) NOT NULL, -- relevancia 0-1
  reason VARCHAR(100), -- "viewed_similar", "price_range", "category_match"
  is_clicked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_session ON user_recommendations(session_id);

-- Buscas por linguagem natural
CREATE TABLE IF NOT EXISTS natural_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  original_query TEXT NOT NULL,
  parsed_filters JSONB, -- filtros extraidos pela IA
  results_count INTEGER,
  clicked_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. JORNADA DE COMPRA ONLINE
-- Reservas de veiculos
CREATE TABLE IF NOT EXISTS vehicle_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'payment_received', 'completed', 'cancelled', 'expired')),
  reservation_amount DECIMAL(10,2) NOT NULL, -- valor do sinal
  payment_method VARCHAR(50), -- pix, credit_card
  payment_id VARCHAR(255), -- id do gateway de pagamento
  payment_status VARCHAR(30) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- reserva expira em 48h
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_vehicle ON vehicle_reservations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON vehicle_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON vehicle_reservations(status);

-- Simulacoes de financiamento salvas
CREATE TABLE IF NOT EXISTS financing_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_price DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) NOT NULL,
  financed_amount DECIMAL(12,2) NOT NULL,
  installments INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  bank_name VARCHAR(100),
  is_pre_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financing_user ON financing_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_financing_vehicle ON financing_simulations(vehicle_id);

-- Entregas de veiculos (delivery)
CREATE TABLE IF NOT EXISTS vehicle_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES vehicle_reservations(id) ON DELETE CASCADE,
  proposal_id UUID,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  delivery_type VARCHAR(30) NOT NULL CHECK (delivery_type IN ('pickup', 'delivery_local', 'delivery_state', 'delivery_national')),
  delivery_address TEXT,
  delivery_city VARCHAR(100),
  delivery_state VARCHAR(2),
  delivery_cep VARCHAR(10),
  delivery_date DATE,
  delivery_time_slot VARCHAR(50), -- "manha", "tarde", "noite"
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  distance_km INTEGER,
  status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'cancelled')),
  driver_name VARCHAR(255),
  driver_phone VARCHAR(20),
  tracking_code VARCHAR(100),
  delivered_at TIMESTAMP WITH TIME ZONE,
  signature_url TEXT, -- assinatura digital de recebimento
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_user ON vehicle_deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON vehicle_deliveries(status);

-- 4. CONFIANCA E TRANSPARENCIA
-- Historico veicular
CREATE TABLE IF NOT EXISTS vehicle_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  check_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50), -- "denatran", "sng", "manual"
  plate VARCHAR(10),
  renavam VARCHAR(20),
  chassis VARCHAR(30),
  has_fines BOOLEAN DEFAULT false,
  fines_count INTEGER DEFAULT 0,
  fines_total DECIMAL(10,2) DEFAULT 0,
  has_restrictions BOOLEAN DEFAULT false,
  restrictions_details TEXT,
  has_recalls BOOLEAN DEFAULT false,
  recalls_details TEXT,
  has_accidents BOOLEAN DEFAULT false,
  accidents_count INTEGER DEFAULT 0,
  owner_count INTEGER DEFAULT 1,
  is_financed BOOLEAN DEFAULT false,
  financing_bank VARCHAR(100),
  ipva_status VARCHAR(30), -- "paid", "pending", "exempt"
  licensing_status VARCHAR(30),
  report_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_history_vehicle ON vehicle_history(vehicle_id);

-- Laudos de vistoria
CREATE TABLE IF NOT EXISTS vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  inspector_name VARCHAR(255) NOT NULL,
  inspection_date DATE NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  -- Categorias de vistoria (0-10 cada)
  exterior_score INTEGER CHECK (exterior_score >= 0 AND exterior_score <= 10),
  interior_score INTEGER CHECK (interior_score >= 0 AND interior_score <= 10),
  engine_score INTEGER CHECK (engine_score >= 0 AND engine_score <= 10),
  transmission_score INTEGER CHECK (transmission_score >= 0 AND transmission_score <= 10),
  suspension_score INTEGER CHECK (suspension_score >= 0 AND suspension_score <= 10),
  brakes_score INTEGER CHECK (brakes_score >= 0 AND brakes_score <= 10),
  electrical_score INTEGER CHECK (electrical_score >= 0 AND electrical_score <= 10),
  tires_score INTEGER CHECK (tires_score >= 0 AND tires_score <= 10),
  -- Detalhes
  checklist_items JSONB DEFAULT '[]', -- array de {item, status, notes}
  issues_found JSONB DEFAULT '[]', -- problemas encontrados
  recommendations TEXT,
  photos JSONB DEFAULT '[]', -- fotos da vistoria
  report_pdf_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  warranty_months INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_vehicle ON vehicle_inspections(vehicle_id);

-- Reviews/Avaliacoes verificadas
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL, -- veiculo comprado
  proposal_id UUID,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Avaliacoes (1-5)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  vehicle_rating INTEGER CHECK (vehicle_rating >= 1 AND vehicle_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  -- Conteudo
  title VARCHAR(255),
  review_text TEXT NOT NULL,
  pros TEXT, -- pontos positivos
  cons TEXT, -- pontos negativos
  photos JSONB DEFAULT '[]',
  -- Verificacao
  is_verified_purchase BOOLEAN DEFAULT false,
  purchase_date DATE,
  verification_method VARCHAR(50), -- "nf", "contract", "manual"
  -- Moderacao
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  -- Resposta da loja
  response_text TEXT,
  response_date TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Meta
  helpful_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON customer_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle ON customer_reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON customer_reviews(overall_rating);

-- 5. MARKETING E CONVERSAO
-- Notificacoes push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  device_type VARCHAR(30), -- "mobile", "desktop", "tablet"
  browser VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- "price_drop", "new_vehicle", "promo", "reminder"
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  icon_url TEXT,
  action_url TEXT,
  data JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'clicked', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_notifications_user ON push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON push_notifications(status);

-- Sistema de cupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'gift')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_value DECIMAL(12,2),
  max_discount_value DECIMAL(10,2),
  applicable_to VARCHAR(30) DEFAULT 'all' CHECK (applicable_to IN ('all', 'category', 'brand', 'vehicle')),
  applicable_ids UUID[], -- ids das categorias/marcas/veiculos
  usage_limit INTEGER, -- limite total de usos
  usage_per_user INTEGER DEFAULT 1, -- limite por usuario
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, valid_until);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id UUID,
  discount_applied DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);

-- Programa de indicacao
CREATE TABLE IF NOT EXISTS referral_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL UNIQUE,
  reward_type VARCHAR(20) DEFAULT 'fixed' CHECK (reward_type IN ('percentage', 'fixed')),
  reward_value DECIMAL(10,2) NOT NULL DEFAULT 500,
  total_referrals INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES referral_program(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_email VARCHAR(255),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'converted', 'paid', 'cancelled')),
  proposal_id UUID,
  reward_amount DECIMAL(10,2),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);

-- Remarketing / Carrinhos abandonados
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  step_reached VARCHAR(50), -- "viewing", "proposal_started", "financing", "reservation"
  form_data JSONB, -- dados preenchidos ate o momento
  -- Remarketing
  reminder_sent_count INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMP WITH TIME ZONE,
  is_recovered BOOLEAN DEFAULT false,
  recovered_at TIMESTAMP WITH TIME ZONE,
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user ON abandoned_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_vehicle ON abandoned_carts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovered ON abandoned_carts(is_recovered);

-- 6. PWA E OFFLINE
-- Cache de dados para offline
CREATE TABLE IF NOT EXISTS user_offline_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL, -- "favorites", "searches", "viewed"
  data JSONB NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INTEGRACAO MARKETPLACES
-- Publicacoes em marketplaces externos
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  marketplace VARCHAR(50) NOT NULL, -- "olx", "webmotors", "mercadolivre", "icarros"
  external_id VARCHAR(255), -- id no marketplace
  external_url TEXT, -- link do anuncio
  status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'sold', 'expired', 'error')),
  sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'error')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_error TEXT,
  views_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0,
  extra_data JSONB, -- dados especificos do marketplace
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_vehicle ON marketplace_listings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);

-- Credenciais dos marketplaces
CREATE TABLE IF NOT EXISTS marketplace_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace VARCHAR(50) NOT NULL UNIQUE,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  extra_config JSONB,
  is_active BOOLEAN DEFAULT false,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON vehicles(status) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_vehicles_price_range ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);

-- =====================================================
-- FUNCOES AUXILIARES
-- =====================================================

-- Funcao para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
