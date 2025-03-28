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
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const CoinTable = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(allActiveSymbols);
  const [isLoading, setIsLoading] = useState(true);
  const [btc, setBtc] = useState<ITableData>();
  const [eth, setEth] = useState<ITableData>();
  const [chartData, setChartData] = useState<number[]>([]);

  interface ITableData {
    name: string;
    code: string;
    price: number;
    priceChange: number;
  }

  useEffect(() => {
    if (!assets) {
      dispatch(getAllSymbols());
    }
  }, [dispatch, assets]);

  const handleSetBtc = (data: ITicker) => {
    setBtc({
      name: 'Bitcoin',
      code: 'BTC',
      price: data.lastPrice,
      priceChange: data.price24hPcnt,
    });
    if (chartData) {
      setChartData((prev) => [...prev, data.lastPrice]);
    } else {
      const temp = [];
      temp.push(data.lastPrice);
      setChartData([...temp]);
    }
  };
  const handleSetEth = (data: ITicker) => {
    setEth({
      name: 'Ethereum',
      code: 'ETH',
      price: data.lastPrice,
      priceChange: data.price24hPcnt,
    });
  };

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () => sendJsonMessage({ type: 'subscribe', role: 'live' }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.data.symbol === 'BTCUSDT') {
        handleSetBtc(parsedData.data);
      }
      if (parsedData.data.symbol === 'ETHUSDT') {
        handleSetEth(parsedData.data);
      }
    },
  });

  return (
    <div className="relative z-15 rounded-[25px] bg-[#1A1B23] mx-auto p-3 mt-10 divide-y divide-black w-full">
      {btc && <Coin asset={btc} />}
      {eth && <Coin asset={eth} />}
    </div>
  );
};
export default CoinTable;
