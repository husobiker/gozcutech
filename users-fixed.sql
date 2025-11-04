-- Önce mevcut constraint'leri kontrol et
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c';

-- Alternatif olarak, role alanının hangi değerleri kabul ettiğini kontrol et
SELECT DISTINCT role FROM users;

-- Eğer constraint varsa, önce onu kaldır
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Şimdi kullanıcıları ekle/güncelle
INSERT INTO users (
  email,
  name,
  surname,
  password,
  role,
  status,
  permissions,
  created_at,
  updated_at
) 
SELECT 
  'admin@gozcu.com.tr',
  'Hüseyin',
  'Çetinkoz',
  'gozcu2024',
  'admin',  -- 'Super Admin' yerine 'admin' kullan
  'active',
  '["all"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@gozcu.com.tr'
);

-- Editor kullanıcısını ekle
INSERT INTO users (
  email,
  name,
  surname,
  password,
  role,
  status,
  permissions,
  created_at,
  updated_at
) 
SELECT 
  'editor@gozcu.com.tr',
  'Ahmet',
  'Yılmaz',
  'gozcu2024',
  'editor',  -- 'Editor' yerine 'editor' kullan
  'active',
  '["blog", "projects"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'editor@gozcu.com.tr'
);

-- Mevcut admin kullanıcısını güncelle
UPDATE users 
SET 
  password = 'gozcu2024',
  surname = 'Çetinkoz',
  role = 'admin',  -- 'Super Admin' yerine 'admin'
  status = 'active',
  permissions = '["all"]'::jsonb,
  updated_at = NOW()
WHERE email = 'admin@gozcu.com.tr';

-- Son kontrol
SELECT id, email, name, surname, role, status, permissions, created_at 
FROM users 
ORDER BY created_at DESC;






