-- Users tablosu zaten mevcut, sadece verileri kontrol et ve güncelle

-- Önce mevcut kullanıcıları kontrol et
SELECT id, email, name, surname, role, status, permissions, created_at 
FROM users 
ORDER BY created_at DESC;

-- Eğer admin@gozcu.com.tr yoksa ekle
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
  'Super Admin',
  'active',
  '["all"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@gozcu.com.tr'
);

-- Eğer editor@gozcu.com.tr yoksa ekle
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
  'Editor',
  'active',
  '["blog", "projects"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'editor@gozcu.com.tr'
);

-- Mevcut admin kullanıcısını güncelle (şifre ve diğer bilgiler)
UPDATE users 
SET 
  password = 'gozcu2024',
  surname = 'Çetinkoz',
  role = 'Super Admin',
  status = 'active',
  permissions = '["all"]'::jsonb,
  updated_at = NOW()
WHERE email = 'admin@gozcu.com.tr';

-- Son kontrol
SELECT id, email, name, surname, role, status, permissions, created_at 
FROM users 
ORDER BY created_at DESC;






