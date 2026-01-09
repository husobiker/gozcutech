#!/bin/bash

# Gözcu Yazılım - Yeni Sunucu Deployment Scripti
# Kullanım: ./deploy-new-server.sh

set -e  # Hata durumunda durdur

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Gözcu Yazılım - Yeni Sunucu Deployment Başlıyor...${NC}"
echo ""

# Proje dizinine git
PROJECT_DIR="/var/www/gozcutech"
cd $PROJECT_DIR

# 1. Git Pull
echo -e "${YELLOW}📥 Git pull yapılıyor...${NC}"
git pull origin main || echo -e "${RED}⚠️  Git pull başarısız (ilk kurulum olabilir)${NC}"

# 2. Dependencies
echo -e "${YELLOW}📦 Dependencies yükleniyor...${NC}"
npm install

# 3. Frontend Build
echo -e "${YELLOW}🏗️  Frontend build oluşturuluyor...${NC}"
npm run build

# 4. Backend Dependencies (eğer varsa)
if [ -d "backend" ]; then
    echo -e "${YELLOW}📦 Backend dependencies yükleniyor...${NC}"
    cd backend
    npm install
    cd ..
fi

# 5. Dosya İzinleri
echo -e "${YELLOW}📁 Dosya izinleri ayarlanıyor...${NC}"
sudo chown -R www-data:www-data $PROJECT_DIR/dist
sudo chmod -R 755 $PROJECT_DIR/dist
sudo chown -R $USER:$USER $PROJECT_DIR

# 6. Nginx Konfigürasyonu
echo -e "${YELLOW}⚙️  Nginx konfigürasyonu kontrol ediliyor...${NC}"
if [ -f "nginx-gozcu.tech.conf" ]; then
    echo -e "${YELLOW}Nginx config dosyası kopyalanıyor...${NC}"
    sudo cp nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech
    
    # Symlink oluştur (eğer yoksa)
    if [ ! -L /etc/nginx/sites-enabled/gozcu.tech ]; then
        sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/
    fi
    
    # Nginx syntax kontrolü
    if sudo nginx -t; then
        echo -e "${GREEN}✅ Nginx konfigürasyonu geçerli${NC}"
        sudo systemctl reload nginx
    else
        echo -e "${RED}❌ Nginx konfigürasyon hatası!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Nginx config dosyası bulunamadı${NC}"
fi

# 7. PM2 Backend (eğer varsa)
if [ -f "ecosystem.config.cjs" ]; then
    echo -e "${YELLOW}🔄 PM2 backend başlatılıyor...${NC}"
    pm2 delete gozcu-yazilim 2>/dev/null || true
    pm2 start ecosystem.config.cjs
    pm2 save
fi

echo ""
echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo -e "${GREEN}🌐 Site: https://gozcu.tech${NC}"
echo ""


