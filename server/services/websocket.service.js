const cryptoWSService = require('./crypto.ws.service');

function setupWebSocket(app) {
  app.ws('/ws/crypto', (ws, req) => {
    // websocket kliento registracija
    console.log(req);
    cryptoWSService.addClient(ws);
    console.log('New WebSocket connection established');

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = { setupWebSocket };
