-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION)
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES
('admin@nacionalveiculos.com.br', '$2a$10$rXZLvKxJYfQmqYqZbKqxVeYxYxYxYxYxYxYxYxYxYxYxYxYxYxY', 'Administrador', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert vehicle categories
INSERT INTO vehicle_categories (name, slug, description, icon, display_order) VALUES
('SUV', 'suv', 'Veículos utilitários esportivos', 'truck', 1),
('Sedan', 'sedan', 'Carros sedan executivos e compactos', 'car', 2),
('Hatch', 'hatch', 'Carros compactos hatchback', 'car-front', 3),
('Pickup', 'pickup', 'Caminhonetes e pickups', 'truck-pickup', 4),
('Esportivo', 'esportivo', 'Carros esportivos e de performance', 'gauge', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert popular brands
INSERT INTO brands (name, slug, display_order) VALUES
('Toyota', 'toyota', 1),
('Honda', 'honda', 2),
('Volkswagen', 'volkswagen', 3),
('Ford', 'ford', 4),
('Chevrolet', 'chevrolet', 5),
('Hyundai', 'hyundai', 6),
('Nissan', 'nissan', 7),
('Fiat', 'fiat', 8),
('Jeep', 'jeep', 9),
('BMW', 'bmw', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
('Notícias', 'noticias', 'Últimas notícias sobre veículos', 1),
('Dicas', 'dicas', 'Dicas para compradores e proprietários', 2),
('Manutenção', 'manutencao', 'Guias de manutenção veicular', 3),
('Lançamentos', 'lancamentos', 'Novos modelos e lançamentos', 4),
('Comparativos', 'comparativos', 'Comparações entre modelos', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value, type, category) VALUES
('site_name', 'Nacional Veículos', 'text', 'general'),
('site_description', 'A melhor concessionária de veículos do Brasil', 'text', 'general'),
('site_email', 'contato@nacionalveiculos.com.br', 'text', 'contact'),
('site_phone', '(11) 1234-5678', 'text', 'contact'),
('site_whatsapp', '5511912345678', 'text', 'contact'),
('site_address', 'Av. Principal, 1000 - São Paulo, SP', 'text', 'contact'),
('facebook_url', '', 'text', 'social'),
('instagram_url', '', 'text', 'social'),
('youtube_url', '', 'text', 'social'),
('require_registration_for_photos', 'true', 'boolean', 'features')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
