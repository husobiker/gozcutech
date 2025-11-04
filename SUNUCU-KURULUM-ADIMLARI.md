# 🚀 Sunucuda Yapılacak Komutlar (Kopyala-Yapıştır)

## ✅ Build Başarılı! Şimdi Nginx Kurulumu

### 1. Nginx Config Dosyasını Kopyala
```bash
sudo cp /var/www/gozcutech/nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech
```

### 2. Symlink Oluştur
```bash
sudo ln -sf /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/
```

### 3. Nginx Syntax Kontrolü
```bash
sudo nginx -t
```

Eğer "syntax is ok" yazıyorsa devam et.

### 4. Nginx Restart
```bash
sudo systemctl restart nginx
```

### 5. Nginx Status Kontrolü
```bash
sudo systemctl status nginx
```

### 6. Dosya İzinleri
```bash
sudo chown -R www-data:www-data /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech/dist
```

### 7. SSL Sertifikası Kontrolü
```bash
sudo certbot certificates
```

Eğer SSL yoksa:
```bash
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

### 8. Test
```bash
curl -I https://gozcu.tech
```

## ⚠️ Önemli Notlar

1. **SSL Path:** Eğer SSL sertifika path'i farklıysa, nginx config'de düzelt:
   ```nginx
   ssl_certificate /etc/letsencrypt/live/gozcu.tech/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/gozcu.tech/privkey.pem;
   ```

2. **Eğer SSL yoksa:** Önce HTTP çalıştır, sonra SSL ekle:
   ```nginx
   # Geçici olarak SSL satırlarını yorumla
   # listen 443 ssl http2;
   listen 80;
   ```

3. **Log Kontrolü:**
   ```bash
   sudo tail -f /var/log/nginx/gozcu.tech.error.log
   ```

## 🔄 Güncelleme İşlemi (Her Seferinde)

```bash
cd /var/www/gozcutech
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

## ✅ Başarı Kontrolü

1. **Tarayıcıda:** https://gozcu.tech açılmalı
2. **Console:** Hata olmamalı
3. **SSL:** Yeşil kilit olmalı

