import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getChartSymbol,
  getCurrentPrices,
  setCurrentPrices,
} from "../../store/features/trading/chartSlice";
import { useTranslation } from 'react-i18next';
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../api/ws";

export const TickersN = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedSymbol = useAppSelector(getChartSymbol);
  const activeTicker = useAppSelector(getCurrentPrices);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => sendJsonMessage({ type: "subscribe", role: "live" }),
    onMessage: (event: WebSocketEventMap["message"]) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.data.symbol === selectedSymbol) {
        dispatch(setCurrentPrices(parsedData.data));
      }
    },
  });

  return (
    <main className="bg-gray-800 rounded-xl p-4 shadow">
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 p-4 border-t border-b border-violet-800 text-center w-full">
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.24hHigh')}</p>
        <p className="text-emerald-500">{activeTicker?.highPrice24h}</p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.24hLow')}</p>
        <p className="text-rose-500">{activeTicker?.lowPrice24h}</p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.24hChange')}</p>
        <p
          className={`$ {activeTicker?.price24hPcnt > 0 ? 'text-emerald-500' : 'text-rose-500'}`}
        >
          {activeTicker?.price24hPcnt}%
        </p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.lastPrice')}</p>
        <p className="text-emerald-500">{activeTicker?.lastPrice}</p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.index')}</p>
        <p className="text-amber-600">
          {activeTicker?.usdIndexPrice &&
            Math.round(activeTicker?.usdIndexPrice * 1000) / 1000}
        </p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.turnover24h')}</p>
        <p className="text-amber-600">
          {activeTicker?.turnover24h && Math.round(activeTicker?.turnover24h)}
        </p>
      </div>
      <div className="flex flex-col items-center min-w-[80px]">
        <p className="text-xs text-violet-400">{t('ticker.volume')}</p>
        <p className="text-amber-600">
          {activeTicker?.volume24h &&
            Math.round(activeTicker?.volume24h * 100) / 100}
        </p>
      </div>
    </section>
    </main>
  );
};
