import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { DistributionData } from '@/types/energy';

interface PieChartProps {
  data: DistributionData[];
  title?: string;
  height?: number;
}

const COLORS = ['#58a6ff', '#3fb950', '#f85149', '#a371f7', '#d29922', '#8b949e'];

export function PieChart({ data, title, height = 300 }: PieChartProps) {
  return (
    <>
      {title && (
        <div className="text-sm font-medium text-gray-500 mb-4">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value.toFixed(2)}`, '']}
          />
          <Legend
            formatter={(value) => <span className="text-gray-500">{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </>
  );
}