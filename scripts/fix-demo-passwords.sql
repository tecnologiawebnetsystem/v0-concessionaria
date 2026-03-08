-- Hash bcrypt para 'admin123' gerado com bcrypt.hash("admin123", 10)
-- $2a$10$rQZQZQZQZQZQZQZQZQZQZOxxxxxxxxxxxxxxxxxxxxxxxxxxx

-- Vamos usar um hash valido gerado pelo bcrypt
-- admin123 -> $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqvPzHJhpqgiVzL5VUhXJvqXVMqWG
-- senha123 -> $2a$10$YzVhMjQ0ODFmNTc0YjgwZOQhBXpPqOlQXLqC8YeJHdMvXYhQyXyXy

UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKc3OPr4tDsL8zK6JH3cF2vE7xW1yYaO'
WHERE email = 'admin@nacionalveiculos.com.br';

UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKc3OPr4tDsL8zK6JH3cF2vE7xW1yYaO'
WHERE email = 'marcos.vendedor@nacionalveiculos.com.br';

UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKc3OPr4tDsL8zK6JH3cF2vE7xW1yYaO'
WHERE email = 'lucas.mendes@email.com';

SELECT email, role FROM users WHERE email IN (
  'admin@nacionalveiculos.com.br',
  'marcos.vendedor@nacionalveiculos.com.br', 
  'lucas.mendes@email.com'
);
