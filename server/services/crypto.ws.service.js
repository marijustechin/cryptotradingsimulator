const pako = require('pako');

class CryptoWSService {
  constructor() {
    this.clients = new Set();
  }

  addClient(ws) {
    this.clients.add(ws);
    ws.on('close', () => this.clients.delete(ws));
  }

  broadcastData(data) {
    if (!data) {
      console.error('Attempted to send undefined/null data.');
      return;
    }

    const jsonString = JSON.stringify(data);
    const compressed = pako.deflate(jsonString);

    this.clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(compressed);
      }
    });
  }
}

module.exports = new CryptoWSService();
