#!/bin/bash

# Nginx Config Dosyası Oluşturma Scripti
# Sunucuda çalıştır

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}⚙️  Nginx Config Dosyası Oluşturuluyor...${NC}"
echo ""

# Nginx config içeriği
NGINX_CONFIG='# HTTP - Ana domain (İlk test için)
server {
    listen 80;
    listen [::]:80;
    server_name gozcu.tech www.gozcu.tech 46.101.111.170;

    # SSL için Let'\''s Encrypt (certbot için gerekli)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Root Directory
    root /var/www/gozcutech/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json application/xml image/svg+xml;
    gzip_disable "msie6";

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static Files Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        add_header Access-Control-Allow-Origin "*" always;
    }

    # HTML Caching
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # SPA Routing Support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:3012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection '\''upgrade'\'';
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

    # Favicon ve Logo
    location ~* ^/(favicon\.ico|logo\.png)$ {
        root /var/www/gozcutech/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Manifest.json
    location = /manifest.json {
        root /var/www/gozcutech/public;
        access_log off;
    }

    # Service Worker
    location = /service-worker.js {
        root /var/www/gozcutech/public;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/gozcu.tech.access.log;
    error_log /var/log/nginx/gozcu.tech.error.log;
}'

# Config dosyasını oluştur
echo -e "${YELLOW}[1/5] Nginx config dosyası oluşturuluyor...${NC}"
echo "$NGINX_CONFIG" | sudo tee /etc/nginx/sites-available/gozcu.tech > /dev/null
echo -e "${GREEN}✅ Config dosyası oluşturuldu${NC}"

# Symlink oluştur
echo -e "${YELLOW}[2/5] Symlink oluşturuluyor...${NC}"
sudo ln -sf /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/
echo -e "${GREEN}✅ Symlink oluşturuldu${NC}"

# Default config'i kaldır (varsa)
if [ -L /etc/nginx/sites-enabled/default ]; then
    echo -e "${YELLOW}[3/5] Default config kaldırılıyor...${NC}"
    sudo rm /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✅ Default config kaldırıldı${NC}"
else
    echo -e "${YELLOW}[3/5] Default config zaten yok${NC}"
fi

# Syntax kontrolü
echo -e "${YELLOW}[4/5] Nginx syntax kontrol ediliyor...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx syntax geçerli${NC}"
else
    echo -e "${RED}❌ Nginx syntax hatası!${NC}"
    exit 1
fi

# Nginx restart
echo -e "${YELLOW}[5/5] Nginx yeniden başlatılıyor...${NC}"
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx yeniden başlatıldı${NC}"

# Test
echo ""
echo -e "${GREEN}✅ Nginx konfigürasyonu tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 Test:${NC}"
echo -e "curl -I http://46.101.111.170"
echo ""
echo -e "${YELLOW}📝 Sonraki Adım:${NC}"
echo -e "SSL sertifikası almak için: ${BLUE}sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech${NC}"
echo ""


