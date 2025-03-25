import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';

export const LightWeightChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<
    [number, [number, number, number, number]][]
  >([]);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () =>
      sendJsonMessage({
        type: 'history',
        symbol: 'ETHUSDT',
        interval: '60',
      }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      setChartData(parsedData.data);
    },
  });

  // Draw chart on data load /////////////////////////////////////////
  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111827' },
        textColor: '#A78BFA',
      },
      grid: {
        vertLines: { color: '#4C1D95' },
        horzLines: { color: '#4C1D95' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#F43F5E',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#F43F5E',
    });

    const formattedCandles = chartData.map(
      ([timestamp, [open, high, low, close]]) => ({
        time: Math.floor(Number(timestamp) / 1000),
        open,
        high,
        low,
        close,
      })
    );

    const sorted = formattedCandles.sort((a, b) => a.time - b.time);

    newSeries.setData(sorted);

    return () => {
      chart.remove();
    };
  }, [chartData]);

  return (
    <div className="rounded-xl overflow-hidden">
      <div ref={chartContainerRef}></div>
    </div>
  );
};
