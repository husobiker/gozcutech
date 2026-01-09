#!/bin/bash

# Git CLI Kurulum Scripti
# Sunucuda çalıştır: bash kur-git.sh

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Git CLI Kurulumu Başlıyor...${NC}"
echo ""

# Sistem güncellemesi
echo -e "${YELLOW}[1/3] Sistem güncelleniyor...${NC}"
apt update

# Git kurulumu
echo -e "${YELLOW}[2/3] Git kuruluyor...${NC}"
apt install -y git

# Git versiyon kontrolü
echo -e "${YELLOW}[3/3] Git versiyonu kontrol ediliyor...${NC}"
GIT_VERSION=$(git --version)
echo -e "${GREEN}✅ $GIT_VERSION kuruldu${NC}"

# Git konfigürasyonu (opsiyonel)
echo ""
echo -e "${YELLOW}📝 Git Konfigürasyonu (Opsiyonel):${NC}"
echo -e "Git kullanıcı adı ve email ayarlamak için:"
echo -e "  git config --global user.name \"İsminiz\""
echo -e "  git config --global user.email \"email@example.com\""
echo ""
echo -e "${GREEN}✅ Git kurulumu tamamlandı!${NC}"
echo ""


