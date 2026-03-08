-- Verificar usuarios demo
SELECT email, name, role, is_active 
FROM users 
WHERE email IN (
  'admin@nacionalveiculos.com.br',
  'marcos.vendedor@nacionalveiculos.com.br', 
  'lucas.mendes@email.com'
);
