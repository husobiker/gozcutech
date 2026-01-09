#!/bin/bash

# Backend Dependencies Kurulum Scripti
# PM2'yi durdur, dependencies kur, tekrar başlat

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📦 Backend Dependencies Kurulumu Başlıyor...${NC}"
echo ""

PROJECT_DIR="/var/www/gozcutech"
cd $PROJECT_DIR

# 1. PM2'yi durdur
echo -e "${YELLOW}[1/4] PM2 durduruluyor...${NC}"
pm2 stop gozcu-yazilim 2>/dev/null || pm2 delete gozcu-yazilim 2>/dev/null || true
echo -e "${GREEN}✅ PM2 durduruldu${NC}"

# 2. Backend dizinine git
echo -e "${YELLOW}[2/4] Backend dizinine geçiliyor...${NC}"
cd backend

# 3. Dependencies kur
echo -e "${YELLOW}[3/4] Backend dependencies yükleniyor...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies kuruldu${NC}"

# 4. PM2 ile tekrar başlat
echo -e "${YELLOW}[4/4] PM2 ile backend başlatılıyor...${NC}"
cd ..
pm2 start ecosystem.config.cjs
pm2 save
echo -e "${GREEN}✅ Backend başlatıldı${NC}"

# Özet
echo ""
echo -e "${GREEN}✅ Backend kurulumu tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 PM2 Durumu:${NC}"
pm2 list
echo ""
echo -e "${YELLOW}📝 Log kontrolü:${NC}"
echo -e "pm2 logs gozcu-yazilim"
echo ""


