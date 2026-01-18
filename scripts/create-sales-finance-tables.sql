-- Adicionar role 'seller' na tabela users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'super_admin', 'seller'));

-- Tabela de vendedores (informações extras do vendedor)
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  cpf VARCHAR(14),
  rg VARCHAR(20),
  birth_date DATE,
  hire_date DATE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  bank_name VARCHAR(100),
  bank_agency VARCHAR(20),
  bank_account VARCHAR(30),
  pix_key VARCHAR(255),
  commission_rate DECIMAL(5,2) DEFAULT 2.5, -- % de comissão padrão
  base_salary DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_cpf VARCHAR(14),
  
  -- Valores da venda
  sale_price DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) DEFAULT 0,
  final_price DECIMAL(12,2) NOT NULL,
  
  -- Forma de pagamento
  payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'financing', 'consortium', 'credit_card', 'trade_in', 'mixed')),
  down_payment DECIMAL(12,2) DEFAULT 0,
  financing_value DECIMAL(12,2) DEFAULT 0,
  installments INTEGER DEFAULT 1,
  financing_bank VARCHAR(100),
  financing_rate DECIMAL(5,2),
  
  -- Veículo de troca (se houver)
  has_trade_in BOOLEAN DEFAULT false,
  trade_in_vehicle VARCHAR(255),
  trade_in_year INTEGER,
  trade_in_mileage INTEGER,
  trade_in_value DECIMAL(12,2) DEFAULT 0,
  
  -- Comissão
  commission_rate DECIMAL(5,2),
  commission_value DECIMAL(12,2),
  commission_paid BOOLEAN DEFAULT false,
  commission_paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  notes TEXT,
  
  -- Datas
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas de vendas
CREATE TABLE IF NOT EXISTS sales_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  goal_quantity INTEGER DEFAULT 0, -- meta em quantidade de carros
  goal_value DECIMAL(12,2) DEFAULT 0, -- meta em valor
  achieved_quantity INTEGER DEFAULT 0,
  achieved_value DECIMAL(12,2) DEFAULT 0,
  bonus_percentage DECIMAL(5,2) DEFAULT 0, -- bônus se atingir meta
  bonus_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(seller_id, month, year)
);

-- Tabela de fluxo de caixa
CREATE TABLE IF NOT EXISTS cash_flow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50),
  reference_type VARCHAR(50), -- 'sale', 'commission', 'expense', 'other'
  reference_id UUID, -- ID da venda ou outro
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categorias de despesas
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documentos dos vendedores
CREATE TABLE IF NOT EXISTS seller_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- 'rg', 'cpf', 'cnh', 'comprovante_residencia', 'contrato', 'outro'
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_seller ON sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_sales_vehicle ON sales(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_cash_flow_date ON cash_flow(date);
CREATE INDEX IF NOT EXISTS idx_cash_flow_type ON cash_flow(type);
CREATE INDEX IF NOT EXISTS idx_sellers_user ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_goals_seller ON sales_goals(seller_id);

-- Inserir categorias de despesas padrão
INSERT INTO expense_categories (name, type) VALUES
('Venda de Veículo', 'income'),
('Financiamento', 'income'),
('Consórcio', 'income'),
('Serviços', 'income'),
('Comissão Vendedor', 'expense'),
('Salários', 'expense'),
('Aluguel', 'expense'),
('Energia Elétrica', 'expense'),
('Água', 'expense'),
('Internet/Telefone', 'expense'),
('Marketing', 'expense'),
('Manutenção', 'expense'),
('Impostos', 'expense'),
('Seguros', 'expense'),
('Despesas Bancárias', 'expense'),
('Material de Escritório', 'expense'),
('Limpeza', 'expense'),
('Outros', 'expense')
ON CONFLICT DO NOTHING;
