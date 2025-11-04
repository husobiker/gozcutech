#!/bin/bash

ssh root@178.157.15.26 -p 23422 << 'ENDSSH'

cd ~/parse-server

cat > index.js << 'INDEX_EOF'
const ParseServer = require('parse-server').ParseServer;
const express = require('express');
const http = require('http');

const app = express();

const parseServer = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/parse',
  appId: 'gozcuAppId',
  masterKey: 'gozcuMasterKey2024',
  serverURL: 'http://localhost:1337/parse',
  publicServerURL: 'http://178.157.15.26:1337/parse'
});

app.use('/parse', parseServer.app);

const httpServer = http.createServer(app);
httpServer.listen(1337, function() {
  console.log('✅ Parse Server çalışıyor: http://178.157.15.26:1337/parse');
  console.log('🔑 App ID: gozcuAppId');
});

INDEX_EOF

echo "✅ index.js düzeltildi"
echo "📦 PM2 restart ediliyor..."
pm2 restart parse-server

sleep 3

echo "📊 Status:"
pm2 status parse-server

echo ""
echo "📝 Logs:"
pm2 logs parse-server --lines 10 --nostream

ENDSSH


