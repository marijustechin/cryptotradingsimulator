import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getAssetId,
  getHistoryInterval,
  setAssetId,
} from '../../store/features/trading/tradeOptionsSlice';
import AssetService from '../../services/AssetService';
import { SelectInstrument } from '../../components/trading/SelectInstrument';
import { getInstrument } from '../../store/features/trading/tradingOptionsSlice';
import { IInstrument } from '../../types/crypto';

interface IHistoryData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const UserOrdersPage = () => {
  const dispatch = useAppDispatch();
  const instrument = useAppSelector(getInstrument);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState<IHistoryData[]>([]);

  const getHistory = useCallback(async () => {
    try {
      const candles = await AssetService.getCandles('hours', instrument);
      const formatedCandles = candles.map((item) => ({
        time: item.TIMESTAMP,
        open: item.OPEN,
        high: item.HIGH,
        low: item.LOW,
        close: item.CLOSE,
      }));

      setHistoryData(formatedCandles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [instrument]);

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
      height: 500,
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
    <main>
      <div className='flex gap-3'>
        <SelectInstrument />
      </div>
      <div>{}</div>
      <div className='rounded-xl overflow-hidden'>
        <div ref={chartContainerRef}></div>
      </div>
    </main>
  );
};
