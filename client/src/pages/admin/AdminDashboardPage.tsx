
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
import { StackedBarChartCard } from '../../components/StackedBarChartCard';
import { TopMonthlyUsersCard } from '../../components/admin/TopMonthlyUsersCard';
import MonthlyOrdersChart from '../../components/admin/MonthlyOrdersChart';

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectAdminUserInfo);
  const orderInfo = useAppSelector(selectAdminOrderInfo);

  useEffect(() => {
    dispatch(getGeneralInfo());
  }, [dispatch]);


  const ordersByCryptoData = orderInfo?.ordersByCrypto;
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


  return (
    <main className='flex-1 bg-gray-800 md:bg-transparent'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 mb-6 place-items-center'>
        <DashboardCardUsers />
        <div className='w-full space-y-2'>
          <Card title='Monthly Turnover' value={monthlyOrdersValue && HelperService.formatCurrency(monthlyOrdersValue)} />
          <Card title='Monthly Income' value={monthlyIncome && HelperService.formatCurrency(monthlyIncome)} />

        </div>
      </div>
      <TopMonthlyUsersCard users={topUsers} />
      <StackedBarChartCard
  title="Yearly Income by Month"
  total={HelperService.formatCurrency(Income ?? 0)}
  data={yearlyIncomeByMonth}
  keys={['limit', 'market']}
  colors={['#10B981', '#818cf8']}
/>

<StackedBarChartCard
  title="Yearly Order Value by Month"
  total={HelperService.formatCurrency(totalOrderValue ?? 0)}
  data={yearlyOrdersValue}
  keys={['limit', 'market']}
  colors={['#10B981', '#818cf8']}
/>

<MonthlyOrdersChart rawData={ordersByCryptoData ?? []} />
  
    </main>
  );
};

export default AdminDashboardPage;
