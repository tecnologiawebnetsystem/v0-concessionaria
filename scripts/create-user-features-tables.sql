-- Test Drives table
CREATE TABLE IF NOT EXISTS test_drives (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(10) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Evaluations table (Avalie seu Carro)
CREATE TABLE IF NOT EXISTS vehicle_evaluations (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  version VARCHAR(100),
  mileage INTEGER NOT NULL,
  color VARCHAR(50),
  fuel_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  city VARCHAR(100),
  message TEXT,
  estimated_value DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Alerts (Alerta de Novos Veículos)
CREATE TABLE IF NOT EXISTS vehicle_alerts (
  id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  brand VARCHAR(100),
  model VARCHAR(100),
  category VARCHAR(100),
  min_year INTEGER,
  max_year INTEGER,
  min_price DECIMAL(12, 2),
  max_price DECIMAL(12, 2),
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_test_drives_status ON test_drives(status);
CREATE INDEX IF NOT EXISTS idx_test_drives_date ON test_drives(preferred_date);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON vehicle_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_alerts_email ON vehicle_alerts(customer_email);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON vehicle_alerts(is_active);
