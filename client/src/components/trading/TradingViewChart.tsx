import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectInstrument } from './SelectInstrument';
import { useAppSelector } from '../../store/store';
import {
  getChartInterval,
  getInstrument,
} from '../../store/features/trading/tradingOptionsSlice';
import AssetService from '../../services/AssetService';
import { TradingOptions } from './TradingOptions';
import { SelectInterval } from './IntervalSelector';
import { PlaceOrderButton } from './PlaceOrderButton';

interface IHistoryData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface IInfo {
  last_trade_price: number;
}

export const TradingViewChart = () => {
  const instrument = useAppSelector(getInstrument);
  const chartInterval = useAppSelector(getChartInterval);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState<IHistoryData[]>([]);
  const [info, setInfo] = useState<IInfo>();

  const getHistory = useCallback(async () => {
    try {
      const candles = await AssetService.getCandles(chartInterval, instrument);
      // last_trade_price
      const formatedCandles = candles.map((item) => ({
        time: item.TIMESTAMP,
        open: item.OPEN,
        high: item.HIGH,
        low: item.LOW,
        close: item.CLOSE,
      }));

      setHistoryData(formatedCandles);

      setInfo({
        ...info,
        last_trade_price: candles[candles.length - 1].LAST_TRADE_PRICE,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [instrument, chartInterval, info]);

  useEffect(() => {
    getHistory();
    const interval = setInterval(getHistory, 50000);
    return () => clearInterval(interval);
  }, [getHistory]);

  useEffect(() => {
    if (!chartContainerRef.current || historyData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111827' },
        textColor: '#A78BFA',
      },
      grid: {
        vertLines: { color: '#4C1D95' }, // Dark vertical grid lines
        horzLines: { color: '#4C1D95' }, // Dark horizontal grid lines
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

    newSeries.setData(historyData);

    return () => {
      chart.remove();
    };
  }, [historyData]);

  return (
    <main className="flex flex-col gap-3">
      <TradingOptions />
      <div className="flex gap-3 items-center justify-around">
        <SelectInstrument />
        <SelectInterval />
        <div>{info && <div>{info.last_trade_price}</div>}</div>
      </div>

      <div className="rounded-xl overflow-hidden">
        <div ref={chartContainerRef}></div>
      </div>
      <PlaceOrderButton />
    </main>
  );
};
