import { useState } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import { Search, Download, Calendar } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { useTreeStore } from '@/store/treeStore';
import { treeData } from '@/data/treeData';
import type { TreeNode } from '@/types/tree';

const energyTypes = [
  { value: 'electric', label: '电', unit: 'kW·h/t' },
  { value: 'water', label: '水', unit: 'm³/t' },
  { value: 'gas', label: '天然气', unit: 'm³/t' },
  { value: 'air', label: '压缩空气', unit: 'm³/t' },
  { value: 'co2', label: '二氧化碳', unit: 'kg/t' },
  { value: 'argon', label: '氩气', unit: 'm³/t' },
  { value: 'heat', label: '热量', unit: 'GJ/t' },
];

const avgLastMonth = 19863.8;

const generateChartData = () => {
  const data: { date: string; fullDate: string; unitConsumption: number; lastMonthUnitConsumption: number; lastMonthAvg: number }[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  for (let i = 0; i < 31; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const lastMonthValue = 18000 + Math.random() * 8000;
    const currentValue = Math.random() > 0.3 ? lastMonthValue * (0.7 + Math.random() * 0.5) : 0;
    data.push({
      date: day,
      fullDate: `${year}-${month}-${day}`,
      unitConsumption: Math.round(currentValue * 100) / 100,
      lastMonthUnitConsumption: Math.round(lastMonthValue * 100) / 100,
      lastMonthAvg: avgLastMonth,
    });
  }
  return data.reverse();
};

const chartData = generateChartData();

const getNodeNameById = (id: string, nodes: TreeNode[]): string => {
  for (const node of nodes) {
    if (node.id === id) return node.name;
    if (node.children.length > 0) {
      const found = getNodeNameById(id, node.children);
      if (found) return found;
    }
  }
  return '宏奥厂区';
};

const getDefaultDateRange = () => {
  const today = new Date();
  const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

const defaultDates = getDefaultDateRange();

export default function ProductEnergy() {
  const [selectedEnergy, setSelectedEnergy] = useState('electric');
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const { selectedNodeId } = useTreeStore();

  const currentNodeName = getNodeNameById(selectedNodeId || 'factory-1', treeData);

  const handleSearch = () => {
    console.log('查询', { selectedEnergy, startDate, endDate });
  };

  const handleExport = () => {
    console.log('导出');
  };

  const currentEnergy = energyTypes.find(e => e.value === selectedEnergy);
  const unit = currentEnergy?.unit || 'kW·h/t';

  const tableData = chartData.map(item => ({
    date: item.fullDate,
    node: currentNodeName,
    productValue: Math.floor(Math.random() * 100) + 50,
    energy: item.unitConsumption,
    effectiveEnergy: Math.round(item.unitConsumption * 0.9 * 100) / 100,
    actualUnit: '--',
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <div className="w-72 flex-shrink-0 p-4">
          <TreeNav width={280} />
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800">单位能耗</h1>
                <p className="text-sm text-gray-500 mt-1">按能源节点统计单位能耗数据</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <select
                value={selectedEnergy}
                onChange={(e) => setSelectedEnergy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[100px]"
              >
                {energyTypes.map(energy => (
                  <option key={energy.value} value={energy.value}>
                    {energy.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Search className="w-4 h-4" />
                查询
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-end gap-4 mb-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
                  <span className="text-gray-700">单耗</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#d97706' }} />
                  <span className="text-gray-700">上月单耗</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-1">{unit}</div>
              <ResponsiveContainer width="100%" height={350}>
                <RechartsBarChart data={chartData} barCategoryGap="10%" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#9ca3af' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString('zh-CN')}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} ${unit}`,
                      name === 'unitConsumption' ? '单耗' : '上月单耗'
                    ]}
                  />
                  <Bar dataKey="unitConsumption" fill="#10b981" name="单耗" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="lastMonthUnitConsumption" fill="#d97706" name="上月单耗" radius={[2, 2, 0, 0]} />
                  <Line
                    type="line"
                    dataKey="lastMonthAvg"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    isAnimationActive={false}
                    name="上月平均值"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#2c5bb5' }}>
                    <th className="px-6 py-3 text-center font-semibold text-white">日期</th>
                    <th className="px-6 py-3 text-center font-semibold text-white">能源节点</th>
                    <th className="px-6 py-3 text-center font-semibold text-white">产量</th>
                    <th className="px-6 py-3 text-center font-semibold text-white">能耗</th>
                    <th className="px-6 py-3 text-center font-semibold text-white">有效能耗</th>
                    <th className="px-6 py-3 text-center font-semibold text-white">实际单耗</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className={idx === 0 ? 'border-b border-gray-200' : 'border-b border-gray-200'}>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-800 font-medium">
                        {row.node}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-800">
                        {row.productValue}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-800">
                        {row.energy.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-800">
                        {row.effectiveEnergy.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {row.actualUnit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
