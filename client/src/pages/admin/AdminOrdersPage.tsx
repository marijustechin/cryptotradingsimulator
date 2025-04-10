import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { Search } from '../../components/Search';

const dummyOrders = [
  { id: 1, user: 'john_doe', amount: 120, currency: 'BTC', status: 'Completed', type: 'Market', fee: 0 },
  { id: 2, user: 'alice', amount: 80, currency: 'ETH', status: 'Pending', type: 'Limit Order', fee: 0 },
  { id: 3, user: 'bob', amount: 200, currency: 'SOL', status: 'Cancelled', type: 'Market', fee: 0 },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(dummyOrders);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'user' | 'amount'>('user');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastOrderTimeString, setLastOrderTimeString] = useState('');
  const [totalPages] = useState(1); // Пагинация (заглушка)

  // Последний ордер
  const latestOrder = useMemo(() => {
    return [...orders].sort((a, b) => b.id - a.id)[0];
  }, [orders]);

  // Обновление строки времени "Last Order" каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      if (latestOrder) {
        setLastOrderTimeString(new Date(latestOrder.id).toLocaleString());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [latestOrder]);

  // Генерация новых заказов
  useEffect(() => {
    const interval = setInterval(() => {
      const orderAmount = Math.floor(Math.random() * 500);
      const orderType = ['Limit Order', 'Market'][Math.floor(Math.random() * 2)];
      const commissionRate = orderType === 'Limit Order' ? 0.015 : 0.045;
      const fee = (orderAmount * commissionRate) / 100;

      const newOrder = {
        id: Date.now(),
        user: `user_${Math.floor(Math.random() * 1000)}`,
        amount: orderAmount,
        currency: ['BTC', 'ETH', 'SOL'][Math.floor(Math.random() * 3)],
        status: ['Completed', 'Pending', 'Cancelled'][Math.floor(Math.random() * 3)],
        type: orderType,
        fee: fee.toFixed(2),
      };

      setOrders((prev) => [newOrder, ...prev.slice(0, 19)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSorting = (newField: 'user' | 'amount') => {
    setSortField(newField);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearch = (text: string) => setSearchText(text);

  const filteredOrders = useMemo(() => {
    const result = searchText
      ? orders.filter(
          (o) =>
            o.user.toLowerCase().includes(searchText.toLowerCase()) ||
            o.currency.toLowerCase().includes(searchText.toLowerCase())
        )
      : orders;

    return result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [orders, searchText, sortField, sortOrder]);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status === 'Pending').length;
    const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);
    const uniqueUsers = new Set(orders.map((o) => o.user)).size;

    const averageOrderSize = orders.length ? (totalAmount / orders.length).toFixed(2) : '0';
    const totalFees = orders.reduce((acc, o) => acc + parseFloat(o.fee), 0);
    const averageFee = orders.length ? (totalFees / orders.length).toFixed(2) : '0';

    const currencyFrequency = orders.reduce((acc: Record<string, number>, o) => {
      acc[o.currency] = (acc[o.currency] || 0) + 1;
      return acc;
    }, {});
    const mostActiveCurrency = Object.entries(currencyFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return {
      activeOrders,
      totalAmount,
      uniqueUsers,
      averageOrderSize,
      averageFee,
      mostActiveCurrency,
    };
  }, [orders]);

  return (
    <main>
      <h1 className="text-center">Platform Orders Summary </h1>
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Pending Orders</div>
          <div className="text-white text-2xl font-semibold">{stats.activeOrders}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Total Volume</div>
          <div className="text-white text-2xl font-semibold">${stats.totalAmount}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Unique Users</div>
          <div className="text-white text-2xl font-semibold">{stats.uniqueUsers}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Most Active Currency</div>
          <div className="text-white text-2xl font-semibold">{stats.mostActiveCurrency}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Avg. Order Size</div>
          <div className="text-white text-2xl font-semibold">${stats.averageOrderSize}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 shadow">
          <div className="text-gray-400 text-sm">Avg. Fee</div>
          <div className="text-white text-2xl font-semibold">${stats.averageFee}</div>
        </div>
        {latestOrder && (
          <div className="bg-gray-800 rounded-xl p-4 shadow col-span-1 sm:col-span-2">
            <div className="text-gray-400 text-sm">Last Order</div>
            <div className="text-white text-sm">{lastOrderTimeString}</div>
          </div>
        )}
      </div>

      {/* Заголовок под карточками */}
      <h2 className="text-2xl font-semibold text-white mt-4">Last Operations</h2>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <Search placeholderText="Search by User or Currency" onSearch={handleSearch} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSorting('user')}>
                <div className="flex gap-1 items-center">
                  <span>User</span>
                  <span className="ml-2 text-violet-300">
                    {sortField === 'user' && (sortOrder === 'asc' ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />)}
                  </span>
                </div>
              </th>
              <th className="cursor-pointer" onClick={() => handleSorting('amount')}>
                <div className="flex gap-1 items-center">
                  <span>Amount</span>
                  <span className="ml-2 text-violet-300">
                    {sortField === 'amount' && (sortOrder === 'asc' ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />)}
                  </span>
                </div>
              </th>
              <th>Currency</th>
              <th>Status</th>
              <th>Type</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td>{order.user}</td>
                <td>${order.amount}</td>
                <td>{order.currency}</td>
                <td>{order.status}</td>
                <td>{order.type}</td>
                <td>${order.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination onChange={handlePageChange} totalPages={totalPages} currentPage={currentPage} />
    </main>
  );
}
