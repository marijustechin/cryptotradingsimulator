import { WebSocketServer, WebSocket } from 'ws';
import { getHistory } from './db';
import { formatCandlesForChart } from './utils';

interface TaggedClient extends WebSocket {
  role?: 'live' | 'history';
}

const clients = new Set<TaggedClient>();

export const setupWSServer = (wss: WebSocketServer) => {
  wss.on('connection', (ws: TaggedClient) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'subscribe' && msg.role === 'live') {
          ws.role = 'live';
          console.log('🎧 Subscribed to live tickers');
        }

        if (msg.type === 'history' && msg.symbol && msg.interval) {
          ws.role = 'history';
          console.log(`History request for ${msg.symbol}/${msg.interval}`);

          try {
            const history = await getHistory(msg.symbol, msg.interval);
            const chartFormat = formatCandlesForChart(history);
            ws.send(
              JSON.stringify({
                type: 'history',
                symbol: msg.symbol,
                data: chartFormat,
              })
            );
          } catch (err) {
            console.error('❌ DB error:', err);
            ws.send(JSON.stringify({ type: 'error', message: 'DB error' }));
          }
        }
      } catch (err) {
        console.warn('Bad message from client:', raw.toString());
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('🔌 Client disconnected');
    });
  });
};

export const broadcastTicker = (data: any) => {
  const message = JSON.stringify({ type: 'ticker', data });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN && client.role === 'live') {
      client.send(message);
    }
  }
};
