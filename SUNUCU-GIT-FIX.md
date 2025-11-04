# 🔧 Git Ownership Hatası Çözümü

## Sorun
```
fatal: detected dubious ownership in repository at '/var/www/gozcutech'
```

## ✅ Çözüm

Sunucuda şu komutu çalıştır:

```bash
sudo git config --global --add safe.directory /var/www/gozcutech
```

Sonra tekrar pull yap:

```bash
cd /var/www/gozcutech
git pull origin main
```

## 🔄 Alternatif: Her Kullanıcı İçin

Eğer hala sorun varsa:

```bash
# Root kullanıcısı için
sudo git config --global --add safe.directory '*'

# Veya sadece bu repo için
cd /var/www/gozcutech
sudo git config --add safe.directory /var/www/gozcutech
```

## 📝 Not

Build başarılı! Site çalışıyor olmalı. Sadece git pull için bu fix gerekiyor.

