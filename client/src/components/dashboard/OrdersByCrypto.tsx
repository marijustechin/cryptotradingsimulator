import { useMemo, useState } from 'react';
import HelperService from '../../services/HelperService';
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
import { IOrdersHistory } from '../../types/order';
import { Link } from 'react-router';
import { Player } from '@lottiefiles/react-lottie-player';
import { useTranslation } from 'react-i18next';

type ViewRange = '1M' | '6M' | '1Y';
type OrderType = 'buy' | 'sell';

const assetColors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#818cf8',
  SOL: '#10B981',
  ETC: '#a8a8a8',
};

const UserOrdersByCryptoChart = ({ orders }: { orders: IOrdersHistory[] }) => {
  const [viewRange, setViewRange] = useState<ViewRange>('1Y');
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const { t } = useTranslation();

  const { chartData, totalVolume, uniqueAssets } = useMemo(() => {
    if (!orders || orders.length === 0) return { chartData: [], totalVolume: 0, uniqueAssets: [] };

    const now = new Date();
    const startDate = new Date();
    if (viewRange === '1M') startDate.setMonth(now.getMonth() - 1);
    else if (viewRange === '6M') startDate.setMonth(now.getMonth() - 6);
    else startDate.setFullYear(now.getFullYear() - 1);

    const filtered = orders.filter((order) => {
      const date = new Date(order.closed_date || order.open_date);
      return date >= startDate && order.ord_direct === orderType;
    });

    const uniqueAssets = Array.from(
      new Set(filtered.map((order) => order.assetId?.slice(0, 3).toUpperCase()))
    );

    const grouped: Record<string, Record<string, number>> = {};
    let totalVolume = 0;

    filtered.forEach((order) => {
      const dateStr = (order.closed_date || order.open_date)?.split('T')[0];
      const asset = order.assetId?.slice(0, 3).toUpperCase();
      const price = parseFloat(Number(order.price).toFixed(2));
      const amount = parseFloat(Number(order.amount).toFixed(2));
      const fee = parseFloat(Number(order.fee).toFixed(2));
      if (!dateStr || !asset || isNaN(price) || isNaN(amount)) return;

      const total = price * amount + fee;
      totalVolume += total;

      if (!grouped[dateStr]) grouped[dateStr] = {};
      if (!grouped[dateStr][asset]) grouped[dateStr][asset] = 0;
      grouped[dateStr][asset] += total;
    });

    const sortedDates = Object.keys(grouped).sort();
    const chartData = sortedDates.map((date) => {
      const row: any = { date };
      uniqueAssets.forEach((asset) => {
        row[asset] = grouped[date][asset] ?? 0;
      });
      return row;
    });

    return { chartData, totalVolume, uniqueAssets };
  }, [orders, viewRange, orderType]);

  const assetKeys = useMemo(() => {
    if (!chartData.length) return [];
    const all = Object.keys(chartData[0]).filter((key) => key !== 'date');
    return selectedAsset === 'all' ? all : [selectedAsset];
  }, [chartData, selectedAsset]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="text-[1.5rem] text-[#10B981] font-semibold">
            {t('ordersByCrypto.totalVolume')}: {HelperService.formatCurrency(totalVolume)}
          </span>
          <h3 className="text-gray-200 capitalize">
            {t(`ordersByCrypto.${orderType}`)} {t('ordersByCrypto.volumeByCrypto')}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(['1M', '6M', '1Y'] as ViewRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setViewRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                viewRange === range
                  ? 'bg-[#818cf8] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t(`ordersByCrypto.range.${range}`)}
            </button>
          ))}
          {(['buy', 'sell'] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${
                orderType === type
                  ? 'bg-[#10B981] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t(`ordersByCrypto.${type}`)}
            </button>
          ))}
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm"
          >
            <option value="all">{t('ordersByCrypto.all')}</option>
            {uniqueAssets.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!chartData.length ? (
        <div className="grid grid-cols-2 justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center">
            <h3 className="pb-10">{t('ordersByCrypto.nothingToShow')}</h3>
            <Link to="/my-dashboard/trading" className="btn-generic my-6">
              {t('ordersByCrypto.goToTrading')}
            </Link>
          </div>
          <Player autoplay loop src="/Animation.json" style={{ height: '300px', width: '100%' }} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#818cf8"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis stroke="#818cf8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#6b7280' }}
              labelStyle={{ color: 'white' }}
              formatter={(value: number) => HelperService.formatCurrency(value)}
            />
            <Legend />
            {assetKeys.map((asset) => (
              <Line
                key={asset}
                type="monotone"
                dataKey={asset}
                name={`${asset} ${t('ordersByCrypto.volume')}`}
                stroke={assetColors[asset] || '#8884d8'}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserOrdersByCryptoChart;
