import {
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
import { StackedBarChartCard } from '../../components/admin/StackedBarChartCard';
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

  // const ordersByCryptoData = orderInfo?.ordersByCrypto;
  const monthlyIncome = orderInfo?.monthlyIncome;
  const incomeByOrderType = orderInfo?.income;
  const monthlyOrdersValue  = orderInfo?.monthlyOrdersValue;
  const yearlyIncomeByMonth = orderInfo?.yearlyIncomeByMonth ?? [];
  const topUsers = userInfo?.topUsers ?? [];
  const Income = incomeByOrderType?.reduce((acc, item) => {
    return acc + Number(item.total_fee);
  }, 0);
  const yearlyOrdersValue = orderInfo?.yearlyOrdersValueByMonth ?? [];
  const totalOrderValue = orderInfo?.yearlyOrdersValueTotal;

  // const totalOrders = ordersByCryptoData?.reduce((acc, item) => {
  //   return acc + Number(item.count);
  // }, 0);
  return (
    <main className='flex-1 bg-gray-800 md:bg-transparent'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 mb-6 place-items-center'>
        <DashboardCardUsers />
        <div className='w-full space-y-2'>
          <Card title='Monthly Turnover' value={monthlyOrdersValue && HelperService.formatCurrency(monthlyOrdersValue)} />
          <Card title='Monthly Income' value={monthlyIncome && HelperService.formatCurrency(monthlyIncome)} />

        </div>
      </div>
      <StackedBarChartCard
  title="Yearly Income by Month"
  total={Income}
  data={yearlyIncomeByMonth}
  keys={['limit', 'market']}
  colors={['#10B981', '#818cf8']}
/>
      <TopMonthlyUsersCard users={topUsers} />
      <StackedBarChartCard
  title="Yearly Order Value by Month"
  total={totalOrderValue}
  data={yearlyOrdersValue}
  keys={['limit', 'market']}
  colors={['#10B981', '#818cf8']}
/>
    

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
              <th className='py-2'>Type</th>
              <th className='py-2'>Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <td className='py-2'>Buy BTC</td>
              <td className='py-2'>$10,000</td>
              <td className='py-2'>12.10.2023</td>
              <td className='py-2'>Market</td>
              <td className='py-2'>1$</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className='py-2'>Sell ETH</td>
              <td className='py-2'>$5,000</td>
              <td className='py-2'>11.10.2023</td>
              <td className='py-2'>Limit order</td>
              <td className='py-2'>0.5$</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
