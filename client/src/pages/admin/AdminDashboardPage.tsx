import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DashboardCardUsers } from '../../components/admin/DashboardCardUsers';
import { Card } from '../../components/admin/AdminCard';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getGeneralInfo,
  selectAdminOrderInfo,
  selectAdminUserInfo,
} from '../../store/features/admin/adminSlice';
import { useEffect } from 'react';
import HelperService from '../../services/HelperService';
import { TotalIncome } from '../../components/admin/TotalIncome';
import { TopMonthlyUsersCard } from '../../components/admin/TopMonthlyUsersCard';


const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectAdminUserInfo);
  const orderInfo = useAppSelector(selectAdminOrderInfo);

  useEffect(() => {
    if (!userInfo || !orderInfo) {
      dispatch(getGeneralInfo());
    }
  }, [dispatch, userInfo, orderInfo]);

  const ordersByCryptoData = orderInfo?.ordersByCrypto;
  const monthlyIncome = orderInfo?.monthlyIncome;
  const monthlyOrdersValue  = orderInfo?.monthlyOrdersValue;
  const yearlyIncomeByMonth = orderInfo?.yearlyIncomeByMonth ?? [];
  const topUsers = userInfo?.topUsers ?? [];
  




  const totalOrders = ordersByCryptoData?.reduce((acc, item) => {
    return acc + Number(item.count);
  }, 0);

  return (
    <main className='flex-1 p-6 bg-gray-800 md:bg-transparent'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 mb-6 place-items-center'>
        <DashboardCardUsers />
        <div className='w-full space-y-2'>
          <Card title='Monthly Turnover' value={monthlyOrdersValue && HelperService.formatCurrency(monthlyOrdersValue)} />
          <Card title='Monthly Income' value={monthlyIncome && HelperService.formatCurrency(monthlyIncome)} />

        </div>
      </div>
      <TotalIncome yearlyIncomeByMonth={yearlyIncomeByMonth} />

      <TopMonthlyUsersCard users={topUsers} />


      {/* user activity */}
      <div className='bg-gray-700 p-6 rounded-xl shadow-md mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
          Total orders <span className='text-emerald-500'>{totalOrders}</span>
        </h2>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={ordersByCryptoData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='assetId' stroke='#8884d8' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='count' stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* last operations */}
      <div className='bg-gray-700 p-6 rounded-xl shadow-md'>
        <h2 className='text-xl font-semibold text-gray-200 mb-4'>
          Last operations
        </h2>
        <table className='w-full text-left'>
          <thead>
            <tr className='border-b border-gray-700'>
              <th className='py-2'>Type</th>
              <th className='py-2'>Amount</th>
              <th className='py-2'>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <td className='py-2'>Buy BTC</td>
              <td className='py-2'>$10,000</td>
              <td className='py-2'>12.10.2023</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className='py-2'>Sell ETH</td>
              <td className='py-2'>$5,000</td>
              <td className='py-2'>11.10.2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
