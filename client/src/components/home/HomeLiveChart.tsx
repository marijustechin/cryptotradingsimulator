import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface TestChartProps {
  chartData: {
    price: number;
  }[];
}

export const HomeLiveChart = ({ chartData }: TestChartProps) => {
  return (
    <ResponsiveContainer width='100%' height={100}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id='purpleToBlue' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#6D28D9' /> {/* Purple */}
            <stop offset='100%' stopColor='#3B82F6' /> {/* Blue */}
          </linearGradient>
        </defs>
        <Line
          dot={false}
          type='monotone'
          dataKey='price'
          stroke='url(#purpleToBlue)'
          strokeWidth={4}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
