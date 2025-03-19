import { useCallback, useEffect, useState } from 'react';
import {
  getAssetId,
  getHistoryInterval,
  setAssetId,
  setHistoryInterval,
} from '../../store/features/trading/tradeOptionsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import AssetService from '../../services/AssetService';
import { TAssetHistory } from '../../types/crypto';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const TradeChartTest = () => {
  const dispatch = useAppDispatch();
  const historyInterval = useAppSelector(getHistoryInterval);
  const assetId = useAppSelector(getAssetId);
  const [historyData, setHistoryData] = useState<TAssetHistory[]>([]);

  dispatch(setAssetId('bitcoin'));

  const getHistory = useCallback(async () => {
    try {
      const response = await AssetService.getAssetHistory(
        assetId,
        historyInterval
      );
      setHistoryData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [historyInterval, assetId]);

  useEffect(() => {
    getHistory();
    const interval = setInterval(getHistory, 30000);
    return () => clearInterval(interval);
  }, [getHistory]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-2'>
        <button
          onClick={() => dispatch(setHistoryInterval('m1'))}
          className={`${
            historyInterval === 'm1'
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          m1
        </button>
        <button
          onClick={() => dispatch(setHistoryInterval('m5'))}
          className={`${
            historyInterval === 'm5'
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          m5
        </button>
        <button
          onClick={() => dispatch(setHistoryInterval('m15'))}
          className={`${
            historyInterval === 'm15'
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          m15
        </button>
        <button
          onClick={() => dispatch(setHistoryInterval('m30'))}
          className={`${
            historyInterval === 'm30'
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          m30
        </button>
        <button
          onClick={() => dispatch(setHistoryInterval('h1'))}
          className={`${
            historyInterval === 'h1'
              ? 'border-violet-500 bg-violet-500'
              : 'border-violet-700'
          } cursor-pointer px-2 py-1 border rounded-lg`}
        >
          h1
        </button>
      </div>
      <div>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={historyData}>
            <XAxis dataKey='time' tick={{ fill: '#fff', fontSize: 7 }} />
            <YAxis
              tick={{ fill: '#fff', fontSize: 7 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
            />
            <Line
              type='monotone'
              dataKey='priceUsd'
              stroke='#319c06'
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
