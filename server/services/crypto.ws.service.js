const clients = new Set();

const addClient = (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws)); // Remove client on disconnect
};

const broadcastData = (data) => {
  clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
};

module.exports = { addClient, broadcastData };
