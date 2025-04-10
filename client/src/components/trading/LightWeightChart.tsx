import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';
import { useAppSelector } from '../../store/store';
import {
  getChartInterval,
  getChartSymbol,
} from '../../store/features/trading/chartSlice';

interface IFormatResponse {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const LightWeightChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const interval = useAppSelector(getChartInterval);
  const symbol = useAppSelector(getChartSymbol);
  const [chartData, setChartData] = useState<IFormatResponse[]>([]);

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
    onOpen: () =>
      sendJsonMessage({
        type: 'history',
        symbol: symbol,
        interval: interval,
      }),
    onMessage: (event: WebSocketEventMap['message']) => {
      const parsedData = JSON.parse(event.data);
      setChartData(parsedData.data);
    },
  });

  useEffect(() => {
    sendJsonMessage({ type: 'history', symbol: symbol, interval: interval });
  }, [interval, sendJsonMessage, symbol]);

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

    newSeries.setData(chartData);

    return () => {
      chart.remove();
    };
  }, [chartData]);

  return (
    <div className="rounded-xl overflow-hidden w-auto h-auto">
      <div className="w-full h-full items-center" ref={chartContainerRef}></div>
    </div>
  );
};
