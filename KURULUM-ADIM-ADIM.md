# 🚀 Gözcu Yazılım - Yeni Sunucu Kurulum Rehberi

**Sunucu IP:** 46.101.111.170  
**Domain:** gozcu.tech  
**Proje Dizini:** /var/www/gozcutech

---

## 📋 ADIM 1: Sunucuya Bağlan

```bash
ssh root@46.101.111.170
# veya kullanıcı adıyla
ssh kullanici@46.101.111.170
```

---

## 📋 ADIM 2: Sistem Güncellemesi

```bash
# Sistem güncellemesi
apt update && apt upgrade -y

# Temel paketler
apt install -y curl wget git build-essential
```

---

## 📋 ADIM 3: Node.js Kurulumu

```bash
# Node.js 20.x kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Kontrol
node -v  # v20.x.x olmalı
npm -v
```

---

## 📋 ADIM 4: Nginx Kurulumu

```bash
# Nginx kurulumu
apt install -y nginx

# Nginx'i başlat ve otomatik başlatmayı etkinleştir
systemctl start nginx
systemctl enable nginx

# Kontrol
systemctl status nginx
nginx -v
```

---

## 📋 ADIM 5: PM2 Kurulumu

```bash
# PM2 global kurulumu
npm install -g pm2

# PM2 startup script (sunucu yeniden başladığında otomatik başlat)
pm2 startup systemd -u $USER --hp /home/$USER
# Çıkan komutu çalıştır (sudo ile başlayan komut)
```

---

## 📋 ADIM 6: Certbot Kurulumu (SSL için)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx
```

---

## 📋 ADIM 7: Proje Dizini Oluştur

```bash
# Proje dizini oluştur
mkdir -p /var/www/gozcutech
chown -R $USER:$USER /var/www/gozcutech

# Log dizini
mkdir -p /var/log/pm2
chown -R $USER:$USER /var/log/pm2
```

---

## 📋 ADIM 8: Projeyi Klonla

```bash
cd /var/www/gozcutech

# Git repository'yi klonla (repo URL'ini güncelle)
git clone https://github.com/husobiker/gozcutech.git .

# Veya mevcut repo varsa
git pull origin main
```

**Not:** Eğer repo private ise SSH key eklemen gerekebilir.

---

## 📋 ADIM 9: Environment Variables Ayarla

```bash
cd /var/www/gozcutech

# .env dosyası oluştur
nano .env
```

Aşağıdaki içeriği ekle (Supabase bilgilerini güncelle):

```env
VITE_SUPABASE_URL=https://lvfvugeqesuaauxizsyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZnZ1Z2VxZXN1YWF1eGl6c3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjE1MzIsImV4cCI6MjA3NTM5NzUzMn0.g2VjTaGUv1Hn8jyn_tCGHGHxrfnEHzUKpQUMzOqlFpQ
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZnZ1Z2VxZXN1YWF1eGl6c3l6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgyMTUzMiwiZXhwIjoyMDc1Mzk3NTMyfQ.McsVcykgVEah-YSfRhzs9lXFLqZmaaJwmTGk4_D4H6M
NODE_ENV=production
PORT=3012
JWT_SECRET=gozcu-super-secure-secret-key-2024-change-in-production
```

---

## 📋 ADIM 10: Frontend Build

```bash
cd /var/www/gozcutech

# Dependencies yükle
npm install

# Production build
npm run build
```

Build başarılı olursa `dist/` klasörü oluşacak.

---

## 📋 ADIM 11: Backend Kurulumu (Opsiyonel)

```bash
cd /var/www/gozcutech/backend

# Backend dependencies
npm install
```

---

## 📋 ADIM 12: Nginx Konfigürasyonu

```bash
# Nginx config dosyasını kopyala
cp /var/www/gozcutech/nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech

# Symlink oluştur
ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
rm /etc/nginx/sites-enabled/default

# Nginx syntax kontrolü
nginx -t

# Nginx'i restart et
systemctl restart nginx
```

---

## 📋 ADIM 13: Firewall Ayarları

```bash
# UFW firewall kontrolü
ufw status

# Gerekli portları aç
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Firewall'u etkinleştir
ufw enable
```

---

## 📋 ADIM 14: SSL Sertifikası (Let's Encrypt)

**ÖNEMLİ:** Domain'in IP adresine yönlendirilmiş olması gerekir!

```bash
# SSL sertifikası al
certbot --nginx -d gozcu.tech -d www.gozcu.tech

# Otomatik yenileme testi
certbot renew --dry-run
```

---

## 📋 ADIM 15: Dosya İzinleri

```bash
# Ownership ayarla
chown -R www-data:www-data /var/www/gozcutech/dist
chown -R $USER:$USER /var/www/gozcutech

# İzinler
chmod -R 755 /var/www/gozcutech/dist
```

---

## 📋 ADIM 16: PM2 ile Backend Başlat

```bash
cd /var/www/gozcutech

# PM2 ile backend başlat
pm2 start ecosystem.config.cjs

# PM2'yi kaydet
pm2 save

# PM2 durumunu kontrol et
pm2 status
pm2 logs gozcu-yazilim
```

---

## 📋 ADIM 17: Test

```bash
# Nginx durumu
systemctl status nginx

# PM2 durumu
pm2 status

# Site testi (IP ile)
curl -I http://46.101.111.170

# Domain testi (eğer DNS ayarlıysa)
curl -I http://gozcu.tech
curl -I https://gozcu.tech
```

---

## ✅ Kurulum Tamamlandı!

Tarayıcıda test et:
- http://gozcu.tech (HTTP)
- https://gozcu.tech (HTTPS)

---

## 🔄 Güncelleme İşlemi

Gelecekte güncelleme için:

```bash
cd /var/www/gozcutech
./deploy-new-server.sh
```

Veya manuel:

```bash
cd /var/www/gozcutech
git pull origin main
npm install
npm run build
systemctl reload nginx
pm2 restart gozcu-yazilim
```

---

## 🔍 Troubleshooting

### Nginx Hatası
```bash
# Log kontrol
tail -f /var/log/nginx/gozcu.tech.error.log

# Nginx status
systemctl status nginx
```

### PM2 Hatası
```bash
# PM2 logs
pm2 logs gozcu-yazilim

# PM2 restart
pm2 restart gozcu-yazilim
```

### Build Hatası
```bash
# Node version kontrol
node -v  # 20.x olmalı

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Monitoring Komutları

```bash
# Disk kullanımı
df -h

# Memory
free -h

# PM2 monitoring
pm2 monit

# Nginx access logs
tail -f /var/log/nginx/gozcu.tech.access.log
```


