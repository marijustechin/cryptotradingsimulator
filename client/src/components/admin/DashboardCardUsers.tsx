import { useEffect, useState } from 'react';
import {
  getGeneralInfo,
  selectAdminUserInfo,
} from '../../store/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

export const DashboardCardUsers = () => {
  const dispatch = useAppDispatch();
  const usersInfo = useAppSelector(selectAdminUserInfo);

  const [outerRadius, setOuterRadius] = useState(90);

  // Responsive outerRadius based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 766) setOuterRadius(80); // sm
      else if (width < 1000) setOuterRadius(60); // md
      else setOuterRadius(90); // lg and up
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!usersInfo) {
      dispatch(getGeneralInfo());
    }
  }, [dispatch, usersInfo]);

  const data = [
    { name: 'Active', value: usersInfo?.activeUsers },
    { name: 'Inactive', value: usersInfo?.userCount - usersInfo?.activeUsers },
  ];

  const COLORS = ['#00C49F', '#0088FE'];

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
    <div className='bg-gray-700 p-4 rounded-xl shadow-lg backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
      {/* Left side: user stats and legend */}
      <div className='flex flex-col justify-center gap-4'>
        <div>
          <h3>Monthly Activity</h3>
          <h5 className='mt-2 font-semibold'>
            Total users: {usersInfo?.userCount}
          </h5>
        </div>

        <div className='flex items-center gap-2'>
          <div className='bg-[#00C49F] w-4 h-4 rounded-sm'></div>
          <p className='text-white'>Active users</p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='bg-[#0088FE] w-4 h-4 rounded-sm'></div>
          <p className='text-white'>Inactive users</p>
        </div>
      </div>

      {/* Right side: Pie Chart */}
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
              fill='#8884d8'
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
