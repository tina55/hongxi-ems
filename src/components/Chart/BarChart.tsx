import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TeamEnergyData } from '@/types/energy';

interface BarChartProps {
  data: TeamEnergyData[];
  title?: string;
  height?: number;
  dataKey?: string;
}

export function BarChart({
  data,
  title,
  height = 300,
  dataKey = 'totalEnergy'
}: BarChartProps) {
  const chartData = data.map((item) => ({
    name: item.teamName,
    value: item[dataKey as keyof TeamEnergyData] as number
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <div className="text-sm font-medium text-gray-500 mb-4">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
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
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}