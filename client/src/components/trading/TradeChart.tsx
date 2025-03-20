import { useCallback, useEffect, useState } from 'react';
import {
  getAssetId,
  getHistoryInterval,
} from '../../store/features/trading/tradeOptionsSlice';
import { useAppSelector } from '../../store/store';
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
import { IntervalButtons } from './IntervalButtons';

export const TradeChart = () => {
  const historyInterval = useAppSelector(getHistoryInterval);
  const assetId = useAppSelector(getAssetId);
  const [historyData, setHistoryData] = useState<TAssetHistory[]>([]);
  //const [highest, setHighest] = useState();

  const getHistory = useCallback(async () => {
    if (assetId.length > 1) {
      try {
        const response = await AssetService.getAssetHistory(
          assetId,
          historyInterval
        );

        // const formattedData = response.map((item) => ({
        //   priceUsd: parseFloat(item.priceUsd).toFixed(2),
        //   date: item.date.split('T')[1].slice(0, 5),
        //   circulatingSupply: item.circulatingSupply,
        //   time: item.time,
        // }));

        setHistoryData(response);
        // const hiprice = Math.max(
        //   ...response.map((item) => Number(item.priceUsd))
        // );
        // console.log(hiprice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [historyInterval, assetId]);

  useEffect(() => {
    getHistory();
    const interval = setInterval(getHistory, 30000);
    return () => clearInterval(interval);
  }, [getHistory]);

  return (
    <div className='flex flex-col gap-4'>
      <IntervalButtons />
      <div>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={historyData}>
            <XAxis dataKey='date' tick={{ fill: '#fff', fontSize: 7 }} />
            <YAxis
              tick={{ fill: '#fff', fontSize: 7 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
            />
            <Line
              type='monotone'
              dataKey={'priceUsd'}
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
