import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getChartCandles,
  getChartInterval,
  setCandles,
} from '../../store/features/trading/chartSlice';
import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import { io } from 'socket.io-client';
import { ICandle } from '../../types/chart';

export const ChartCandles = () => {
  const dispatch = useAppDispatch();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candles = useAppSelector(getChartCandles);
  const interval = useAppSelector(getChartInterval);

  const socket = io('http://78.31.185.132:61630');

  // live data /////////////////////////////////////////////////
  useEffect(() => {
    socket.emit('joinLive');

    const handleLiveCandle = (candle: ICandle) => {
      // dispatch(addLiveCandle(candle)); // You’ll write this reducer
      console.log(candle);
    };

    socket.on('candleUpdate', handleLiveCandle);

    return () => {
      socket.off('candleUpdate', handleLiveCandle);
    };
  }, [dispatch, socket]);

  // live data end ///////////////////////////////////////////

  // Request chart data when interval changes //////////////////////////
  useEffect(() => {
    socket.emit('joinRoom', `history-${interval}`);
    socket.emit('getHistory', 'BTCUSDT', `${interval}m`);

    const listener = (data: ICandle[]) => {
      dispatch(
        setCandles({
          symbol: 'BTCUSDT',
          interval,
          candles: data,
        })
      );
    };

    socket.on('historyData', listener);
    return () => {
      socket.off('historyData', listener);
    };
  }, [interval, dispatch, socket]);

  // Draw chart on data load /////////////////////////////////////////
  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

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

    const seen = new Set<number>();

    const formattedCandles = candles
      .filter((item) => {
        if (seen.has(item.start)) return false;
        seen.add(item.start);
        return true;
      })
      .toSorted((a, b) => a.start - b.start)
      .map((item) => ({
        time: Math.floor(item.start / 1000), // UNIX timestamp in seconds
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

    newSeries.setData(formattedCandles);

    return () => {
      chart.remove();
    };
  }, [candles, interval]);

  return (
    <div className='rounded-xl overflow-hidden'>
      <div ref={chartContainerRef}></div>
    </div>
  );
};
