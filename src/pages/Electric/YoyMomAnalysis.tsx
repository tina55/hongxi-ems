import { useState, useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Search, Download, Calendar, ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import { treeData } from '@/data/treeData';
import type { TreeNode } from '@/types/tree';

const energyTypes = [
  { value: 'all', label: '全部' },
  { value: 'electric', label: '电', unit: 'kW·h' },
  { value: 'water', label: '水', unit: 'm³' },
  { value: 'gas', label: '天然气', unit: 'm³' },
  { value: 'compressedAir', label: '压缩空气', unit: 'm³' },
  { value: 'co2', label: '二氧化碳', unit: 'kg' },
  { value: 'argon', label: '氩气', unit: 'm³' },
  { value: 'energyMeter', label: '能量计', unit: 'GJ' },
];

const dateTypes = [
  { value: 'day', label: '日' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
];

interface NodeData {
  id: string;
  name: string;
  current: number;
  previous: number;
  productionEnergy: number;
  standbyEnergy: number;
  output: number;
}

const mockDataMap: Record<string, NodeData> = {
  'factory-1': { id: 'factory-1', name: '宏奥厂区', current: 10594.19, previous: 16586.32, productionEnergy: 8475.35, standbyEnergy: 2118.84, output: 1250 },
  'workshop-1': { id: 'workshop-1', name: '涂装车间', current: 3990.5, previous: 2729.65, productionEnergy: 3192.4, standbyEnergy: 798.1, output: 420 },
  'workshop-2': { id: 'workshop-2', name: '数控车间', current: 2728, previous: 1800, productionEnergy: 2182.4, standbyEnergy: 545.6, output: 380 },
  'workshop-5': { id: 'workshop-5', name: '冲压车间', current: 3694.25, previous: 2540.31, productionEnergy: 2955.4, standbyEnergy: 738.85, output: 350 },
  'workshop-6': { id: 'workshop-6', name: 'V80车间', current: 2345.78, previous: 1890.23, productionEnergy: 1876.62, standbyEnergy: 469.16, output: 280 },
  'workshop-7': { id: 'workshop-7', name: '集成车间', current: 1890.34, previous: 1560.78, productionEnergy: 1512.27, standbyEnergy: 378.07, output: 220 },
};

function TreeNodeItem({
  node,
  level = 0,
  searchTerm,
  checkedIds,
  setCheckedIds,
  expandedIds,
  setExpandedIds
}: {
  node: TreeNode;
  level?: number;
  searchTerm: string;
  checkedIds: string[];
  setCheckedIds: React.Dispatch<React.SetStateAction<string[]>>;
  expandedIds: string[];
  setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const isChecked = checkedIds.includes(node.id);
  const isExpanded = expandedIds.includes(node.id);
  const hasChildren = node.children.length > 0;

  const hasMatchingDescendant = useMemo(() => {
    if (!searchTerm) return true;
    const checkChildren = (n: TreeNode): boolean => {
      if (n.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      return n.children.some(checkChildren);
    };
    return checkChildren(node);
  }, [node, searchTerm]);

  if (searchTerm && !hasMatchingDescendant) return null;

  const getAllChildIds = (n: TreeNode): string[] => {
    const ids: string[] = [n.id];
    n.children.forEach(child => ids.push(...getAllChildIds(child)));
    return ids;
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = getAllChildIds(node);
      setCheckedIds(prev => Array.from(new Set([...prev, ...allIds])));
    } else {
      const allIds = getAllChildIds(node);
      setCheckedIds(prev => prev.filter(id => !allIds.includes(id)));
    }
  };

  const handleExpand = () => {
    if (hasChildren) {
      setExpandedIds(prev =>
        prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]
      );
    }
  };

  return (
    <div>
      <button
        onClick={handleExpand}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors text-sm hover:bg-blue-50"
        style={{ paddingLeft: `${level * 14 + 6}px` }}
      >
        {hasChildren && (
          <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheck}
          className="w-3.5 h-3.5 accent-[#10469c]"
        />
        <Building2 className="w-3.5 h-3.5 text-gray-400" />
        <span className="flex-1 truncate text-left text-gray-700">{node.name}</span>
      </button>

      {hasChildren && (isExpanded || searchTerm) && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              searchTerm={searchTerm}
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function YoyMomAnalysis() {
  const [compareType, setCompareType] = useState<'yoy' | 'mom'>('yoy');
  const [selectedEnergy, setSelectedEnergy] = useState('all');
  const [selectedDateType, setSelectedDateType] = useState('day');
  const [selectedDate, setSelectedDate] = useState('2026-07-13');
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedIds, setCheckedIds] = useState<string[]>(['factory-1', 'workshop-1', 'workshop-2', 'workshop-5']);
  const [expandedIds, setExpandedIds] = useState<string[]>(['factory-1']);

  const handleSearch = () => {
    console.log('查询', { compareType, selectedEnergy, selectedDateType, selectedDate, checkedIds });
  };

  const handleExport = () => {
    console.log('导出');
  };

  const filteredData = useMemo(() => {
    return checkedIds
      .filter(id => mockDataMap[id])
      .map(id => ({
        ...mockDataMap[id],
      }));
  }, [checkedIds]);

  const chartData = useMemo(() => {
    return filteredData.map(d => ({
      name: d.name,
      current: d.current,
      previous: d.previous
    }));
  }, [filteredData]);

  const tableData = useMemo(() => {
    return filteredData.map(d => ({
      name: d.name,
      current: d.current,
      previous: d.previous,
      productionEnergy: d.productionEnergy,
      standbyEnergy: d.standbyEnergy,
      output: d.output,
      percent: ((d.current - d.previous) / d.previous * 100).toFixed(2)
    }));
  }, [filteredData]);

  const currentEnergy = energyTypes.find(e => e.value === selectedEnergy);
  const unit = currentEnergy?.unit || 'kW·h';

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <div className="w-72 flex-shrink-0 p-4">
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full shadow-sm">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="输入关键字搜索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {treeData.map((node) => (
                <TreeNodeItem
                  key={node.id}
                  node={node}
                  searchTerm={searchTerm}
                  checkedIds={checkedIds}
                  setCheckedIds={setCheckedIds}
                  expandedIds={expandedIds}
                  setExpandedIds={setExpandedIds}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800">同环比分析</h1>
                <p className="text-sm text-gray-500 mt-1">对比分析能源节点同/环比数据</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="compareType"
                    checked={compareType === 'yoy'}
                    onChange={() => setCompareType('yoy')}
                    className="w-3.5 h-3.5 accent-[#10469c]"
                  />
                  <span className="text-sm text-gray-700">同比</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="compareType"
                    checked={compareType === 'mom'}
                    onChange={() => setCompareType('mom')}
                    className="w-3.5 h-3.5 accent-[#10469c]"
                  />
                  <span className="text-sm text-gray-700">环比</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">能源类型:</span>
                <select
                  value={selectedEnergy}
                  onChange={(e) => setSelectedEnergy(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[100px]"
                >
                  {energyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDateType}
                  onChange={(e) => setSelectedDateType(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[80px]"
                >
                  {dateTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type={selectedDateType === 'year' ? 'number' : selectedDateType === 'month' ? 'month' : 'date'}
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
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-800">能耗对比图</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1d90ff' }} />
                  <span className="text-gray-700">本期</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a78bfa' }} />
                  <span className="text-gray-700">同期</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-1">{unit}</div>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsBarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#9ca3af' }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
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
                />
                <Bar dataKey="current" fill="#1d90ff" name="本期" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="previous" fill="#a78bfa" name="同期" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">详细数据</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#2c5bb5' }}>
                  <th className="px-4 py-3 text-center font-semibold text-white">能源节点</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">本期能耗({unit})</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">生产能耗({unit})</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">待机能耗({unit})</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">产量</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">同期能耗({unit})</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">{compareType === 'yoy' ? '同比' : '环比'}(%)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{formatNumber(row.current)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{formatNumber(row.productionEnergy)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{formatNumber(row.standbyEnergy)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{row.output}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-600">{formatNumber(row.previous)}</td>
                    <td className={`px-4 py-3 text-center font-mono ${
                      parseFloat(row.percent) >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {row.percent}
                    </td>
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
