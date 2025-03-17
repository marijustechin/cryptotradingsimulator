import { useEffect } from 'react';
import { SingleAssetTest } from './SingleAssetTest';
import { useAppDispatch } from '../../store/store';
import {
  getAssets,
  selectAssets,
} from '../../store/features/crypto/assetsSlice';
import { useSelector } from 'react-redux';
import WebSocketService from '../../services/WebSocketService';

export const WebSocketTest = () => {
  const dispatch = useAppDispatch();
  const assets = useSelector(selectAssets);

  useEffect(() => {
    if (!assets || assets.length === 0) {
      dispatch(getAssets());
    }
  }, [dispatch, assets]);

  useEffect(() => {
    WebSocketService.startWebSocket();

    return () => {
      WebSocketService.closeWebSocket();
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg shadow-violet-700 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">WebSocket testas</h2>

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
    </div>
  );
};
