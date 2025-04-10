import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  getOrdersHistory,
  selectOrdersHistory,
} from '../../store/features/orders/ordersSlice';

type ViewRange = '1M' | '6M' | '1Y';
type OrderType = 'buy' | 'sell';

const assetColors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#818cf8',
  SOL: '#10B981',
  ETC: '#a8a8a8',
};

const UserOrdersByCryptoChart: React.FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector(selectOrdersHistory);
  const [viewRange, setViewRange] = useState<ViewRange>('1Y');
  const [orderType, setOrderType] = useState<OrderType>('buy');

  useEffect(() => {
    dispatch(getOrdersHistory({ page: 1 }));
  }, [dispatch]);

  const { chartData, totalVolume } = useMemo(() => {
    if (!orders || orders.length === 0) return { chartData: [], totalVolume: 0 };

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
      const price = parseFloat(order.price || '0');
      const amount = parseFloat(order.amount || '0');
      if (!dateStr || !asset || !price || !amount || isNaN(price) || isNaN(amount)) return;

      const total = price * amount;
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

    return { chartData, totalVolume };
  }, [orders, viewRange, orderType]);

  const assetKeys = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter((key) => key !== 'date');
  }, [chartData]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="text-[1.5rem] text-[#10B981] font-semibold">
            Total Volume: {HelperService.formatCurrency(totalVolume)}
          </span>
          <h3 className="text-gray-200 capitalize">{orderType} Order Volume by Crypto</h3>
        </div>
        <div className="flex space-x-2">
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
              {range}
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
              {type}
            </button>
          ))}
        </div>
      </div>

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
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#6b7280',
            }}
            labelStyle={{ color: 'white' }}
            formatter={(value: number) => HelperService.formatCurrency(value)}
          />
          <Legend />
          {assetKeys.map((asset) => (
            <Line
              key={asset}
              type="monotone"
              dataKey={asset}
              name={`${asset} Volume`}
              stroke={assetColors[asset] || '#8884d8'}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserOrdersByCryptoChart;
