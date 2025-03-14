const { clients } = require('./crypto.service');

function setupWebSocket(app) {
  app.ws('/ws/crypto', (ws, req) => {
    clients.push(ws);
    console.log('New WebSocket connection established');

    ws.on('close', () => {
      clients.splice(clients.indexOf(ws), 1);
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = { setupWebSocket };
