import { useEffect, useState } from 'react';
import {
  getGeneralInfo,
  selectAdminUserInfo,
} from '../../store/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

export const DashboardCardUsers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const usersInfo = useAppSelector(selectAdminUserInfo);

  const [outerRadius, setOuterRadius] = useState(90);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 766) setOuterRadius(80);
      else if (width < 1000) setOuterRadius(60);
      else setOuterRadius(90);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!usersInfo) {
      dispatch(getGeneralInfo());
    }
  }, [dispatch, usersInfo]);

  const data = [
    { name: t('admin_card_active_users'), value: usersInfo?.activeUsers },
    {
      name: t('admin_card_inactive_users'),
      value: usersInfo?.userCount - usersInfo?.activeUsers,
    },
  ];

  const COLORS = ['#4ade80', '#818cf8'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className='bg-gray-800 p-4 rounded-xl shadow-lg backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full'>
      <div className='flex flex-col justify-center gap-4'>
        <div>
          <h3>{t('admin_card_monthly_activity')}</h3>
          <h5 className='mt-2 font-semibold text-emerald-500'>
            {t('admin_card_total_users')}: {usersInfo?.userCount}
          </h5>
        </div>

        <div className='flex items-center gap-2'>
          <div className='bg-[#10B981] w-4 h-4 rounded-sm'></div>
          <p className='text-white'>{t('admin_card_active_users')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='bg-[#818cf8] w-4 h-4 rounded-sm'></div>
          <p className='text-white'>{t('admin_card_inactive_users')}</p>
        </div>
      </div>

      <div className='w-full h-50'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={outerRadius}
              fill='#4ade80'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};