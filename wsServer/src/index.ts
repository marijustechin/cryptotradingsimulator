// src/server.ts
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { connectToBybit } from './bybitClient';
import { setupWSServer } from './wsServer';
import { getDataFromBybit } from './iportHistory';

import { testConnection } from './sequelize';
testConnection();

const app = express();
const PORT = process.env.BROADCAST_PORT ?? 61630;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupWSServer(wss);
connectToBybit();

(async () => {
  //await getDataFromBybit('BTCUSDT', '60');
  //await getDataFromBybit('ETHUSDT', '60');
  //await getDataFromBybit('SOLUSDT', '60');
  //await getDataFromBybit('SOLUSDT', '30');
  //await getDataFromBybit('BTCUSDT', '30');
  // await getDataFromBybit('ETHUSDT', '30');
  // await getDataFromBybit('ETHUSDT', '15');
  // await getDataFromBybit('BTCUSDT', '15');
  // await getDataFromBybit('SOLUSDT', '15');
})();

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
});
