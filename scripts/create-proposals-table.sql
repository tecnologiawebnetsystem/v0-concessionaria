-- Create proposals table for online vehicle purchase proposals
CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  cpf VARCHAR(20),
  proposed_price DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  has_trade_in BOOLEAN DEFAULT FALSE,
  trade_in_brand VARCHAR(100),
  trade_in_model VARCHAR(100),
  trade_in_year VARCHAR(10),
  trade_in_mileage VARCHAR(50),
  message TEXT,
  vehicle_name VARCHAR(255) NOT NULL,
  vehicle_price DECIMAL(12, 2) NOT NULL,
  vehicle_slug VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);
CREATE INDEX IF NOT EXISTS idx_proposals_vehicle_slug ON proposals(vehicle_slug);
