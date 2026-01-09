#!/bin/bash

# Nginx Konfigürasyonu ve Kurulum Scripti
# Build tamamlandıktan sonra çalıştır

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⚙️  Nginx Konfigürasyonu Başlıyor...${NC}"
echo ""

PROJECT_DIR="/var/www/gozcutech"
cd $PROJECT_DIR

# 1. Dosya İzinleri
echo -e "${YELLOW}[1/5] Dosya izinleri ayarlanıyor...${NC}"
sudo chown -R www-data:www-data $PROJECT_DIR/dist
sudo chown -R $USER:$USER $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR/dist
echo -e "${GREEN}✅ İzinler ayarlandı${NC}"

# 2. Nginx Config Kopyala
echo -e "${YELLOW}[2/5] Nginx konfigürasyonu kopyalanıyor...${NC}"
if [ -f "nginx-gozcu.tech-initial.conf" ]; then
    sudo cp nginx-gozcu.tech-initial.conf /etc/nginx/sites-available/gozcu.tech
    echo -e "${GREEN}✅ Config kopyalandı${NC}"
else
    echo -e "${RED}❌ nginx-gozcu.tech-initial.conf bulunamadı!${NC}"
    exit 1
fi

# 3. Symlink Oluştur
echo -e "${YELLOW}[3/5] Nginx symlink oluşturuluyor...${NC}"
if [ ! -L /etc/nginx/sites-enabled/gozcu.tech ]; then
    sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/
    echo -e "${GREEN}✅ Symlink oluşturuldu${NC}"
else
    echo -e "${YELLOW}⚠️  Symlink zaten var${NC}"
fi

# Default config'i kaldır (opsiyonel)
if [ -L /etc/nginx/sites-enabled/default ]; then
    echo -e "${YELLOW}Default config kaldırılıyor...${NC}"
    sudo rm /etc/nginx/sites-enabled/default
fi

# 4. Nginx Syntax Kontrolü
echo -e "${YELLOW}[4/5] Nginx syntax kontrol ediliyor...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx syntax geçerli${NC}"
else
    echo -e "${RED}❌ Nginx syntax hatası!${NC}"
    exit 1
fi

# 5. Nginx Restart
echo -e "${YELLOW}[5/5] Nginx yeniden başlatılıyor...${NC}"
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx yeniden başlatıldı${NC}"

# Özet
echo ""
echo -e "${GREEN}✅ Nginx konfigürasyonu tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 Test:${NC}"
echo -e "curl -I http://46.101.111.170"
echo -e "curl -I http://gozcu.tech"
echo ""
echo -e "${YELLOW}📝 Sonraki Adım:${NC}"
echo -e "SSL sertifikası almak için: ${BLUE}sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech${NC}"
echo ""


