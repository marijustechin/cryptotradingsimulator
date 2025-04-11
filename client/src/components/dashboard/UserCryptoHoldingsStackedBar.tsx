import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { IOrdersHistory } from '../../types/order';

const assetColors: Record<string, string> = {
  BTC: '#f7931a',
  ETH: '#818cf8',
  SOL: '#10B981',
  ETC: '#a8a8a8',
};

const VioletGlowCursor = ({ x, y, width, height }: any) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={4}
    fill="rgba(196, 181, 253, 0.2)"
    stroke="rgba(196, 181, 253, 0.4)"
    strokeWidth={1}
    style={{
      filter: 'drop-shadow(0 0 6px rgba(196, 181, 253, 0.4))',
      transition: 'all 0.2s ease',
    }}
  />
);

const UserCryptoHoldingsStackedBar = ({ orders }: { orders: IOrdersHistory[] }) => {


  const { chartData, assetKeys, totalQty } = useMemo(() => {
    if (!orders || orders.length === 0) return { chartData: [], assetKeys: [], totalQty: 0 };

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - 11 + i);
      return d.toLocaleString('en-US', { month: 'short' });
    });

    const grouped: Record<string, Record<string, number>> = {};
    const allAssets = new Set<string>();
    let totalQty = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.closed_date || order.open_date);
      if (orderDate < oneYearAgo) return;

      const month = orderDate.toLocaleString('en-US', { month: 'short' });
      const asset = order.assetId?.slice(0, 3).toUpperCase();
      const amount = parseFloat(Number(order.amount).toFixed(2) || '0');

      if (!month || !asset || isNaN(amount)) return;

      if (!grouped[month]) grouped[month] = {};
      if (!grouped[month][asset]) grouped[month][asset] = 0;

      grouped[month][asset] += amount;
      totalQty += amount;
      allAssets.add(asset);
    });

    const assetKeys = Array.from(allAssets);

    const chartData = months.map((month) => {
      const entry: any = { month };
      assetKeys.forEach((asset) => {
        entry[asset] = parseFloat((grouped[month]?.[asset] || 0).toFixed(2));
      });
      return entry;
    });

    return { chartData, assetKeys, totalQty };
  }, [orders]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="mb-2">
        <span className="text-[1.5rem] text-[#10B981] font-semibold">
          Total Crypto Bought (Qty): {totalQty.toFixed(2)}
        </span>
        <h3 className="text-gray-200">Crypto Holdings by Month</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#818cf8" />
          <YAxis stroke="#818cf8" />
          <Tooltip
            cursor={<VioletGlowCursor />}
            formatter={(val: unknown) => `${Number(val).toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#6b7280',
              color: '#10b981',
            }}
            labelStyle={{ color: 'white' }}
          />
          <Legend />
          {assetKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={assetColors[key] || '#8884d8'}
              name={`${key} Qty`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserCryptoHoldingsStackedBar;
