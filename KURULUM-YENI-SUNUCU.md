# 🚀 Yeni Sunucu Kurulum Rehberi

**Sunucu IP:** 64.226.80.107  
**Domain:** gozcu.tech  
**Proje Dizini:** /var/www/gozcutech

---

## 📋 ADIM 1: Sunucuya Bağlan

```bash
ssh root@64.226.80.107
# veya kullanıcı adıyla
ssh kullanici@64.226.80.107
```

---

## 📋 ADIM 2: Temel Paketler ve Git Kurulumu

```bash
# Sistem güncellemesi
apt update && apt upgrade -y

# Temel paketler
apt install -y curl wget git build-essential

# Git kurulumu
apt install -y git
git --version
```

---

## 📋 ADIM 3: GitHub CLI Kurulumu

```bash
# Gerekli paketler
apt install -y curl wget gnupg2 software-properties-common

# GitHub CLI repository ekle
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# Güncelle ve kur
apt update
apt install -y gh

# GitHub'a giriş yap
gh auth login
```

---

## 📋 ADIM 4: Node.js Kurulumu

```bash
# Node.js 20.x kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Kontrol
node -v  # v20.x.x olmalı
npm -v
```

---

## 📋 ADIM 5: Nginx Kurulumu

```bash
# Nginx kurulumu
apt install -y nginx

# Nginx'i başlat ve otomatik başlatmayı etkinleştir
systemctl start nginx
systemctl enable nginx

# Kontrol
systemctl status nginx
nginx -v
```

---

## 📋 ADIM 6: PM2 Kurulumu

```bash
# PM2 global kurulumu
npm install -g pm2

# PM2 startup script (sunucu yeniden başladığında otomatik başlat)
pm2 startup systemd -u $USER --hp /home/$USER
# Çıkan komutu çalıştır (sudo ile başlayan komut)
```

---

## 📋 ADIM 7: Certbot Kurulumu (SSL için)

```bash
# Certbot kurulumu
apt install -y certbot python3-certbot-nginx
```

---

## 📋 ADIM 8: Proje Dizini Oluştur

```bash
# Proje dizini oluştur
mkdir -p /var/www/gozcutech
chown -R $USER:$USER /var/www/gozcutech

# Log dizini
mkdir -p /var/log/pm2
chown -R $USER:$USER /var/log/pm2
```

---

## 📋 ADIM 9: Projeyi Klonla

```bash
cd /var/www/gozcutech

# GitHub CLI ile klonla
gh repo clone husobiker/gozcutech .

# Veya normal git ile
git clone https://github.com/husobiker/gozcutech.git .
```

---

## 📋 ADIM 10: Environment Variables Ayarla

```bash
cd /var/www/gozcutech

# .env dosyası oluştur
cp env-template.txt .env
nano .env
```

Supabase bilgilerini kontrol et (zaten template'te var).

---

## 📋 ADIM 11: Frontend Build

```bash
cd /var/www/gozcutech

# Dependencies yükle
npm install

# Production build
npm run build
```

Build başarılı olursa `dist/` klasörü oluşacak.

---

## 📋 ADIM 12: Backend Dependencies

```bash
cd /var/www/gozcutech/backend

# Backend dependencies
npm install
```

---

## 📋 ADIM 13: Nginx Konfigürasyonu

```bash
cd /var/www/gozcutech

# İlk kurulum için SSL olmadan config kullan
sudo cp nginx-gozcu.tech-initial.conf /etc/nginx/sites-available/gozcu.tech

# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/gozcu.tech /etc/nginx/sites-enabled/

# Default config'i kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx syntax kontrolü
sudo nginx -t

# Nginx'i restart et
sudo systemctl restart nginx
```

---

## 📋 ADIM 14: Firewall Ayarları

```bash
# UFW firewall kontrolü
ufw status

# Gerekli portları aç
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Firewall'u etkinleştir
ufw enable
```

---

## 📋 ADIM 15: Dosya İzinleri

```bash
cd /var/www/gozcutech

# Ownership ayarla
sudo chown -R www-data:www-data dist
sudo chown -R $USER:$USER /var/www/gozcutech

# İzinler
sudo chmod -R 755 dist
```

---

## 📋 ADIM 16: PM2 ile Backend Başlat

```bash
cd /var/www/gozcutech

# PM2 ile backend başlat
pm2 start ecosystem.config.cjs

# PM2'yi kaydet
pm2 save

# PM2 durumunu kontrol et
pm2 status
pm2 logs gozcu-yazilim
```

---

## 📋 ADIM 17: Test

```bash
# IP ile test
curl -I http://64.226.80.107

# Domain testi (eğer DNS ayarlıysa)
curl -I http://gozcu.tech
```

---

## 📋 ADIM 18: SSL Sertifikası (Domain Hazırsa)

**ÖNEMLİ:** Domain'in DNS'i IP adresine (64.226.80.107) yönlendirilmiş olmalı!

```bash
# SSL sertifikası al
sudo certbot --nginx -d gozcu.tech -d www.gozcu.tech
```

SSL alındıktan sonra tam config'e geç:

```bash
# Tam SSL config'e geç
sudo cp nginx-gozcu.tech.conf /etc/nginx/sites-available/gozcu.tech

# Syntax kontrolü
sudo nginx -t

# Nginx'i reload et
sudo systemctl reload nginx
```

---

## ✅ Kurulum Tamamlandı!

Tarayıcıda test et:
- http://64.226.80.107 (IP ile)
- https://gozcu.tech (Domain ile, SSL sonrası)

---

## 🔄 Güncelleme İşlemi

Gelecekte güncelleme için:

```bash
cd /var/www/gozcutech
./deploy-new-server.sh
```

Veya manuel:

```bash
cd /var/www/gozcutech
git pull origin main
npm install
npm run build
pm2 restart gozcu-yazilim
sudo systemctl reload nginx
```

---

## 🔍 Troubleshooting

### Nginx Hatası
```bash
# Log kontrol
sudo tail -f /var/log/nginx/gozcu.tech.error.log

# Nginx status
sudo systemctl status nginx
```

### PM2 Hatası
```bash
# PM2 logs
pm2 logs gozcu-yazilim

# PM2 restart
pm2 restart gozcu-yazilim
```

### Build Hatası
```bash
# Node version kontrol
node -v  # 20.x olmalı

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Monitoring Komutları

```bash
# Disk kullanımı
df -h

# Memory
free -h

# PM2 monitoring
pm2 monit

# Nginx access logs
tail -f /var/log/nginx/gozcu.tech.access.log
```

