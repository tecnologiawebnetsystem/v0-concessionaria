-- Resetar senhas dos usuarios demo
-- Senha: admin123 -> hash bcrypt
UPDATE users SET password_hash = '$2a$10$rQEY9jHJl9l7wVbJLHDJFOdMPJYBLQ3Xf7E1Qj8wWzKvYQXHJKnHa'
WHERE email = 'admin@nacionalveiculos.com.br';

-- Senha: senha123 -> hash bcrypt
UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqLVIZ/C6E4K6Xl5fIZ4YHHsZFmPe'
WHERE email IN ('marcos.vendedor@nacionalveiculos.com.br', 'lucas.mendes@email.com');

SELECT email, 'senha resetada' as status FROM users 
WHERE email IN (
  'admin@nacionalveiculos.com.br',
  'marcos.vendedor@nacionalveiculos.com.br', 
  'lucas.mendes@email.com'
);
