import useWebSocket from 'react-use-websocket';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { WS_URL } from '../../api/ws';
import { useState } from 'react';

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

interface TestChartProps {
  assetId: string;
}

interface IChartData {
  data: {
    price: number;
  }[];
}

export const HomeLiveChart = ({ assetId }: TestChartProps) => {
  const [chartData, setChartData] = useState<IChartData>();

  // gaunam istorija ////////////////////////////////
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () =>
      sendJsonMessage({
        type: 'history',
        symbol: assetId,
        interval: '15',
      }),

    onMessage: (event: WebSocketEventMap['message']) => {
      const eventData: IParsedData = JSON.parse(event.data);
      const prices = eventData.data.map((item) => ({
        price: item.close,
      }));

      setChartData({ data: prices });
    },
  });
  // istorijios pabaiga /////////////////////////////

  if (chartData) {
    return (
      <ResponsiveContainer width='100%' height={100}>
        <LineChart data={chartData.data}>
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
    );
  } else {
    return <div>No data to display</div>;
  }
};
