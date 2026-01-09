#!/bin/bash

# Sunucu Durum Kontrol Scripti
# Sunucuda çalıştır

set -e

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Sunucu Durum Kontrolü Başlıyor...${NC}"
echo ""

# 1. Nginx Durumu
echo -e "${YELLOW}[1/6] Nginx durumu kontrol ediliyor...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx çalışıyor${NC}"
    systemctl status nginx --no-pager -l | head -n 5
else
    echo -e "${RED}❌ Nginx çalışmıyor!${NC}"
    echo -e "${YELLOW}Nginx'i başlatmak için: sudo systemctl start nginx${NC}"
fi
echo ""

# 2. PM2 Durumu
echo -e "${YELLOW}[2/6] PM2 durumu kontrol ediliyor...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo -e "${RED}❌ PM2 bulunamadı${NC}"
fi
echo ""

# 3. Port Kontrolü
echo -e "${YELLOW}[3/6] Port kontrolü yapılıyor...${NC}"
if netstat -tlnp | grep -q ":80 "; then
    echo -e "${GREEN}✅ Port 80 (HTTP) dinleniyor${NC}"
    netstat -tlnp | grep ":80 "
else
    echo -e "${RED}❌ Port 80 dinlenmiyor${NC}"
fi

if netstat -tlnp | grep -q ":443 "; then
    echo -e "${GREEN}✅ Port 443 (HTTPS) dinleniyor${NC}"
    netstat -tlnp | grep ":443 "
else
    echo -e "${RED}❌ Port 443 dinlenmiyor${NC}"
fi

if netstat -tlnp | grep -q ":3012 "; then
    echo -e "${GREEN}✅ Port 3012 (Backend) dinleniyor${NC}"
    netstat -tlnp | grep ":3012 "
else
    echo -e "${RED}❌ Port 3012 dinlenmiyor${NC}"
fi
echo ""

# 4. Firewall Durumu
echo -e "${YELLOW}[4/6] Firewall durumu kontrol ediliyor...${NC}"
if command -v ufw &> /dev/null; then
    ufw status
else
    echo -e "${YELLOW}⚠️  UFW bulunamadı${NC}"
fi
echo ""

# 5. Nginx Config Kontrolü
echo -e "${YELLOW}[5/6] Nginx config kontrol ediliyor...${NC}"
if nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx config geçerli${NC}"
else
    echo -e "${RED}❌ Nginx config hatası!${NC}"
fi
echo ""

# 6. Site Testi
echo -e "${YELLOW}[6/6] Site testi yapılıyor...${NC}"
echo -e "Local test:"
curl -I http://localhost 2>&1 | head -n 5 || echo -e "${RED}❌ Local test başarısız${NC}"

echo -e "\nIP testi:"
curl -I http://46.101.111.170 2>&1 | head -n 5 || echo -e "${RED}❌ IP test başarısız${NC}"

echo -e "\nDomain testi:"
curl -I https://gozcu.tech 2>&1 | head -n 5 || echo -e "${RED}❌ Domain test başarısız${NC}"

echo ""
echo -e "${BLUE}📊 Kontrol tamamlandı!${NC}"
echo ""


