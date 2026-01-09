#!/bin/bash

# Gözcu Yazılım - Hızlı Kurulum Scripti
# Sunucu IP: 46.101.111.170
# Bu script sunucuda çalıştırılacak

set -e

# Renkli çıktı
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Gözcu Yazılım - Hızlı Kurulum Başlıyor...${NC}"
echo ""

# 1. Sistem Güncellemesi
echo -e "${YELLOW}[1/10] Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y

# 2. Git Kurulumu
echo -e "${YELLOW}[2/11] Git kuruluyor...${NC}"
apt install -y git
GIT_VERSION=$(git --version 2>/dev/null || echo "Git kuruluyor...")
echo -e "${GREEN}✅ $GIT_VERSION${NC}"

# 3. GitHub CLI Kurulumu
echo -e "${YELLOW}[3/11] GitHub CLI (gh) kuruluyor...${NC}"
apt install -y curl wget gnupg2 software-properties-common
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
apt update
apt install -y gh
GH_VERSION=$(gh --version 2>/dev/null | head -n1 || echo "GitHub CLI kuruldu")
echo -e "${GREEN}✅ $GH_VERSION${NC}"

# 4. Temel Paketler
echo -e "${YELLOW}[4/11] Temel paketler yükleniyor...${NC}"
apt install -y build-essential

# 5. Node.js
echo -e "${YELLOW}[5/11] Node.js kuruluyor...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✅ Node.js: $(node -v)${NC}"

# 6. Nginx
echo -e "${YELLOW}[6/11] Nginx kuruluyor...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx kuruldu${NC}"

# 7. PM2
echo -e "${YELLOW}[7/11] PM2 kuruluyor...${NC}"
npm install -g pm2
echo -e "${GREEN}✅ PM2 kuruldu${NC}"

# 8. Certbot
echo -e "${YELLOW}[8/11] Certbot kuruluyor...${NC}"
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot kuruldu${NC}"

# 9. Dizinler
echo -e "${YELLOW}[9/11] Dizinler oluşturuluyor...${NC}"
mkdir -p /var/www/gozcutech
mkdir -p /var/log/pm2
chown -R $USER:$USER /var/www/gozcutech
chown -R $USER:$USER /var/log/pm2
echo -e "${GREEN}✅ Dizinler oluşturuldu${NC}"

# 10. Firewall
echo -e "${YELLOW}[10/11] Firewall ayarlanıyor...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}✅ Firewall ayarlandı${NC}"

# 11. PM2 Startup
echo -e "${YELLOW}[11/11] PM2 startup ayarlanıyor...${NC}"
STARTUP_CMD=$(pm2 startup systemd -u $USER --hp /home/$USER | grep -o 'sudo.*')
if [ ! -z "$STARTUP_CMD" ]; then
    echo -e "${YELLOW}⚠️  Şu komutu çalıştırman gerekiyor:${NC}"
    echo -e "${BLUE}$STARTUP_CMD${NC}"
fi

# 11. Özet
echo ""
echo -e "${GREEN}✅ Temel kurulum tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📊 Kurulu Versiyonlar:${NC}"
echo -e "Git: $(git --version)"
echo -e "GitHub CLI: $(gh --version | head -n1)"
echo -e "Node.js: $(node -v)"
echo -e "NPM: $(npm -v)"
echo -e "Nginx: $(nginx -v 2>&1 | head -n1)"
echo -e "PM2: $(pm2 -v)"
echo ""
echo -e "${YELLOW}📝 Sonraki Adımlar:${NC}"
echo -e "1. Projeyi klonla: cd /var/www/gozcutech && git clone <repo-url> ."
echo -e "2. .env dosyası oluştur"
echo -e "3. npm install && npm run build"
echo -e "4. Nginx config: cp nginx-gozcu.tech-initial.conf /etc/nginx/sites-available/gozcu.tech"
echo -e "5. SSL sertifikası al: certbot --nginx -d gozcu.tech -d www.gozcu.tech"
echo ""

