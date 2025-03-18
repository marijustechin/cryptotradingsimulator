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

    this.clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(jsonString);
      }
    });
  }
}

module.exports = new CryptoWSService();
