const fs = require('fs');
const https = require('https');
const http = require('http');
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const httpPort = normalizePort(80); // Port HTTP
const httpsPort = normalizePort(process.env.PORT || '4000'); // Port HTTPS

app.set('port', httpsPort);

// Charger les certificats SSL
const options = {
  key: fs.readFileSync('server.key'), // Clé privée
  cert: fs.readFileSync('server.cert'), // Certificat
};

// Rediriger toutes les requêtes HTTP vers HTTPS
const httpServer = http.createServer((req, res) => {
  // Effectuer la redirection HTTP vers HTTPS
  res.redirect(
    301,
    `https://${req.headers.host.replace(/^http:/, '')}${req.url}`,
  );
});

const httpsServer = https.createServer(options, app); // Créer le serveur HTTPS

// Gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = httpsServer.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + httpsPort;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

httpsServer.on('error', errorHandler);
httpsServer.on('listening', () => {
  const address = httpsServer.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port ' + httpsPort;
  console.log('HTTPS Server Listening on ' + bind);
});

httpServer.on('listening', () => {
  console.log('HTTP Server Listening on port 80 (Redirecting to HTTPS)');
});

// Démarrer les serveurs HTTP et HTTPS
httpServer.listen(httpPort);
httpsServer.listen(httpsPort);
