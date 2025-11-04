# Gozcu.tech Production Deployment Rehberi 🚀

## Sunucu Durumu
- **Sunucu Path:** `/var/www/gozcutech`
- **Domain:** `gozcu.tech`
- **Web Server:** Nginx (muhtemelen)

## 📋 Deployment Adımları

### 1. Repository'yi Güncelle
```bash
cd /var/www/gozcutech
git pull origin main
```

### 2. Dependencies Yükle
```bash
npm install
# veya
npm ci  # Clean install için
```

### 3. Production Build Oluştur
```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşacak.

### 4. Nginx Konfigürasyonu

Nginx config dosyası oluştur:

```bash
sudo nano /etc/nginx/sites-available/gozcu.tech
```

Aşağıdaki konfigürasyonu ekle:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name gozcu.tech www.gozcu.tech;

    # SSL için Let's Encrypt redirect
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # HTTP'den HTTPS'e yönlendir
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gozcu.tech www.gozcu.tech;

    # SSL Sertifikaları
    ssl_certificate /etc/letsencrypt/live/gozcu.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gozcu.tech/privkey.pem;
    
    # SSL Optimizasyonları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Root Directory
    root /var/www/gozcutech/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static Files Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA Routing Support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (eğer backend varsa)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Robots.txt ve Sitemap
    location = /robots.txt {
        root /var/www/gozcutech/public;
        access_log off;
        log_not_found off;
    }

    location = /sitemap.xml {
        root /var/www/gozcutech/public;
        access_log off;
    }

    # Favicon
    location = /favicon.ico {
        root /var/www/gozcutech/public;
        access_log off;
        log_not_found off;
    }

    # Logs
    access_log /var/log/nginx/gozcu.tech.access.log;
    error_log /var/log/nginx/gozcu.tech.error.log;
}
```

### 5. Nginx Konfigürasyonunu Aktif Et

```bash
# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/

# Nginx syntax kontrolü
sudo nginx -t

# Nginx'i restart et
sudo systemctl restart nginx
```

### 6. SSL Sertifikası (Let's Encrypt)

Eğer SSL yoksa:

```bash
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

### 7. Dosya İzinleri

```bash
# Ownership ayarla
sudo chown -R www-data:www-data /var/www/gozcutech

# İzinler
sudo chmod -R 755 /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech/dist
```

### 8. PM2 ile Backend (Opsiyonel)

Eğer backend çalıştırıyorsan:

```bash
cd /var/www/gozcutech/backend
npm install
pm2 start server.js --name gozcutech-backend
pm2 save
pm2 startup
```

## 🔄 Otomatik Deployment Script

`deploy.sh` dosyası oluştur:

```bash
#!/bin/bash
cd /var/www/gozcutech
git pull origin main
npm install
npm run build
sudo systemctl restart nginx
echo "Deployment completed!"
```

İzin ver:
```bash
chmod +x deploy.sh
```

## ✅ Test

1. **HTTP Test:**
   ```bash
   curl -I http://gozcu.tech
   ```

2. **HTTPS Test:**
   ```bash
   curl -I https://gozcu.tech
   ```

3. **Browser'da Test:**
   - https://gozcu.tech
   - https://www.gozcu.tech

## 🔍 Troubleshooting

### Nginx Hataları
```bash
# Nginx status
sudo systemctl status nginx

# Nginx logs
sudo tail -f /var/log/nginx/gozcu.tech.error.log
```

### Build Hataları
```bash
# Node version kontrol
node -v
npm -v

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### İzin Hataları
```bash
sudo chown -R www-data:www-data /var/www/gozcutech
sudo chmod -R 755 /var/www/gozcutech
```

## 📊 Monitoring

- **Nginx Status:** `sudo systemctl status nginx`
- **SSL Expiry:** `sudo certbot certificates`
- **Disk Space:** `df -h`
- **Memory:** `free -h`

