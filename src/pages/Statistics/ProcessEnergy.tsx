import { useState, useMemo } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import { Search, Download, Calendar, ArrowUpDown } from 'lucide-react';

const energyTypes = [
  { value: 'electric', label: '电' },
  { value: 'water', label: '水' },
  { value: 'gas', label: '天然气' },
  { value: 'air', label: '压缩空气' },
  { value: 'co2', label: '二氧化碳' },
  { value: 'argon', label: '氩气' },
  { value: 'heat', label: '热量' },
];

const processTypes = [
  { value: 'stamping', label: '冲压工艺' },
  { value: 'welding', label: '焊接工艺' },
  { value: 'painting', label: '涂装工艺' },
  { value: 'assembly', label: '装配工艺' },
];

const tableData = [
  { process: '冲压工艺', equipment: '冲床A', product: '车门内板', startTime: '2026-07-08 08:00', endTime: '2026-07-08 16:30', energy: 1256.34, duration: 8.5, efficiency: 87.5 },
  { process: '冲压工艺', equipment: '冲床B', product: '引擎盖板', startTime: '2026-07-08 08:30', endTime: '2026-07-08 14:42', energy: 986.24, duration: 6.2, efficiency: 91.2 },
  { process: '焊接工艺', equipment: '焊接机器人1', product: '车身总成', startTime: '2026-07-08 09:00', endTime: '2026-07-08 14:48', energy: 856.78, duration: 5.8, efficiency: 89.3 },
  { process: '焊接工艺', equipment: '焊接机器人2', product: '底盘焊接', startTime: '2026-07-08 09:15', endTime: '2026-07-08 13:45', energy: 723.45, duration: 4.5, efficiency: 92.1 },
  { process: '涂装工艺', equipment: '底漆线体', product: '车身底漆', startTime: '2026-07-08 07:00', endTime: '2026-07-08 19:00', energy: 1865.42, duration: 12.0, efficiency: 85.6 },
  { process: '涂装工艺', equipment: '面漆线', product: '车身面漆', startTime: '2026-07-08 10:00', endTime: '2026-07-08 20:30', energy: 2156.78, duration: 10.5, efficiency: 88.4 },
  { process: '装配工艺', equipment: '装配线A', product: '整车装配', startTime: '2026-07-08 08:00', endTime: '2026-07-08 15:12', energy: 654.32, duration: 7.2, efficiency: 93.5 },
  { process: '装配工艺', equipment: '装配线B', product: '内饰装配', startTime: '2026-07-08 08:45', endTime: '2026-07-08 15:33', energy: 589.67, duration: 6.8, efficiency: 90.8 },
];

export default function ProcessEnergy() {
  const [selectedProcess, setSelectedProcess] = useState('stamping');
  const [selectedEnergy, setSelectedEnergy] = useState('electric');
  const [startDate, setStartDate] = useState('2026-07-08');
  const [endDate, setEndDate] = useState('2026-07-08');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = () => {
    console.log('查询', { selectedProcess, selectedEnergy, startDate, endDate });
  };

  const handleExport = () => {
    console.log('导出');
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return tableData;
    return [...tableData].sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a];
      const bVal = b[sortKey as keyof typeof b];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal, 'zh-CN') : bVal.localeCompare(aVal, 'zh-CN');
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortKey, sortOrder]);

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
                <h1 className="text-xl font-bold text-gray-800">工艺能耗1（宏创）</h1>
                <p className="text-sm text-gray-500 mt-1">按工艺环节统计能耗数据</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[120px]"
              >
                {processTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#2c5bb5' }}>
                    <th onClick={() => handleSort('process')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        工艺名称
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('equipment')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        设备名称
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('product')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        产品
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('startTime')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        开始时间
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('endTime')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        结束时间
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('energy')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        能耗(kW·h)
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('duration')} className="px-6 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors">
                      <div className="flex items-center justify-center gap-1">
                        时长(h)
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-center text-gray-800 font-medium">
                        {row.process}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.equipment}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.product}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.startTime}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {row.endTime}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-800">
                        {row.energy.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-800">
                        {row.duration.toFixed(1)}
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