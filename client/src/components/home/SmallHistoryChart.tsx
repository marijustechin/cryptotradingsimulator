import { useEffect, useState } from 'react';
import { IAssetHistory } from '../../types/crypto';
import AssetService from '../../services/AssetService';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface TestChartProps {
  limit: number;
  asset_id: string;
}

export const TestChart = ({ asset_id, limit }: TestChartProps) => {
  const [history, setHistory] = useState<IAssetHistory[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const assetHistory = await AssetService.getAssetsHistory(
          asset_id,
          limit
        );
        setHistory(assetHistory);
      } catch (error) {
        console.error('Failed to fetch asset history:', error);
      }
    };

    getHistory();
  }, [asset_id, limit]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={history}>
        <Line
          dot={false}
          type="monotone"
          dataKey="priceUsd"
          stroke="#7C3AED"
          strokeWidth={1}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
