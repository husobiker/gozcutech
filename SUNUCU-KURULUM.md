# 🚀 Sunucu Kurulum Rehberi - gozcu.tech

## 📍 Mevcut Durum
- **Sunucu Path:** `/var/www/gozcutech`
- **Repository:** https://github.com/husobiker/gozcutech.git
- **Domain:** gozcu.tech

## ⚡ Hızlı Kurulum (Adım Adım)

### 1. Repository'yi Güncelle
```bash
cd /var/www/gozcutech
git pull origin main
```

### 2. Dependencies Yükle
```bash
npm install
```

### 3. Production Build
```bash
npm run build
```

Bu komut `dist/` klasörü oluşturacak.

### 4. Nginx Konfigürasyonu

Nginx config dosyasını kopyala:
```bash
sudo cp /var/www/gozcutech/nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech
```

Symlink oluştur:
```bash
sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/
```

Nginx syntax kontrolü:
```bash
sudo nginx -t
```

Nginx'i restart et:
```bash
sudo systemctl restart nginx
```

### 5. SSL Sertifikası (Eğer yoksa)

```bash
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

### 6. Dosya İzinleri

```bash
sudo chown -R www-data:www-data /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech/dist
```

### 7. Otomatik Deployment (Opsiyonel)

Deploy script'ini kullan:
```bash
cd /var/www/gozcutech
chmod +x deploy.sh
./deploy.sh
```

## 🔄 Güncelleme İşlemi

Her güncelleme için:
```bash
cd /var/www/gozcutech
./deploy.sh
```

Veya manuel:
```bash
cd /var/www/gozcutech
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

## ✅ Test

1. **Tarayıcıda:** https://gozcu.tech
2. **SSL Test:** https://www.ssllabs.com/ssltest/analyze.html?d=gozcu.tech
3. **Curl Test:**
   ```bash
   curl -I https://gozcu.tech
   ```

## 🔍 Troubleshooting

### Build Hatası
```bash
# Node version kontrol
node -v  # 18+ olmalı
npm -v

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Nginx Hatası
```bash
# Log kontrol
sudo tail -f /var/log/nginx/gozcu.tech.error.log

# Nginx status
sudo systemctl status nginx
```

### İzin Hatası
```bash
sudo chown -R www-data:www-data /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech/dist
```

## 📊 Monitoring

```bash
# Nginx status
sudo systemctl status nginx

# Disk kullanımı
df -h

# Memory
free -h

# SSL sertifika süresi
sudo certbot certificates
```

