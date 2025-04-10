import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getOrdersHistory,
  selectOrdersHistory,
} from "../../store/features/orders/ordersSlice";
import { selectUser } from "../../store/features/user/authSlice";
import HelperService from "../../services/HelperService";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-[#10B981] text-white p-3 rounded-lg shadow-lg">
        <p className="text-sm text-[#10B981] font-semibold">{label}</p>
        <p className="text-sm">
          Balance: {HelperService.formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const UserBalanceChart: React.FC = () => {
  const dispatch = useDispatch();
  const { data: orders } = useSelector(selectOrdersHistory);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getOrdersHistory({ page: 1 }));
  }, [dispatch]);

  const balanceData = useMemo(() => {
    if (!orders || !user) return [];

    const sortedOrders = [...orders].sort(
      (a, b) =>
        new Date(b.closed_date || b.open_date).getTime() -
        new Date(a.closed_date || a.open_date).getTime()
    );

    let balance = Number(user.balance);
    const history: { date: string; balance: number }[] = [];

    sortedOrders.forEach((order) => {
      const price = Number(order.price);
      const amount = Number(order.amount);
      const fee = Number(order.fee);
      const total = price * amount;

      const date = (order.closed_date || order.open_date || "").split("T")[0];

      history.push({
        date,
        balance: parseFloat(balance.toFixed(2)),
      });

      if (order.ord_direct === "buy") {
        balance += total + fee;
      } else if (order.ord_direct === "sell") {
        balance -= total - fee;
      }
    });

    return history.reverse();
  }, [orders, user]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          💰 Balance Overview
        </h2>
        <p className="text-md text-gray-400">
          Current Balance:{" "}
          <span className="text-[#10B981] font-medium">
            {HelperService.formatCurrency(user.balance)}
          </span>
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart
          data={balanceData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#2d3748"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#cbd5e1" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 2, fill: "#10B981", stroke: "#1f2937" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserBalanceChart;
