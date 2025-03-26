import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../../api/ws';
import { useAppSelector } from '../../store/store';
import {
  getChartInterval,
  getChartSymbol,
} from '../../store/features/trading/chartSlice';

export const LightWeightChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const interval = useAppSelector(getChartInterval);
  const symbol = useAppSelector(getChartSymbol);
  const [chartData, setChartData] = useState<
    [number, [number, number, number, number]][]
  >([]);

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

    const reformatedArray = chartData.map(
      ([timestamp, [open, high, low, close]]) => ({
        time: timestamp,
        open,
        high,
        low,
        close,
      })
    );

    const sortedArray = reformatedArray.toSorted(
      (a, b) => a.timestamp - b.timestamp
    );

    const changeDateFormat = (
      arr: {
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
      }[]
    ) => {
      const arrBack = [];
      for (const a of arr) {
        const date = new Date(Number(a.time)).toISOString().split('T');
        const isoDate = date[0] + ' ' + date[1].slice(0, 5);
        const temp = {
          time: Date.parse(isoDate) / 1000,
          open: a.open,
          high: a.high,
          low: a.low,
          close: a.close,
        };
        arrBack.push(temp);
      }
      return arrBack;
    };

    const newdt = changeDateFormat(reformatedArray);

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
    const sorted1 = newdt.sort((a, b) => a.time - b.time);

    newSeries.setData(sorted1);

    return () => {
      chart.remove();
    };
  }, [chartData]);

  return (
    <div className='rounded-xl overflow-hidden'>
      <div ref={chartContainerRef}></div>
    </div>
  );
};
