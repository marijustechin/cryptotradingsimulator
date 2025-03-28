import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';

import useWebSocket from 'react-use-websocket';
import { Coin } from './Coin';
import { Loader } from '../Loader';
import {
  allActiveSymbols,
  getAllSymbols,
} from '../../store/features/trading/chartSlice';
import { ITicker } from '../../types/tradingN';
import { WS_URL } from '../../api/ws';
import { HomeLiveChart } from './HomeLiveChart';

const CoinTable = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(allActiveSymbols);
  const [isLoading, setIsLoading] = useState(true);
  const [btc, setBtc] = useState<ITicker>();
  const [eth, setEth] = useState<ITicker>();
  const [chartData, setChartData] = useState<{ price: number }[]>([]);

  useEffect(() => {
    if (!assets) {
      dispatch(getAllSymbols());
    }
  }, [dispatch, assets]);

  const MAX_LENGTH = 200;

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => sendJsonMessage({ type: 'subscribe', role: 'live' }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.data.symbol === 'BTCUSDT') {
        const price = Number(parsedData.data.lastPrice); // Make sure it's a number
        setBtc(parsedData.data);
        setChartData((prev) => {
          const updated = [...prev, { price }];
          return updated.length > 30 ? updated.slice(-MAX_LENGTH) : updated;
        });
      }
      if (parsedData.data.symbol === 'ETHUSDT') {
        const price = Number(parsedData.data.lastPrice); // Make sure it's a number
        setEth(parsedData.data);
        setChartData((prev) => {
          const updated = [...prev, { price }];
          return updated.length > 30 ? updated.slice(-MAX_LENGTH) : updated;
        });
      }
    },
  });

  return (
    <div className='relative z-15 rounded-[25px] bg-[#1A1B23] mx-auto p-3 mt-10 divide-y divide-black w-full'>
      {btc && <Coin asset={btc} />}
      {eth && <Coin asset={eth} />}
      <HomeLiveChart chartData={chartData} />
    </div>
  );
};
export default CoinTable;
