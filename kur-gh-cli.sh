#!/bin/bash

# GitHub CLI (gh) Kurulum Scripti
# Sunucuda çalıştır: bash kur-gh-cli.sh

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📦 GitHub CLI (gh) Kurulumu Başlıyor...${NC}"
echo ""

# Sistem güncellemesi
echo -e "${YELLOW}[1/4] Sistem güncelleniyor...${NC}"
apt update

# Gerekli paketler
echo -e "${YELLOW}[2/4] Gerekli paketler yükleniyor...${NC}"
apt install -y curl wget gnupg2 software-properties-common

# GitHub CLI kurulumu
echo -e "${YELLOW}[3/4] GitHub CLI kuruluyor...${NC}"

# Resmi GitHub CLI repository'sini ekle
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg

# Repository ekle
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# Güncelle ve kur
apt update
apt install -y gh

# Versiyon kontrolü
echo -e "${YELLOW}[4/4] GitHub CLI versiyonu kontrol ediliyor...${NC}"
GH_VERSION=$(gh --version | head -n1)
echo -e "${GREEN}✅ $GH_VERSION kuruldu${NC}"

# Özet
echo ""
echo -e "${GREEN}✅ GitHub CLI kurulumu tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📝 Sonraki Adımlar:${NC}"
echo -e "1. GitHub'a giriş yap: ${BLUE}gh auth login${NC}"
echo -e "2. Projeyi klonla: ${BLUE}gh repo clone husobiker/gozcutech${NC}"
echo -e "3. Veya normal git ile: ${BLUE}git clone https://github.com/husobiker/gozcutech.git${NC}"
echo ""


