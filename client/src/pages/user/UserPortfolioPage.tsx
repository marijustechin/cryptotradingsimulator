import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import {
  getAssets,
  selectAssets,
  updateAssets,
} from '../../store/features/crypto/assetsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

const WS_URL = 'ws://localhost:3003/ws/crypto';

export const UserPortfolioPage = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets);
  const [connected, setConnected] = useState(false);

  // patikrinam konteksta ir jei nera duomenu,
  // pasakom kontekstui nueiti ir juos pasiimti
  useEffect(() => {
    if (!assets || assets.length === 0) {
      dispatch(getAssets());
    }
  }, [dispatch, assets]);

  // prisijungiam prie websocket,
  // kuris periodiskai siuncia atnaujintus duomenis
  useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => setConnected(true),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      // jei atejo teisingi duomenys
      if (Array.isArray(parsedData)) {
        // surikiuojam pagal ranka
        const sortedData = [...parsedData].sort((a, b) => a.rank - b.rank);
        // atnaujinam assets konteksta
        dispatch(updateAssets(sortedData));
      } else {
        console.error('Received data is not an array:', parsedData);
      }
    },
  });

  return (
    <main className="flex flex-col gap-3">
      <h1>User portfolio page</h1>
      {/* Sito teksto gali nebuti, jis testavimui */}
      {connected && (
        <p>Tekstas vietoj console.log: prisijunges prie WebSocket...</p>
      )}

      {/* Testuoju kaip atsinaujina assets info
      is tikruju sitoj vietoj reiketu perduoti assets 
      pagrindiniam komponentui tip: 
      <TradingPrices assets={assets} /> */}
      {assets &&
        assets.length > 0 &&
        assets.map((asset) => <p key={asset.id}>{asset.priceUsd}</p>)}
    </main>
  );
};
