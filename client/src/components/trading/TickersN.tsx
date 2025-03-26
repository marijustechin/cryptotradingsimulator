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
    <section className='flex gap-3 p-2 border-t border-b border-violet-800 items-center justify-between'>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>24h high</p>
        <p className='text-emerald-500'>{activeTicker?.highPrice24h}</p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>24h low</p>
        <p className='text-rose-500'>{activeTicker?.lowPrice24h}</p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>24h change</p>{' '}
        <p
          className={`${
            activeTicker?.price24hPcnt && activeTicker.price24hPcnt > 0
              ? 'text-emerald-500'
              : 'text-rose-500'
          }`}
        >
          {activeTicker?.price24hPcnt}%
        </p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>Last price</p>{' '}
        <p className='text-emerald-500'>{activeTicker?.lastPrice}</p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>Index</p>
        <p className='text-amber-600'>
          {activeTicker?.usdIndexPrice &&
            Math.round(activeTicker?.usdIndexPrice * 1000) / 1000}
        </p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>24h turnover</p>
        <p className='text-amber-600'>
          {activeTicker?.turnover24h && Math.round(activeTicker?.turnover24h)}
        </p>
      </div>
      <div className='flex flex-col items-center w-full'>
        <p className='text-xs text-violet-400'>Volume</p>
        <p className='text-amber-600'>
          {activeTicker?.volume24h &&
            Math.round(activeTicker?.volume24h * 100) / 100}
        </p>
      </div>
    </section>
  );
};
