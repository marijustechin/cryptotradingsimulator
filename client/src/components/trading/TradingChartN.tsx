import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { WS_URL } from '../../api/ws';

export const TradingChartN = () => {
  const [chartData, setChartData] = useState<
    [number, [number, number, number, number]][]
  >([]);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () =>
      sendJsonMessage({
        type: 'history',
        symbol: 'BTCUSDT',
        interval: '15',
      }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      setChartData(parsedData.data);
    },
  });

  const chartDataSeries = [
    {
      name: 'BTCUSDT',
      data: chartData.map(([timestamp, ohlc]) => ({
        x: timestamp,
        y: ohlc,
      })),
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 600,
    },
    title: {
      text: 'Pavadinimas',
      align: 'center',
    },
  };

  return (
    <div id='chart'>
      {chartData.length > 0 && (
        <Chart
          options={chartOptions}
          series={chartDataSeries}
          type='candlestick'
          height={300}
        />
      )}
    </div>
  );
};
