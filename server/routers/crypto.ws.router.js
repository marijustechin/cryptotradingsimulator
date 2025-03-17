const expressWs = require('express-ws');
const cryptoWSService = require('../services/crypto.ws.service');

const setupWebSocketRoutes = (app) => {
  expressWs(app);
  app.ws('/ws/crypto', (ws, req) => {
    console.log('Client connected to WebSocket');
    cryptoWSService.addClient(ws);
  });
};

module.exports = setupWebSocketRoutes;
