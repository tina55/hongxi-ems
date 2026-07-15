import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TrendData, TrendDataPoint } from '@/types/energy';

interface LineChartProps {
  data: TrendData[] | TrendDataPoint[];
  title?: string;
  colors?: string[];
  height?: number;
  dataKeys?: string[];
  xAxisKey?: string;
}

export function LineChart({
  data,
  title,
  colors = ['#58a6ff', '#3fb950', '#f85149'],
  height = 300,
  dataKeys = ['value', 'electric', 'water'],
  xAxisKey = 'time'
}: LineChartProps) {
  return (
    <>
      {title && (
        <div className="text-sm font-medium text-gray-500 mb-4">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#6b7280' }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || colors[0]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: colors[index] || colors[0] }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </>
  );
}