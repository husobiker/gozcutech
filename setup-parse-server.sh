#!/bin/bash
# Parse Server Kurulum Script - Ubuntu 20.04+

echo "🚀 Parse Server Kurulum Başlıyor..."

# 1. Node.js 18+ Kurulumu
echo "📦 Node.js kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. MongoDB Kurulumu
echo "📦 MongoDB kuruluyor..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# MongoDB'yi başlat
sudo systemctl start mongod
sudo systemctl enable mongod

# 3. PM2 Kurulumu (process manager)
echo "📦 PM2 kuruluyor..."
sudo npm install -g pm2

# 4. Parse Server klasörü oluştur
echo "📁 Parse Server klasörü oluşturuluyor..."
mkdir -p ~/parse-server
cd ~/parse-server

# 5. package.json oluştur
cat > package.json << 'EOF'
{
  "name": "parse-server-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "parse-server": "^6.0.0"
  }
}
EOF

# 6. index.js oluştur (düzeltilmiş)
cat > index.js << 'EOF'
const ParseServer = require('parse-server').ParseServer;
const express = require('express');

const app = express();

const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/parse',
  appId: 'gozcuAppId',
  masterKey: 'gozcuMasterKey2024',
  serverURL: 'http://localhost:1337/parse',
  publicServerURL: 'http://178.157.15.26:1337/parse',
  logLevel: 'info'
});

const httpServer = require('http').createServer(app);

app.use('/parse', api);

httpServer.listen(1337, function() {
    console.log('parse-server running on port 1337.');
});
EOF

# 7. Install dependencies
echo "📦 Dependencies kuruluyor..."
npm install express parse-server

# 8. PM2 ile başlat
echo "🚀 Parse Server PM2 ile başlatılıyor..."
pm2 start index.js --name parse-server
pm2 save
pm2 startup

echo "✅ Parse Server kuruldu!"
echo "🔗 Server URL: http://178.157.15.26:1337/parse"
echo "🔑 App ID: gozcuAppId"
echo "🔑 Master Key: gozcuMasterKey2024"
echo ""
echo "📊 Durum kontrolü: pm2 status"
echo "📝 Loglar: pm2 logs parse-server"

