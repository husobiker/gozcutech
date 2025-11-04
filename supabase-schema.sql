-- Gözcu Yazılım Supabase Veritabanı Şeması
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Blog Posts Tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category VARCHAR(100),
  tags TEXT[],
  author VARCHAR(100) NOT NULL,
  read_time INTEGER DEFAULT 5,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects Tablosu
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  logo VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  technologies TEXT[],
  duration VARCHAR(50),
  team_size VARCHAR(50),
  challenges TEXT[],
  results TEXT[],
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Settings Tablosu
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Plans Tablosu
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  features TEXT[] NOT NULL,
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('bulut', 'web', 'erp')),
  server_type VARCHAR(20) CHECK (server_type IN ('windows', 'linux')),
  cta_text VARCHAR(100) DEFAULT 'Teklif Al',
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contacts Tablosu
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  project_type VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Users Tablosu (Admin kullanıcıları)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  avatar VARCHAR(500),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_type ON plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_plans_sort_order ON plans(sort_order);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- RLS (Row Level Security) Politikaları
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Blog posts - Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Blog posts are insertable by admin" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Blog posts are updatable by admin" ON blog_posts
  FOR UPDATE USING (auth.role() = 'service_role');

-- Projects - Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Projects are insertable by admin" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Projects are updatable by admin" ON projects
  FOR UPDATE USING (auth.role() = 'service_role');

-- Settings - Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are insertable by admin" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Settings are updatable by admin" ON settings
  FOR UPDATE USING (auth.role() = 'service_role');

-- Plans - Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Plans are viewable by everyone" ON plans
  FOR SELECT USING (true);

CREATE POLICY "Plans are insertable by admin" ON plans
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Plans are updatable by admin" ON plans
  FOR UPDATE USING (auth.role() = 'service_role');

-- Contacts - Herkes ekleyebilir, sadece admin okuyabilir
CREATE POLICY "Contacts are insertable by everyone" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contacts are viewable by admin" ON contacts
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Contacts are updatable by admin" ON contacts
  FOR UPDATE USING (auth.role() = 'service_role');

-- Users - Sadece admin erişebilir
CREATE POLICY "Users are viewable by admin" ON users
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Users are insertable by admin" ON users
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users are updatable by admin" ON users
  FOR UPDATE USING (auth.role() = 'service_role');

-- Varsayılan veriler
INSERT INTO settings (key, value, description) VALUES 
('site_config', '{
  "siteName": "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
  "siteDescription": "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri.",
  "logo": "/logo.png",
  "favicon": "/favicon.ico"
}', 'Site genel ayarları'),
('contact_info', '{
  "email": "info@gozcu.tech",
  "phone": "+90 555 111 22 33",
  "address": "İstanbul, Türkiye",
  "workingHours": "Pazartesi - Cuma: 09:00 - 18:00"
}', 'İletişim bilgileri'),
('social_links', '{
  "github": "https://github.com/gozcu",
  "linkedin": "https://linkedin.com/company/gozcu",
  "twitter": "",
  "instagram": ""
}', 'Sosyal medya linkleri'),
('stats', '{
  "totalProjects": 50,
  "totalBlogs": 8,
  "totalVisitors": 1247,
  "totalRevenue": 45600,
  "yearsExperience": 5
}', 'Site istatistikleri')
ON CONFLICT (key) DO NOTHING;

-- Örnek blog yazıları
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, status, featured) VALUES 
('React ile Modern Web Geliştirme', 'react-modern-web-development', 'React kullanarak modern web uygulamaları nasıl geliştirilir?', 'React, Facebook tarafından geliştirilen popüler bir JavaScript kütüphanesidir...', 'Web Geliştirme', 'Gözcu Yazılım', 'published', true),
('Supabase ile Backend Geliştirme', 'supabase-backend-development', 'Supabase kullanarak hızlı ve güvenli backend çözümleri', 'Supabase, Firebase alternatifi olarak geliştirilen açık kaynaklı bir platformdur...', 'Backend', 'Gözcu Yazılım', 'published', true),
('Dark Mode Tasarım Rehberi', 'dark-mode-design-guide', 'Modern web sitelerinde dark mode nasıl uygulanır?', 'Dark mode, kullanıcı deneyimini artıran önemli bir tasarım trendidir...', 'UI/UX', 'Gözcu Yazılım', 'published', false)
ON CONFLICT (slug) DO NOTHING;

-- Örnek projeler
INSERT INTO projects (company, project_name, description, category, year, technologies, duration, team_size, challenges, results, featured) VALUES 
('TechCorp İnnovasyon', 'Kurumsal ERP Sistemi', 'Tam entegre ERP çözümü ile iş süreçlerini optimize ettik.', 'ERP', 2023, ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker'], '6 ay', '5 kişi', ARRAY['Karmaşık iş süreçlerinin dijitalleştirilmesi', 'Mevcut sistemlerle entegrasyon', 'Kullanıcı eğitimi ve adaptasyon'], ARRAY['İş süreçleri %40 hızlandı', 'Hata oranı %60 azaldı', 'Müşteri memnuniyeti %95''e çıktı'], true),
('E-Ticaret Plus', 'Online Mağaza Platformu', 'Modern e-ticaret sitesi ile satışları %300 artırdık.', 'E-Ticaret', 2023, ARRAY['Next.js', 'Stripe', 'MongoDB', 'AWS'], '4 ay', '4 kişi', ARRAY['Yüksek trafik yönetimi', 'Güvenli ödeme sistemi', 'Mobil optimizasyon'], ARRAY['Satışlar %300 arttı', 'Sayfa yükleme hızı 2 saniyeye düştü', 'Mobil dönüşüm %25 arttı'], true),
('StartupHub', 'Mobil Uygulama', 'iOS ve Android uygulaması ile kullanıcı deneyimini geliştirdik.', 'Mobil', 2024, ARRAY['React Native', 'Firebase', 'Redux', 'Expo'], '3 ay', '3 kişi', ARRAY['Cross-platform uyumluluk', 'Gerçek zamanlı veri senkronizasyonu', 'Offline çalışma özelliği'], ARRAY['App Store''da 4.8 puan', 'Günlük aktif kullanıcı %200 arttı', 'Kullanıcı memnuniyeti %90'], true)
ON CONFLICT DO NOTHING;

-- Örnek planlar
INSERT INTO plans (name, price, tagline, features, plan_type, server_type, featured, sort_order) VALUES 
('Linux Basic', '₺299/ay', 'Giriş seviyesi Linux', ARRAY['2 vCPU / 4 GB RAM', '40 GB NVMe SSD', 'Ubuntu 22.04', 'Anlık snapshot'], 'bulut', 'linux', true, 1),
('Linux Pro', '₺599/ay', 'Yoğun Linux iş yükü', ARRAY['4 vCPU / 8 GB RAM', '80 GB NVMe SSD', 'Ubuntu 24.04', 'Günlük yedekleme'], 'bulut', 'linux', true, 2),
('Windows Basic', '₺349/ay', 'Giriş seviyesi Windows', ARRAY['2 vCPU / 4 GB RAM', '60 GB NVMe SSD', 'Windows Server 2022', 'Anlık snapshot'], 'bulut', 'windows', true, 3),
('Kurumsal Web Sitesi', '₺2.500', 'Profesyonel kurumsal kimlik', ARRAY['Responsive tasarım', 'SEO optimizasyonu', 'İçerik yönetim sistemi', 'SSL sertifikası', '1 yıl hosting'], 'web', null, true, 4),
('E-Ticaret Sitesi', '₺5.000', 'Online satış platformu', ARRAY['Ürün kataloğu', 'Sepet sistemi', 'Ödeme entegrasyonu', 'Stok yönetimi', 'Sipariş takibi'], 'web', null, true, 5),
('Temel ERP', 'Teklif Alınız', 'Küçük işletmeler', ARRAY['Stok yönetimi', 'Fatura sistemi', 'Müşteri takibi', 'Temel raporlar'], 'erp', null, true, 6)
ON CONFLICT DO NOTHING;
