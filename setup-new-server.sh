#!/bin/bash

# Gözcu Yazılım - Yeni Sunucu Kurulum Scripti
# Kullanım: ./setup-new-server.sh

set -e  # Hata durumunda durdur

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Gözcu Yazılım - Yeni Sunucu Kurulum Başlıyor...${NC}"
echo ""

# 1. Sistem Güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Temel Paketler
echo -e "${YELLOW}📦 Temel paketler yükleniyor...${NC}"
sudo apt install -y curl wget git build-essential

# 3. Node.js Kontrolü ve Kurulumu
echo -e "${YELLOW}📦 Node.js kontrol ediliyor...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js bulunamadı, kuruluyor...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}✅ Node.js zaten kurulu: $(node -v)${NC}"
fi

# 4. Nginx Kontrolü ve Kurulumu
echo -e "${YELLOW}📦 Nginx kontrol ediliyor...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx bulunamadı, kuruluyor...${NC}"
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo -e "${GREEN}✅ Nginx zaten kurulu${NC}"
fi

# 5. PM2 Kontrolü ve Kurulumu
echo -e "${YELLOW}📦 PM2 kontrol ediliyor...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 bulunamadı, kuruluyor...${NC}"
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp /home/$USER
else
    echo -e "${GREEN}✅ PM2 zaten kurulu${NC}"
fi

# 6. Certbot (SSL için)
echo -e "${YELLOW}📦 Certbot kontrol ediliyor...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot bulunamadı, kuruluyor...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
else
    echo -e "${GREEN}✅ Certbot zaten kurulu${NC}"
fi

# 7. Proje Dizini Oluştur
echo -e "${YELLOW}📁 Proje dizini oluşturuluyor...${NC}"
sudo mkdir -p /var/www/gozcutech
sudo chown -R $USER:$USER /var/www/gozcutech

# 8. Log Dizini Oluştur
echo -e "${YELLOW}📁 Log dizini oluşturuluyor...${NC}"
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# 9. Versiyon Bilgileri
echo ""
echo -e "${GREEN}✅ Kurulum Tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 Versiyon Bilgileri:${NC}"
echo -e "Node.js: $(node -v)"
echo -e "NPM: $(npm -v)"
echo -e "Nginx: $(nginx -v 2>&1)"
echo -e "PM2: $(pm2 -v)"
echo ""
echo -e "${YELLOW}📝 Sonraki Adımlar:${NC}"
echo -e "1. Projeyi klonla: git clone <repo-url> /var/www/gozcutech"
echo -e "2. Environment variables ayarla (.env dosyası)"
echo -e "3. npm install && npm run build"
echo -e "4. Nginx konfigürasyonunu ayarla"
echo -e "5. SSL sertifikası al (certbot)"
echo -e "6. PM2 ile backend'i başlat"
echo ""


