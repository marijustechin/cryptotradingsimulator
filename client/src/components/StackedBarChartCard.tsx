import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import HelperService from "../services/HelperService";
import { useTranslation } from "react-i18next";

const VioletGlowCursor = ({ x, y, width, height }: any) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={4}
    fill="rgba(196, 181, 253, 0.2)"
    stroke="rgba(196, 181, 253, 0.4)"
    strokeWidth={1}
    style={{
      filter: "drop-shadow(0 0 6px rgba(196, 181, 253, 0.4))",
      transition: "all 0.2s ease",
    }}
  />
);

export const StackedBarChartCard = ({
  title,
  total,
  data,
  keys,
  colors,
}: {
  title: string;
  total?: string;
  data: any[];
  keys: string[];
  colors: string[];
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
      <div className="mb-2">
        <span className="text-[1.75rem] text-[#10B981] font-semibold">
          {t('admin_chart_total_last_12_months')}: {total}
        </span>
        <h3 className="text-gray-200">{t(title)}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#818cf8" />
          <YAxis stroke="#818cf8" />
          <Tooltip
            cursor={<VioletGlowCursor />}
            formatter={(val: unknown) =>
              HelperService.formatCurrency(Number(val))
            }
            contentStyle={{
              backgroundColor: "#1f2937",
              borderColor: "#6b7280",
              color: "#10b981",
            }}
            labelStyle={{ color: "white" }}
          />
          <Legend />
          {keys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[i]}
              name={`${t(`admin_chart_${key}`)} ${t('admin_chart_orders')}`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
