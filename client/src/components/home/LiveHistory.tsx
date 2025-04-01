import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  allActiveSymbols,
  getAllSymbols,
} from '../../store/features/trading/chartSlice';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface ILiveHistory {
  data: {
    price: number;
  }[];
  currency: string;
}

interface IParsedData {
  data: {
    time: string;
    close: number;
    high: number;
    low: number;
    open: number;
  }[];
  symbol: string;
  type: string;
}

export const LiveHistory = () => {
  const dispatch = useAppDispatch();
  const allSymbols = useAppSelector(allActiveSymbols);
  const [liveHistory, setLiveHistory] = useState<ILiveHistory[]>([]);

  useEffect(() => {
    if (!allSymbols) {
      dispatch(getAllSymbols());
    }
  }, [dispatch, allSymbols]);

  // gaunam istorija ////////////////////////////////
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () =>
      allSymbols?.map((symbol) => {
        sendJsonMessage({
          type: 'history',
          symbol: symbol.id,
          interval: '15',
        });
      }),

    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData: IParsedData = JSON.parse(event.data);
      const prices = parsedData.data.map((item) => ({
        price: item.close,
      }));

      setLiveHistory((prev) => {
        if (prev.find((d) => d.currency === parsedData.symbol)) {
          return prev;
        }
        return [...prev, { currency: parsedData.symbol, data: prices }];
      });
    },
  });
  // istorijios pabaiga /////////////////////////////

  return (
    <div>
      {liveHistory.map((item) => (
        <div key={item.currency}>
          <ResponsiveContainer width='100%' height={100}>
            <LineChart data={item.data}>
              <defs>
                <linearGradient id='purpleToBlue' x1='0' y1='0' x2='1' y2='0'>
                  <stop offset='0%' stopColor='#6D28D9' /> {/* Purple */}
                  <stop offset='100%' stopColor='#3B82F6' /> {/* Blue */}
                </linearGradient>
              </defs>
              <Line
                dot={false}
                type='monotone'
                dataKey='price'
                stroke='url(#purpleToBlue)'
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};
