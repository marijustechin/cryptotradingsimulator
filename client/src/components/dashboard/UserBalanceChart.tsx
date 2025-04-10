import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  getOrdersHistory,
  selectOrdersHistory,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice';
import HelperService from '../../services/HelperService';

type ViewRange = '1M' | '6M' | '1Y';

const UserBalanceChart: React.FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector(selectOrdersHistory);
  const user = useSelector(selectUser);

  const [viewRange, setViewRange] = useState<ViewRange>('1Y');

  useEffect(() => {
    dispatch(getOrdersHistory({ page: 1 }));
  }, [dispatch]);

  const balanceData = useMemo(() => {
    if (!orders || !user) return [];

    const now = new Date();
    const startDate = new Date();

    if (viewRange === '1M') startDate.setMonth(now.getMonth() - 1);
    else if (viewRange === '6M') startDate.setMonth(now.getMonth() - 6);
    else startDate.setFullYear(now.getFullYear() - 1);

    const filteredOrders = orders.filter((order) => {
      const date = new Date(order.closed_date || order.open_date);
      return date >= startDate;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) =>
      new Date(b.closed_date || b.open_date).getTime() -
      new Date(a.closed_date || a.open_date).getTime()
    );

    let balance = Number(user.balance);
    const reversedHistory: { date: string; balance: number }[] = [];

    for (const order of sortedOrders) {
      const date = (order.closed_date || order.open_date)?.split('T')[0];
      const price = parseFloat(order.price);
      const amount = parseFloat(order.amount);
      const fee = parseFloat(order.fee);
      const total = price * amount;

      reversedHistory.push({ date, balance: parseFloat(balance.toFixed(2)) });

      if (order.ord_direct === 'buy') {
        balance += total + fee;
      } else if (order.ord_direct === 'sell') {
        balance -= total - fee;
      }
    }

    reversedHistory.push({
      date: startDate.toISOString().split('T')[0],
      balance: parseFloat(balance.toFixed(2)),
    });

    return reversedHistory.reverse();
  }, [orders, user, viewRange]);

  if (!user || !balanceData.length) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="text-[1.75rem] text-[#10B981] font-semibold">
            Current Balance: {HelperService.formatCurrency(user.balance)}
          </span>
          <h3 className="text-gray-200">Your balance over time</h3>
        </div>
        <div className="space-x-2">
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
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={balanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
              color: '#10b981',
            }}
            labelStyle={{ color: 'white' }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserBalanceChart;
