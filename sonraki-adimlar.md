# 🚀 Build Başarılı - Sonraki Adımlar

Build tamamlandı! Şimdi Nginx konfigürasyonunu yapıp siteyi yayına alalım.

---

## 📋 ADIM 1: Dosya İzinlerini Ayarla

```bash
cd /var/www/gozcutech

# Ownership ayarla
sudo chown -R www-data:www-data dist
sudo chown -R $USER:$USER .

# İzinler
sudo chmod -R 755 dist
```

---

## 📋 ADIM 2: Nginx Konfigürasyonu

```bash
# İlk kurulum için SSL olmadan config kullan
sudo cp nginx-gozcu.tech-initial.conf /etc/nginx/sites-available/gozcu.tech

# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx syntax kontrolü
sudo nginx -t
```

Eğer syntax hatası yoksa:

```bash
# Nginx'i restart et
sudo systemctl restart nginx

# Nginx durumunu kontrol et
sudo systemctl status nginx
```

---

## 📋 ADIM 3: Test Et

```bash
# IP ile test
curl -I http://46.101.111.170

# Veya tarayıcıda aç
# http://46.101.111.170
```

Eğer 200 OK alıyorsan, site çalışıyor! 🎉

---

## 📋 ADIM 4: PM2 ile Backend Başlat (Opsiyonel)

Eğer backend kullanıyorsan:

```bash
cd /var/www/gozcutech

# Backend dependencies (eğer yapmadıysan)
cd backend
npm install
cd ..

# PM2 ile başlat
pm2 start ecosystem.config.cjs

# PM2'yi kaydet
pm2 save

# PM2 durumunu kontrol et
pm2 status
pm2 logs gozcu-yazilim
```

---

## 📋 ADIM 5: SSL Sertifikası (Domain Hazırsa)

**ÖNEMLİ:** Domain'in DNS'i IP adresine (46.101.111.170) yönlendirilmiş olmalı!

```bash
# SSL sertifikası al
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

SSL alındıktan sonra tam config'e geç:

```bash
# Tam SSL config'e geç
sudo cp nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech

# Syntax kontrolü
sudo nginx -t

# Nginx'i reload et
sudo systemctl reload nginx
```

---

## 📋 ADIM 6: Firewall Kontrolü

```bash
# Firewall durumu
sudo ufw status

# Gerekli portlar açık mı?
# 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

---

## ✅ Başarı Kontrolü

```bash
# Nginx durumu
sudo systemctl status nginx

# PM2 durumu (eğer backend varsa)
pm2 status

# Site testi
curl -I http://46.101.111.170
curl -I https://gozcu.tech  # SSL varsa
```

---

## 🔍 Sorun Giderme

### Nginx Hatası
```bash
# Log kontrol
sudo tail -f /var/log/nginx/gozcu.tech.error.log
sudo tail -f /var/log/nginx/error.log
```

### Dosya Bulunamadı
```bash
# dist klasörü var mı?
ls -la /var/www/gozcutech/dist

# index.html var mı?
ls -la /var/www/gozcutech/dist/index.html
```

### İzin Hatası
```bash
# Ownership düzelt
sudo chown -R www-data:www-data /var/www/gozcutech/dist
sudo chmod -R 755 /var/www/gozcutech/dist
```

---

## 🎉 Tamamlandı!

Site artık yayında! Tarayıcıda test et:
- http://46.101.111.170
- https://gozcu.tech (SSL varsa)


