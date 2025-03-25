import { useState } from 'react';
import { ITicker } from '../../types/tradingN';
import { useAppSelector } from '../../store/store';
import { getChartSymbol } from '../../store/features/trading/chartSlice';

import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';

export const TickersN = () => {
  const selectedSymbol = useAppSelector(getChartSymbol);
  const [activeTicker, setActiveTicker] = useState<ITicker>();

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => sendJsonMessage({ type: 'subscribe', role: 'live' }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.data.symbol === selectedSymbol) {
        setActiveTicker(parsedData.data);
      }
    },
  });

  return (
    <section className="flex gap-3 p-2 border-t border-b border-violet-800 items-center">
      <p>
        24h high{' '}
        <span className="text-emerald-500">{activeTicker?.highPrice24h}</span>
      </p>
      <p>
        24h low{' '}
        <span className="text-rose-500">{activeTicker?.lowPrice24h}</span>
      </p>
      <p>
        24h change{' '}
        <span
          className={`${
            activeTicker?.price24hPcnt && activeTicker.price24hPcnt > 0
              ? 'text-emerald-500'
              : 'text-rose-500'
          }`}
        >
          {activeTicker?.price24hPcnt}%
        </span>
      </p>
      <p>
        Indexed{' '}
        <span className="text-emerald-500">{activeTicker?.usdIndexPrice}</span>
      </p>
      <p>
        Volume:{' '}
        <span className="text-amber-600">{activeTicker?.volume24h}</span>
      </p>
    </section>
  );
};
