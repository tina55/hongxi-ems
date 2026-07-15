import { useState } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
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

const teams = [
  { id: 'team-1', name: '一班' },
  { id: 'team-2', name: '二班' },
  { id: 'team-3', name: '三班' },
  { id: 'team-4', name: '四班' },
];

const generateTableData = () => {
  const data: { date: string; teams: { id: string; name: string; value: number }[] }[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      teams: teams.map((team, idx) => ({
        id: team.id,
        name: team.name,
        value: Math.floor(12000 + Math.random() * 8000 + idx * 500),
      })),
    });
  }
  
  return data;
};

export default function TeamAnalysis() {
  const [selectedEnergy, setSelectedEnergy] = useState('electric');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [tableData, setTableData] = useState(generateTableData);

  const currentEnergyType = energyTypes.find(e => e.value === selectedEnergy) || energyTypes[0];

  const handleSearch = () => {
    setTableData(generateTableData());
  };

  const totalByTeam = teams.map(team => {
    const total = tableData.reduce((sum, row) => {
      const teamData = row.teams.find(t => t.id === team.id);
      return sum + (teamData?.value || 0);
    }, 0);
    return { ...team, total };
  });

  const maxTotal = Math.max(...totalByTeam.map(t => t.total));

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
                <h1 className="text-xl font-bold text-gray-800">班组能耗分析</h1>
                <p className="text-sm text-gray-500 mt-1">按班组统计能耗数据</p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date().toLocaleString('zh-CN')}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">能源类型:</label>
                <select
                  value={selectedEnergy}
                  onChange={(e) => setSelectedEnergy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                >
                  {energyTypes.map(energy => (
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
                    <th className="px-4 py-3 text-left font-semibold text-white rounded-tl-lg">日期</th>
                    {teams.map(team => (
                      <th key={team.id} className="px-4 py-3 text-center font-semibold text-white">
                        {team.name}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center font-semibold text-white rounded-tr-lg">合计</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => {
                    const rowTotal = row.teams.reduce((sum, t) => sum + t.value, 0);
                    return (
                      <tr key={row.date} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-700">{row.date}</td>
                        {row.teams.map(team => (
                          <td key={team.id} className="px-4 py-3 text-center font-mono text-gray-800">
                            {team.value.toLocaleString()}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-mono font-semibold text-[#10469c]">
                          {rowTotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-100 border-t border-gray-200">
                    <td className="px-4 py-3 font-semibold text-gray-700">合计</td>
                    {totalByTeam.map(team => (
                      <td key={team.id} className="px-4 py-3 text-center font-mono font-semibold text-gray-800">
                        {team.total.toLocaleString()}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#10469c]">
                      {totalByTeam.reduce((sum, t) => sum + t.total, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              单位: {currentEnergyType.unit}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">班组能耗占比</h3>
              <div className="space-y-3">
                {totalByTeam.map(team => {
                  const percent = (team.total / maxTotal) * 100;
                  return (
                    <div key={team.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{team.name}</span>
                        <span className="text-sm font-mono text-gray-800">
                          {team.total.toLocaleString()} {currentEnergyType.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10469c] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
