import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface MonthlyOrdersChartProps {
  rawData: {
    assetId: string;
    total: number;
    monthly: { [month: string]: number };
  }[];
}

const assetColors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#818cf8',
  SOL: '#10B981',
};

const assetSymbols: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
};

const transformOrdersByCrypto = (rawData: MonthlyOrdersChartProps['rawData']) => {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(new Date().getFullYear(), new Date().getMonth() - 11 + i, 1)
      .toLocaleString('en-US', { month: 'short' })
  );

  return months.map((month) => {
    const row: any = { month };
    rawData.forEach((asset) => {
      const shortId = asset.assetId.slice(0, 3);
      row[shortId] = asset.monthly[month] ?? 0;
    });
    return row;
  });
};

const MonthlyOrdersChart = ({ rawData }: MonthlyOrdersChartProps) => {
  const { t } = useTranslation();

  if (!rawData?.length) return null;

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(new Date().getFullYear(), new Date().getMonth() - 11 + i, 1)
      .toLocaleString('en-US', { month: 'short' })
  );

  const totalOrders = rawData.reduce((sum, asset) => {
    const assetTotal = months.reduce((mSum, month) => {
      return mSum + (asset.monthly[month] ?? 0);
    }, 0);
    return sum + assetTotal;
  }, 0);

  const data = transformOrdersByCrypto(rawData);
  const assetKeys = rawData.map((a) => a.assetId.slice(0, 3));

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="mb-2">
        <span className="text-[1.75rem] text-[#10B981] font-semibold">
          {t('admin_chart_total_orders_last_12_months')}: {totalOrders}
        </span>
        <h3 className="text-gray-200">{t('admin_chart_yearly_orders_by_month')}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#818cf8" />
          <YAxis stroke="#818cf8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#6b7280',
              color: '#10b981',
            }}
            labelStyle={{ color: 'white' }}
          />
          <Legend
            formatter={(value) => `${assetSymbols[value] ?? ''} ${value}`}
          />
          {assetKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={assetColors[key] || '#8884d8'}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyOrdersChart;