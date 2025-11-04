#!/bin/bash

# Gözcu Yazılım Deployment Script
# Kullanım: ./deploy.sh

set -e  # Hata durumunda durdur

echo "🚀 Gözcu Yazılım Deployment Başlıyor..."

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Proje dizinine git
cd /var/www/gozcutech

echo -e "${YELLOW}📥 Git pull yapılıyor...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Dependencies yükleniyor...${NC}"
npm install

echo -e "${YELLOW}🏗️  Production build oluşturuluyor...${NC}"
npm run build

echo -e "${YELLOW}📁 Dosya izinleri ayarlanıyor...${NC}"
sudo chown -R www-data:www-data /var/www/gozcutech/dist
sudo chmod -R 755 /var/www/gozcutech/dist

echo -e "${YELLOW}🔄 Nginx yeniden başlatılıyor...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo -e "${GREEN}🌐 Site: https://gozcu.tech${NC}"

