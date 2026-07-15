import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TrendData } from '@/types/energy';

interface AreaChartProps {
  data: TrendData[];
  title?: string;
  color?: string;
  compareColor?: string;
  height?: number;
  showCompare?: boolean;
}

export function AreaChart({
  data,
  title,
  color = '#58a6ff',
  compareColor = '#3fb950',
  height = 300,
  showCompare = false
}: AreaChartProps) {
  return (
    <>
      {title && (
        <div className="text-sm font-medium text-gray-500 mb-4">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {showCompare && (
              <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={compareColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={compareColor} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
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
            tickFormatter={(value) => `${value}`}
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
          {showCompare && <Legend />}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="当前值"
          />
          {showCompare && (
            <Area
              type="monotone"
              dataKey="compareValue"
              stroke={compareColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompare)"
              name="对比值"
            />
          )}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </>
  );
}