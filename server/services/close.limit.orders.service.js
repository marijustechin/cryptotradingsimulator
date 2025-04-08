const WebSocket = require('ws');
const tradeService = require('./trade.service');

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

let ws;

function subscribeAll() {
  SYMBOLS.forEach((symbol) => {
    ws.send(
      JSON.stringify({
        type: 'history',
        symbol,
        interval: '1',
      })
    );
  });
}

function setupWebSocket() {
  ws = new WebSocket(process.env.PRIVATE_WS_URL);

  ws.on('open', () => {
    console.log('[WebSocket] Connected to server');
    subscribeAll();
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      if (message && message.type === 'history') {
        const { symbol, data } = message;
        await tradeService.checkAndCloseOrders(symbol, data);
      }
    } catch (err) {
      console.error('[WebSocket] Error handling message:', err);
    }
  });

  ws.on('error', (err) => {
    console.error('[WebSocket] Connection error:', err);
  });

  ws.on('close', () => {
    console.warn('[WebSocket] Connection closed. Reconnecting in 5s...');
    setTimeout(setupWebSocket, 5000);
  });
}

function startWebSocketService() {
  setupWebSocket();
  // Re-subscribe every 10 minutes
  setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      subscribeAll();
    }
  }, 2 * 60 * 1000);
}

module.exports = {
  startWebSocketService,
};
