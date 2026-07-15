import { useState, useMemo } from 'react';
import { Search, Download, Calendar, ArrowUpDown } from 'lucide-react';

const nodeAttributes = [
  { value: 'all', label: '全部' },
  { value: 'factory', label: '厂区' },
  { value: 'workshop', label: '车间' },
  { value: 'area', label: '区域' },
  { value: 'equipment', label: '设备' },
  { value: 'meter', label: '仪表' },
];

const dateTypes = [
  { value: 'day', label: '日' },
  { value: 'month', label: '月' },
];

interface ReportData {
  date: string;
  nodeName: string;
  nodeAttribute: string;
  startTime: string;
  startValue: number;
  endTime: string;
  endValue: number;
  diff: number;
}

const reportData: ReportData[] = [
  // 厂区
  { date: '2026/3/27', nodeName: '宏奥厂区', nodeAttribute: '厂区', startTime: '2026-03-27 00:00', startValue: 3382434.3, endTime: '2026-03-27 24:00', endValue: 3393618.4, diff: 11184.1 },
  { date: '2026/3/28', nodeName: '宏奥厂区', nodeAttribute: '厂区', startTime: '2026-03-28 00:00', startValue: 3393618.4, endTime: '2026-03-28 24:00', endValue: 3405628.9, diff: 12010.5 },
  { date: '2026/3/29', nodeName: '宏奥厂区', nodeAttribute: '厂区', startTime: '2026-03-29 00:00', startValue: 3405628.9, endTime: '2026-03-29 24:00', endValue: 3405628.9, diff: 0 },
  { date: '2026/3/30', nodeName: '宏奥厂区', nodeAttribute: '厂区', startTime: '2026-03-30 00:00', startValue: 3405628.9, endTime: '2026-03-30 24:00', endValue: 3416890.2, diff: 11261.3 },
  // 5个车间 - 3/27
  { date: '2026/3/27', nodeName: '数控车间', nodeAttribute: '车间', startTime: '2026-03-27 00:00', startValue: 3382434.3, endTime: '2026-03-27 24:00', endValue: 3393618.4, diff: 11184.1 },
  { date: '2026/3/27', nodeName: '冲压车间', nodeAttribute: '车间', startTime: '2026-03-27 00:00', startValue: 3412567.8, endTime: '2026-03-27 24:00', endValue: 3425678.9, diff: 13111.1 },
  { date: '2026/3/27', nodeName: '集成车间', nodeAttribute: '车间', startTime: '2026-03-27 00:00', startValue: 1256789.2, endTime: '2026-03-27 24:00', endValue: 1265432.1, diff: 8642.9 },
  { date: '2026/3/27', nodeName: '涂装车间', nodeAttribute: '车间', startTime: '2026-03-27 00:00', startValue: 856234.5, endTime: '2026-03-27 24:00', endValue: 862345.6, diff: 6111.1 },
  { date: '2026/3/27', nodeName: 'V80车间', nodeAttribute: '车间', startTime: '2026-03-27 00:00', startValue: 156234.5, endTime: '2026-03-27 24:00', endValue: 158234.6, diff: 2000.1 },
  // 5个车间 - 3/28
  { date: '2026/3/28', nodeName: '数控车间', nodeAttribute: '车间', startTime: '2026-03-28 00:00', startValue: 3393618.4, endTime: '2026-03-28 24:00', endValue: 3405628.9, diff: 12010.5 },
  { date: '2026/3/28', nodeName: '冲压车间', nodeAttribute: '车间', startTime: '2026-03-28 00:00', startValue: 3425678.9, endTime: '2026-03-28 24:00', endValue: 3438901.2, diff: 13222.3 },
  { date: '2026/3/28', nodeName: '集成车间', nodeAttribute: '车间', startTime: '2026-03-28 00:00', startValue: 1265432.1, endTime: '2026-03-28 24:00', endValue: 1274567.8, diff: 9135.7 },
  { date: '2026/3/28', nodeName: '涂装车间', nodeAttribute: '车间', startTime: '2026-03-28 00:00', startValue: 862345.6, endTime: '2026-03-28 24:00', endValue: 868567.8, diff: 6222.2 },
  { date: '2026/3/28', nodeName: 'V80车间', nodeAttribute: '车间', startTime: '2026-03-28 00:00', startValue: 158234.6, endTime: '2026-03-28 24:00', endValue: 160567.8, diff: 2333.2 },
  // 5个车间 - 3/29
  { date: '2026/3/29', nodeName: '数控车间', nodeAttribute: '车间', startTime: '2026-03-29 00:00', startValue: 3405628.9, endTime: '2026-03-29 24:00', endValue: 3405628.9, diff: 0 },
  { date: '2026/3/29', nodeName: '冲压车间', nodeAttribute: '车间', startTime: '2026-03-29 00:00', startValue: 3438901.2, endTime: '2026-03-29 24:00', endValue: 3438901.2, diff: 0 },
  { date: '2026/3/29', nodeName: '集成车间', nodeAttribute: '车间', startTime: '2026-03-29 00:00', startValue: 1274567.8, endTime: '2026-03-29 24:00', endValue: 1274567.8, diff: 0 },
  { date: '2026/3/29', nodeName: '涂装车间', nodeAttribute: '车间', startTime: '2026-03-29 00:00', startValue: 868567.8, endTime: '2026-03-29 24:00', endValue: 868567.8, diff: 0 },
  { date: '2026/3/29', nodeName: 'V80车间', nodeAttribute: '车间', startTime: '2026-03-29 00:00', startValue: 160567.8, endTime: '2026-03-29 24:00', endValue: 160567.8, diff: 0 },
  // 5个车间 - 3/30
  { date: '2026/3/30', nodeName: '数控车间', nodeAttribute: '车间', startTime: '2026-03-30 00:00', startValue: 3405628.9, endTime: '2026-03-30 24:00', endValue: 3416890.2, diff: 11261.3 },
  { date: '2026/3/30', nodeName: '冲压车间', nodeAttribute: '车间', startTime: '2026-03-30 00:00', startValue: 3438901.2, endTime: '2026-03-30 24:00', endValue: 3451234.5, diff: 12333.3 },
  { date: '2026/3/30', nodeName: '集成车间', nodeAttribute: '车间', startTime: '2026-03-30 00:00', startValue: 1274567.8, endTime: '2026-03-30 24:00', endValue: 1283456.7, diff: 8888.9 },
  { date: '2026/3/30', nodeName: '涂装车间', nodeAttribute: '车间', startTime: '2026-03-30 00:00', startValue: 868567.8, endTime: '2026-03-30 24:00', endValue: 874321.5, diff: 5753.7 },
  { date: '2026/3/30', nodeName: 'V80车间', nodeAttribute: '车间', startTime: '2026-03-30 00:00', startValue: 160567.8, endTime: '2026-03-30 24:00', endValue: 162345.6, diff: 1777.8 },
  // 其他
  { date: '2026/3/27', nodeName: '底漆线体', nodeAttribute: '区域', startTime: '2026-03-27 00:00', startValue: 1256789.2, endTime: '2026-03-27 24:00', endValue: 1265432.1, diff: 8642.9 },
  { date: '2026/3/28', nodeName: '底漆线体', nodeAttribute: '区域', startTime: '2026-03-28 00:00', startValue: 1265432.1, endTime: '2026-03-28 24:00', endValue: 1274567.8, diff: 9135.7 },
  { date: '2026/3/29', nodeName: '底漆线体', nodeAttribute: '区域', startTime: '2026-03-29 00:00', startValue: 1274567.8, endTime: '2026-03-29 24:00', endValue: 1274567.8, diff: 0 },
  { date: '2026/3/30', nodeName: '底漆线体', nodeAttribute: '区域', startTime: '2026-03-30 00:00', startValue: 1274567.8, endTime: '2026-03-30 24:00', endValue: 1283456.7, diff: 8888.9 },
  { date: '2026/3/27', nodeName: '大冲区', nodeAttribute: '设备', startTime: '2026-03-27 00:00', startValue: 856234.5, endTime: '2026-03-27 24:00', endValue: 862345.6, diff: 6111.1 },
  { date: '2026/3/28', nodeName: '大冲区', nodeAttribute: '设备', startTime: '2026-03-28 00:00', startValue: 862345.6, endTime: '2026-03-28 24:00', endValue: 868567.8, diff: 6222.2 },
  { date: '2026/3/29', nodeName: '大冲区', nodeAttribute: '设备', startTime: '2026-03-29 00:00', startValue: 868567.8, endTime: '2026-03-29 24:00', endValue: 868567.8, diff: 0 },
  { date: '2026/3/30', nodeName: '大冲区', nodeAttribute: '设备', startTime: '2026-03-30 00:00', startValue: 868567.8, endTime: '2026-03-30 24:00', endValue: 874321.5, diff: 5753.7 },
  { date: '2026/3/27', nodeName: 'SCDL-001电表', nodeAttribute: '仪表', startTime: '2026-03-27 00:00', startValue: 156234.5, endTime: '2026-03-27 24:00', endValue: 158234.6, diff: 2000.1 },
  { date: '2026/3/28', nodeName: 'SCDL-001电表', nodeAttribute: '仪表', startTime: '2026-03-28 00:00', startValue: 158234.6, endTime: '2026-03-28 24:00', endValue: 160567.8, diff: 2333.2 },
  { date: '2026/3/29', nodeName: 'SCDL-001电表', nodeAttribute: '仪表', startTime: '2026-03-29 00:00', startValue: 160567.8, endTime: '2026-03-29 24:00', endValue: 160567.8, diff: 0 },
  { date: '2026/3/30', nodeName: 'SCDL-001电表', nodeAttribute: '仪表', startTime: '2026-03-30 00:00', startValue: 160567.8, endTime: '2026-03-30 24:00', endValue: 162345.6, diff: 1777.8 },
];

export default function EnergyReport() {
  const [selectedNodeAttribute, setSelectedNodeAttribute] = useState('workshop');
  const [nodeNameFilter, setNodeNameFilter] = useState('');
  const [selectedDateType, setSelectedDateType] = useState('day');
  const [selectedDate, setSelectedDate] = useState('2026-03-27');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = () => {
    console.log('查询', { selectedNodeAttribute, nodeNameFilter, selectedDateType, selectedDate });
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

  const filteredData = useMemo(() => {
    let result = reportData;
    // 按节点属性筛选
    if (selectedNodeAttribute !== 'all') {
      const targetAttr = nodeAttributes.find(a => a.value === selectedNodeAttribute)?.label;
      result = result.filter(item => item.nodeAttribute === targetAttr);
    }
    // 按日期筛选
    if (selectedDate) {
      const dateStr = selectedDate.replace(/-/g, '/').replace(/\/0/g, '/');
      result = result.filter(item => item.date === dateStr);
    }
    // 按节点名称筛选
    if (nodeNameFilter.trim()) {
      const keyword = nodeNameFilter.trim().toLowerCase();
      result = result.filter(item => item.nodeName.toLowerCase().includes(keyword));
    }
    return result;
  }, [selectedNodeAttribute, selectedDate, nodeNameFilter]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey as keyof ReportData];
      const bVal = b[sortKey as keyof ReportData];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal, 'zh-CN') : bVal.localeCompare(aVal, 'zh-CN');
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortKey, sortOrder, filteredData]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">用能报表</h1>
              <p className="text-sm text-gray-500 mt-1">按能源节点统计用能数据</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">能源节点属性:</span>
              <select
                value={selectedNodeAttribute}
                onChange={(e) => setSelectedNodeAttribute(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[100px]"
              >
                {nodeAttributes.map(attr => (
                  <option key={attr.value} value={attr.value}>
                    {attr.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">节点名称:</span>
              <input
                type="text"
                value={nodeNameFilter}
                onChange={(e) => setNodeNameFilter(e.target.value)}
                placeholder="输入节点名称搜索"
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">日期:</span>
              <select
                value={selectedDateType}
                onChange={(e) => setSelectedDateType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[80px]"
              >
                {dateTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type={selectedDateType === 'day' ? 'date' : 'month'}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
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
                  <th onClick={() => handleSort('date')} className="px-4 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      日期
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('nodeName')} className="px-4 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      能源节点
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('nodeAttribute')} className="px-4 py-3 text-center font-semibold text-white cursor-pointer hover:bg-[#1e4a92] transition-colors whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      节点属性
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">昨日电表读数(kW·h)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">今日电表读数(kW·h)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">电消耗量(kW·h)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">昨日水表读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">今日水表读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">水日消耗量(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">昨日压缩空气读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">今日压缩空气读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">气日消耗量(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">昨日天然气读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">今日天然气读数(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">气日消耗量(m³)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">昨日CO₂读数(kg)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">今日CO₂读数(kg)</th>
                  <th className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap">CO₂消耗量(kg)</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium whitespace-nowrap">{row.nodeName}</td>
                    <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{row.nodeAttribute}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.startValue)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.endValue)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800 whitespace-nowrap">{formatNumber(row.diff)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.startValue * 0.0005)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.endValue * 0.0005)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800 whitespace-nowrap">{formatNumber(row.diff * 0.0005)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.startValue * 0.0045)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.endValue * 0.0045)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800 whitespace-nowrap">{formatNumber(row.diff * 0.0045)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.startValue * 0.0025)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.endValue * 0.0025)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800 whitespace-nowrap">{formatNumber(row.diff * 0.0025)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.startValue * 0.000037)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600 whitespace-nowrap">{formatNumber(row.endValue * 0.000037)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800 whitespace-nowrap">{formatNumber(row.diff * 0.000037)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
