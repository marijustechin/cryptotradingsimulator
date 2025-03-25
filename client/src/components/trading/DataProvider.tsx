import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '../../store/store';
import { setCandles } from '../../store/features/trading/chartSlice';

export const DataProvider = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket: Socket = io('http://localhost:61630', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
    });

    socket.on('candleUpdate', (data) => {
      const { interval, ...rest } = data;

      dispatch(
        setCandles({
          interval,
          candles: [rest], // we assume each update is 1 full candle
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return <div>📡 Connected to microservice (check console)</div>;
};
