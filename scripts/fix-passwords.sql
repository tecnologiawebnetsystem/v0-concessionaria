-- Este script será executado via API para gerar hashes válidos
-- As senhas serão: admin123 para admins e cliente123 para usuários

-- Verificar usuários atuais
SELECT id, email, role, LEFT(password_hash, 20) as hash_preview FROM users ORDER BY role, email;
