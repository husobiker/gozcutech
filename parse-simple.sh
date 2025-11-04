#!/bin/bash

cat > ~/parse-server/index.js << 'INDEX_EOF'
var ParseServer = require('parse-server').ParseServer;
var express = require('express');
var http = require('http');

var app = express();

var api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/parse',
  appId: 'gozcuAppId',
  masterKey: 'gozcuMasterKey2024',
  serverURL: 'http://localhost:1337/parse',
  publicServerURL: 'http://178.157.15.26:1337/parse'
});

// Mount Parse Server middleware
app.use('/parse', api);

// Start HTTP server
var httpServer = http.createServer(app);
httpServer.listen(1337, function() {
  console.log('✅ Parse Server başlatıldı: http://178.157.15.26:1337/parse');
});

INDEX_EOF

echo "✅ index.js oluşturuldu"

cd ~/parse-server
pm2 delete parse-server
pm2 start index.js --name parse-server
pm2 save

echo "✅ Parse Server PM2'de başlatıldı"
pm2 logs parse-server --lines 20


