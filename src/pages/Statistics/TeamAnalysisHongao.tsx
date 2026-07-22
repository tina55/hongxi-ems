import { useState } from 'react';
import { Search } from 'lucide-react';

const energyTypes = [
  { value: 'electric', label: '电', unit: 'kWh' },
  { value: 'water', label: '水', unit: 'm³' },
  { value: 'gas', label: '天然气', unit: 'm³' },
  { value: 'air', label: '压缩空气', unit: 'm³' },
  { value: 'co2', label: '二氧化碳', unit: 'kg' },
  { value: 'argon', label: '氩气', unit: 'm³' },
  { value: 'heat', label: '热量', unit: 'GJ' },
];

interface TeamRow {
  id: string;
  node: string;
  teamName: string;
  dayShift: number;
  nightShift: number | null;
}

const generateData = (): TeamRow[] => {
  const rows: TeamRow[] = [];

  rows.push({
    id: 'coating',
    node: '涂装车间',
    teamName: '涂装班组',
    dayShift: Math.floor(8000 + Math.random() * 4000),
    nightShift: null,
  });

  const stampingTeams = ['模修', '下料', '大冲甲', '大冲乙', '小冲甲', '小冲乙'];
  stampingTeams.forEach((name, idx) => {
    rows.push({
      id: `stamping-${idx}`,
      node: '冲压车间',
      teamName: name,
      dayShift: Math.floor(5000 + Math.random() * 5000 + idx * 300),
      nightShift: Math.floor(2000 + Math.random() * 3000 + idx * 200),
    });
  });

  return rows;
};

export default function TeamAnalysisHongao() {
  const [selectedEnergy, setSelectedEnergy] = useState('electric');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [tableData, setTableData] = useState<TeamRow[]>(generateData);

  const currentEnergyType = energyTypes.find((e) => e.value === selectedEnergy) || energyTypes[0];

  const handleSearch = () => {
    setTableData(generateData());
  };

  const dayTotal = tableData.reduce((sum, row) => sum + row.dayShift, 0);
  const nightTotal = tableData.reduce((sum, row) => sum + (row.nightShift || 0), 0);
  const grandTotal = dayTotal + nightTotal;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">班组分析（宏奥）</h1>
            <p className="text-sm text-gray-500 mt-1">按班组统计能耗数据</p>
          </div>
          <div className="text-sm text-gray-400">{new Date().toLocaleString('zh-CN')}</div>
        </div>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">能源类型:</label>
            <select
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
            >
              {energyTypes.map((energy) => (
                <option key={energy.value} value={energy.value}>
                  {energy.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">日期:</label>
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#2c5bb5]">
                <th className="px-4 py-3 text-left font-semibold text-white rounded-tl-lg">用能节点</th>
                <th className="px-4 py-3 text-left font-semibold text-white">班组名称</th>
                <th className="px-4 py-3 text-center font-semibold text-white">白班</th>
                <th className="px-4 py-3 text-center font-semibold text-white">夜班</th>
                <th className="px-4 py-3 text-center font-semibold text-white rounded-tr-lg">合计</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => {
                const rowTotal = row.dayShift + (row.nightShift || 0);
                return (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-700">{row.node}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{row.teamName}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">
                      {row.dayShift.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-gray-400">
                      {row.nightShift !== null ? row.nightShift.toLocaleString() : '--'}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-[#10469c]">
                      {rowTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          单位: {currentEnergyType.unit} | 白班合计: {dayTotal.toLocaleString()} {currentEnergyType.unit} | 夜班合计: {nightTotal.toLocaleString()} {currentEnergyType.unit} | 总计: {grandTotal.toLocaleString()} {currentEnergyType.unit}
        </div>
      </div>
    </div>
  );
}
