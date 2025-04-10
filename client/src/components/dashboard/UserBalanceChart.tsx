import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  getOrdersHistory,
  selectOrdersHistory,
} from '../../store/features/orders/ordersSlice';
import { selectUser } from '../../store/features/user/authSlice'; // adjust if user selector is different
import HelperService from '../../services/HelperService';

const UserBalanceChart: React.FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector(selectOrdersHistory);
  const user = useSelector(selectUser); // get current logged-in user (assuming it has .balance)

  useEffect(() => {
    dispatch(getOrdersHistory({ page: 1 }));
  }, [dispatch]);

  // Calculate the balance over time
  const balanceData = useMemo(() => {
    if (!orders || !user) return [];
  
    // Sort orders DESC by date (most recent first)
    const sortedOrders = [...orders].sort((a, b) =>
      new Date(b.closed_date || b.open_date).getTime() -
      new Date(a.closed_date || a.open_date).getTime()
    );
  
    let balance = Number(user.balance); // Start from current balance
  
    const history: { date: string; balance: number }[] = [];
  
    sortedOrders.forEach((order) => {
      const price = Number(order.price);
      const amount = Number(order.amount);
      const fee = Number(order.fee);
      const total = price * amount;
  
      const date = (order.closed_date || order.open_date || '').split('T')[0];
  
      // Push current balance for this point in time
      history.push({
        date,
        balance: parseFloat(balance.toFixed(2)),
      });
  
      // Rewind balance: undo the transaction
      if (order.ord_direct === 'buy') {
        balance += total + fee; // user had more before the buy
      } else if (order.ord_direct === 'sell') {
        balance -= total - fee; // user had less before the sell
      }
    });
  
    // Reverse back to ascending time order
    return history.reverse();
  }, [orders, user]);  
  
  return (
    <div className="p-4">
      <div className="mb-2">
        <span className="text-[1.75rem] text-[#10B981] font-semibold">
          Current Balance: {HelperService.formatCurrency(user.balance)}
        </span>
        <h3 className="text-gray-200">Your balance over time</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={balanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserBalanceChart;
