import { AreaSeries, ColorType, createChart } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getAssetId,
  getHistoryInterval,
  setAssetId,
} from '../../store/features/trading/tradeOptionsSlice';
import AssetService from '../../services/AssetService';

interface IHistoryData {
  time: string;
  value: number;
}

export const UserOrdersPage = () => {
  const dispatch = useAppDispatch();
  const historyInterval = useAppSelector(getHistoryInterval);
  const assetId = useAppSelector(getAssetId);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState<IHistoryData[]>([]);

  const getHistory = useCallback(async () => {
    dispatch(setAssetId('bitcoin'));
    if (assetId.length > 1) {
      try {
        const response = await AssetService.getAssetHistory(
          assetId,
          historyInterval
        );

        const formattedData = response.map((item) => ({
          time: item.time, // Already Unix timestamp (seconds)
          value: parseFloat(item.priceUsd),
        }));

        setHistoryData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [historyInterval, assetId, dispatch]);

  useEffect(() => {
    getHistory();
    const interval = setInterval(getHistory, 30000);
    return () => clearInterval(interval);
  }, [getHistory]);

  useEffect(() => {
    if (!chartContainerRef.current || historyData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111827' },
        textColor: 'white',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: '#34D399',
      topColor: 'rgba(91, 33, 182, 0.4)',
      bottomColor: 'rgba(17, 24, 39, 0)',
    });

    newSeries.setData(historyData);

    return () => {
      chart.remove();
    };
  }, [historyData]);

  return (
    <main>
      <div className='rounded-xl overflow-hidden'>
        <div ref={chartContainerRef}></div>
      </div>
    </main>
  );
};
