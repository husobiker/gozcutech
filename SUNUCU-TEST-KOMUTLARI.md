# ✅ Sunucu Test ve Kontrol Komutları

## 🧪 Hemen Test Et

### 1. HTTP Test (HTTP'den HTTPS'e yönlendirme)
```bash
curl -I http://gozcu.tech
```
**Beklenen:** `301 Moved Permanently` ve `Location: https://gozcu.tech`

### 2. HTTPS Test
```bash
curl -I https://gozcu.tech
```
**Beklenen:** `200 OK` veya `301` (www yönlendirmesi)

### 3. Nginx Status
```bash
sudo systemctl status nginx
```
**Beklenen:** `active (running)`

### 4. Nginx Log Kontrolü
```bash
# Error log
sudo tail -20 /var/log/nginx/gozcu.tech.error.log

# Access log
sudo tail -20 /var/log/nginx/gozcu.tech.access.log
```

### 5. SSL Sertifikası Kontrolü
```bash
sudo certbot certificates
```

### 6. Tarayıcıda Test
- https://gozcu.tech
- https://www.gozcu.tech

## 🔍 Olası Sorunlar ve Çözümleri

### SSL Sertifikası Yoksa
```bash
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

### SSL Path Farklıysa
SSL sertifika path'ini kontrol et:
```bash
ls -la /etc/letsencrypt/live/
```

Eğer farklı bir path varsa, nginx config'de düzelt:
```bash
sudo nano /etc/nginx/sites-available/gozcu.tech
```

### 502 Bad Gateway Hatası
Backend çalışmıyor olabilir. API proxy'yi devre dışı bırak:
```nginx
# location /api { ... }  # Bu satırı yorumla
```

### 404 Not Found
- `dist/` klasörü var mı kontrol et: `ls -la /var/www/gozcutech/dist`
- Build yapılmış mı kontrol et: `ls -la /var/www/gozcutech/dist/index.html`

### İzin Hatası
```bash
sudo chown -R www-data:www-data /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech/dist
```

## ✅ Başarı Kontrol Listesi

- [ ] Nginx çalışıyor (`sudo systemctl status nginx`)
- [ ] HTTP → HTTPS yönlendirme çalışıyor
- [ ] HTTPS site açılıyor
- [ ] SSL sertifikası geçerli (yeşil kilit)
- [ ] Tüm sayfalar yükleniyor
- [ ] React Router çalışıyor (sayfa yenileme hatası yok)
- [ ] Static dosyalar yükleniyor (CSS, JS, images)

## 🎯 Sonraki Adımlar

1. ✅ Site test edildi
2. ✅ SSL sertifikası kontrol edildi
3. ✅ Google Search Console'a sitemap gönderildi
4. ✅ Monitoring kuruldu

