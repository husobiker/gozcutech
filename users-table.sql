-- Users tablosunu yeniden oluştur
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Editor',
  status VARCHAR(20) DEFAULT 'active',
  permissions JSONB DEFAULT '[]'::jsonb,
  avatar TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) aktif et
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Herkesin okuyabileceği policy (admin panel için)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Sadece admin'lerin ekleyebileceği policy
CREATE POLICY "Users are insertable by admin" ON users
  FOR INSERT WITH CHECK (true);

-- Sadece admin'lerin güncelleyebileceği policy  
CREATE POLICY "Users are updatable by admin" ON users
  FOR UPDATE USING (true);

-- Sadece admin'lerin silebileceği policy
CREATE POLICY "Users are deletable by admin" ON users
  FOR DELETE USING (true);

-- Varsayılan admin kullanıcısını ekle
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
) VALUES (
  'admin@gozcu.com.tr',
  'Hüseyin',
  'Çetinkoz',
  'gozcu2024',
  'Super Admin',
  'active',
  '["all"]'::jsonb,
  NOW(),
  NOW()
);

-- İkinci admin kullanıcısını ekle
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
) VALUES (
  'editor@gozcu.com.tr',
  'Ahmet',
  'Yılmaz',
  'gozcu2024',
  'Editor',
  'active',
  '["blog", "projects"]'::jsonb,
  NOW(),
  NOW()
);

-- Kontrol et
SELECT id, email, name, surname, role, status, permissions, created_at 
FROM users 
ORDER BY created_at DESC;






