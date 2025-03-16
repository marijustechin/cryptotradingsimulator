// services/WebSocketService.js
import pako from 'pako';
import { store } from '../store/store';
import { updateAssets } from '../store/features/crypto/assetsSlice';

class WebSocketService {
  reconnectAttempts: number;
  MAX_RETRIES: number;
  RETRY_DELAY: number;
  socket: WebSocket | null;

  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.MAX_RETRIES = 5;
    this.RETRY_DELAY = 3000; // 3 seconds
  }

  startWebSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already open');
      return;
    }

    this.socket = new WebSocket('ws://localhost:3003/ws/crypto');

    this.socket.binaryType = 'blob'; // Ensure data is received as binary

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0; // Reset retry counter on success
    };

    this.socket.onmessage = async (event) => {
      try {
        if (!event.data) {
          throw new Error('Received empty WebSocket message.');
        }

        const arrayBuffer = await event.data.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const decompressed = pako.inflate(uint8Array, { to: 'string' });
        const parsedData = JSON.parse(decompressed);

        if (Array.isArray(parsedData)) {
          const sortedData = [...parsedData].sort((a, b) => a.rank - b.rank);

          store.dispatch(updateAssets(sortedData));
        } else {
          console.error('Received data is not an array:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');

      if (this.reconnectAttempts < this.MAX_RETRIES) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.startWebSocket();
        }, this.RETRY_DELAY);
      } else {
        console.error(
          'Max reconnect attempts reached. WebSocket will not reconnect.'
        );
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  closeWebSocket() {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket closed manually');
    }
  }
}

export default new WebSocketService();
