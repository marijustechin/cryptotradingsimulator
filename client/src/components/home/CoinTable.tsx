import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getAssets,
  selectAssets,
  updateAssets,
} from '../../store/features/crypto/assetsSlice';
import { ICryptoAsset } from '../../types/crypto';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:3003/ws/crypto';
import { Coin } from './Coin';
import { Loader } from '../Loader';

export const CoinTable = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets) as ICryptoAsset[];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (assets?.length === 0) {
      setIsLoading(true);
      dispatch(getAssets()).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, assets]);

  useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      if (Array.isArray(parsedData)) {
        dispatch(updateAssets([...parsedData].sort((a, b) => a.rank - b.rank)));
      } else {
        console.error('Received data is not an array:', parsedData);
      }
    },
  });
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative z-15 rounded-[25px] bg-[#1A1B23] mx-auto p-3 mt-10 divide-y divide-black w-full">
      {assets.slice(0, 5).map((asset) => (
        <Coin key={asset.id} asset={asset} />
      ))}
    </div>
  );
};
