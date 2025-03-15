import { useState, useEffect } from 'react';
import { SingleAssetTest } from './SingleAssetTest';
import { useAppDispatch } from '../../store/store';
import {
  getAssets,
  selectAssets,
  updateAssets,
} from '../../store/features/crypto/assetsSlice';
import { useSelector } from 'react-redux';

export const WebSocketTest = () => {
  const dispatch = useAppDispatch();
  const assets = useSelector(selectAssets);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    if (!assets || assets.length === 0) {
      dispatch(getAssets());
    }
  }, [dispatch, assets]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003/ws/crypto');

    socket.onopen = () => {
      setStatus('connected');
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (Array.isArray(parsedData)) {
          const sortedData = parsedData.sort((a, b) => a.rank - b.rank);
          dispatch(updateAssets(sortedData)); // 🔥 Update Redux store
        } else {
          console.error('Received data is not an array:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <div className="p-4 border rounded-lg shadow-lg shadow-violet-700 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">WebSocket testas</h2>
      {status === 'connected' ? (
        <div>
          <p>Kainos atsinaujina kas 2 minutes</p>
          <div className="flex flex-col gap-2">
            {assets &&
              assets.length > 0 &&
              assets.map((asset) => (
                <SingleAssetTest key={asset.id} asset={asset} />
              ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-rose-500">Neprisijungęs prie serverio...</p>
        </div>
      )}
    </div>
  );
};
