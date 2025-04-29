import HelperService from '../../services/HelperService';
import { Link } from 'react-router';
import { HomeLiveChart } from './HomeLiveChart';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';
import { useState } from 'react';
import { ITicker } from '../../types/tradingN';
import { useTranslation } from 'react-i18next';

interface ICoinProps {
  assetId: string;
  assetCode: string;
}

const Coin = ({ assetId, assetCode }: ICoinProps) => {
  const [ticker, setTicker] = useState<ITicker>();
  const { t } = useTranslation();

  // gaunam istorija ////////////////////////////////
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => sendJsonMessage({ type: 'subscribe', role: 'live' }),

    onMessage: (event: WebSocketEventMap['message']) => {
      const eventData = JSON.parse(event.data);
      if (eventData.data.symbol === assetId) {
        setTicker(eventData.data);
      }
    },
  });
  // istorijios pabaiga /////////////////////////////

  return (
    <div className='grid grid-cols-[0.8fr_1.9fr_1.3fr_1.5fr_1fr] items-center py-4 px-2 text-white text-sm md:text-base place-content-center'>
      <div className='font-bold text-violet-400'>
         {assetCode}
      </div>
      <div>
        {ticker?.lastPrice && HelperService.formatCurrency(ticker.lastPrice)}
      </div>
      <div
        className={`${
          ticker && ticker.price24hPcnt >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {ticker?.price24hPcnt}%
      </div>
      <HomeLiveChart assetId={assetId} />

      <Link
        to='/registration'
        className='text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-transparent bg-clip-text transition text-center'
      >
        {t('home_cta_trade_now')} →
      </Link>
    </div>
  );
};
export default Coin;
