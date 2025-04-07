import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
  } from 'recharts';
  import HelperService from '../../services/HelperService';
  
  export const TotalIncome = ({
    yearlyIncomeByMonth,
  }: {
    yearlyIncomeByMonth: { month: string; limit: number; market: number }[];
  }) => (
    <div className='bg-gray-700 p-6 rounded-xl shadow-md mb-6'>
      <h2 className='text-xl font-semibold text-gray-200 mb-4'>
        Yearly Income by Month{' '}
      </h2>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={yearlyIncomeByMonth}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' stroke='#818cf8' />
          <YAxis stroke='#818cf8'/>
          <Tooltip formatter={(val) => HelperService.formatCurrency(val)} 
            contentStyle={{
                backgroundColor: '#1f2937',
                borderColor: '#6b7280',
                color: '#10b981',
              }}
              labelStyle={{ color: 'white' }}/>
          <Legend />
          <Bar dataKey='limit' fill='#4ade80' name='Limit Orders' />
          <Bar dataKey='market' fill='#818cf8' name='Market Orders' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
  