-- Supabase Storage Bucket ve Politikaları Kurulumu
-- Bu dosyayı Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Storage bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Storage politikaları

-- Public read policy - Herkesin dosyaları görebilmesi için
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

-- Authenticated upload policy - Sadece giriş yapmış kullanıcılar yükleyebilir
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- Authenticated update policy - Sadece giriş yapmış kullanıcılar güncelleyebilir
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- Authenticated delete policy - Sadece giriş yapmış kullanıcılar silebilir
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE USING (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- 3. Storage bucket'ını aktif et
UPDATE storage.buckets 
SET public = true 
WHERE id = 'uploads';

-- 4. Test için bucket bilgilerini kontrol et
SELECT * FROM storage.buckets WHERE id = 'uploads';



