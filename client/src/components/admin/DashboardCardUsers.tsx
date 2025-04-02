import { useEffect } from 'react';
import {
  getAdminUserInfo,
  getGeneralInfo,
} from '../../store/features/admin/adminSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

export const DashboardCardUsers = () => {
  const dispatch = useAppDispatch();
  const usersInfo = useAppSelector(getAdminUserInfo);

  useEffect(() => {
    if (!usersInfo) {
      dispatch(getGeneralInfo());
    }
  }, [dispatch, usersInfo]);

  const data = [
    { name: 'Active', value: usersInfo?.activeUsers },
    { name: 'Inactive', value: usersInfo?.userCount - usersInfo?.activeUsers },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
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
    <div className='bg-gray-700/40 p-6 rounded-xl shadow-lg backdrop-blur-md flex flex-col justify-center items-center'>
      <p> Active/Inactive users</p>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
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
  );
};
