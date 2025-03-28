import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface TestChartProps {
  asset_id: string;
}

export const TestChart = ({ asset_id }: TestChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={30}>
      <LineChart data={history}>
        <defs>
          <linearGradient id="purpleToBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" /> {/* Purple */}
            <stop offset="100%" stopColor="#60A5FA" /> {/* Blue */}
          </linearGradient>
        </defs>
        <Line
          dot={false}
          type="monotone"
          dataKey="priceUsd"
          stroke="url(#purpleToBlue)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
