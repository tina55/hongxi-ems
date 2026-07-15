import { useState } from 'react';
import { AreaChart } from '@/components/Chart/AreaChart';
import { DataTable } from '@/components/DataTable/DataTable';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BarChart3, Table, Search } from 'lucide-react';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

type EnergyType = 'electric' | 'water' | 'gas' | 'compressedAir' | 'co2' | 'argon' | 'energyMeter';
type ViewMode = 'chart' | 'table';
type TimeRange = 'day' | 'month' | 'year' | 'custom';

const energyTypes: { key: EnergyType; label: string; unit: string; color?: string }[] = [
  { key: 'electric', label: '电', unit: 'kW·h', color: '#1d90ff' },
  { key: 'water', label: '水', unit: 'm³', color: '#10b981' },
  { key: 'gas', label: '天然气', unit: 'm³', color: '#f59e0b' },
  { key: 'compressedAir', label: '压缩空气', unit: 'm³', color: '#8b5cf6' },
  { key: 'co2', label: '二氧化碳', unit: 'kg', color: '#ef4444' },
  { key: 'argon', label: '氩气', unit: 'm³', color: '#06b6d4' },
  { key: 'energyMeter', label: '能量计', unit: 'GJ', color: '#ec4899' }
];

const timeRangeOptions = [
  { value: 'day', label: '近30天' },
  { value: 'month', label: '近12月' },
  { value: 'year', label: '近5年' },
  { value: 'custom', label: '自定义' }
];

const baseValues: Record<string, { day: number; month: number; year: number }> = {
  electric: { day: 150000, month: 4500000, year: 50000000 },
  water: { day: 850, month: 25500, year: 300000 },
  gas: { day: 1250, month: 37500, year: 450000 },
  compressedAir: { day: 8500, month: 255000, year: 3000000 },
  co2: { day: 320, month: 9600, year: 115000 },
  argon: { day: 450, month: 13500, year: 160000 },
  energyMeter: { day: 1250, month: 37500, year: 450000 }
};

function generateTimeLabels(timeRange: TimeRange, startDate?: string, endDate?: string): string[] {
  const labels: string[] = [];

  if (timeRange === 'day') {
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      labels.push(`${month}-${day}`);
    }
  } else if (timeRange === 'month') {
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      labels.push(`${year}-${month}`);
    }
  } else if (timeRange === 'year') {
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
      labels.push((currentYear - i) + '年');
    }
  } else if (timeRange === 'custom' && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const count = Math.min(diffDays + 1, 60);
    const step = Math.max(1, Math.floor((diffDays + 1) / count));

    for (let i = 0; i < count; i++) {
      const date = new Date(start.getTime() + i * step * 24 * 60 * 60 * 1000);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      labels.push(`${month}-${day}`);
    }
  }

  return labels;
}

function generateSingleTrendData(energyKey: string, timeLabels: string[]): number[] {
  const base = baseValues[energyKey] || { day: 1000, month: 30000, year: 360000 };
  let baseValue: number;

  if (timeLabels.length <= 31) {
    baseValue = base.day;
  } else if (timeLabels.length <= 12) {
    baseValue = base.month;
  } else {
    baseValue = base.year;
  }

  return timeLabels.map((_, index) => {
    const trendFactor = 1 + (index / timeLabels.length) * 0.15;
    const randomFactor = 1 + (Math.random() - 0.5) * 0.3;
    return Math.round(baseValue * trendFactor * randomFactor * 100) / 100;
  });
}

function generateTrendData(energyType: EnergyType, timeRange: TimeRange, startDate?: string, endDate?: string) {
  const timeLabels = generateTimeLabels(timeRange, startDate, endDate);
  const values = generateSingleTrendData(energyType, timeLabels);
  return timeLabels.map((time, index) => ({ time, value: values[index] }));
}

function formatValue(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

function StatItem({
  label,
  value,
  unit,
  color = '#1d90ff'
}: {
  label: string;
  value: number;
  unit: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold" style={{ color }}>{formatValue(value)}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
}

export default function Trend() {
  const [energyType, setEnergyType] = useState<EnergyType>('electric');
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-07-06');
  const [queryKey, setQueryKey] = useState(0);

  const currentEnergy = energyTypes.find(e => e.key === energyType)!;

  const trendData = generateTrendData(energyType, timeRange, startDate, endDate);

  const getPeriodLabel = () => {
    switch (timeRange) {
      case 'day': return '日';
      case 'month': return '月';
      case 'year': return '年';
      case 'custom': return '日';
      default: return '日';
    }
  };

  const getStats = () => {
    const values = trendData.map((item: any) => item.value as number);
    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = values.length > 0 ? total / values.length : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;
    const min = values.length > 0 ? Math.min(...values) : 0;
    return { total, avg, max, min, unit: currentEnergy.unit, label: currentEnergy.label };
  };

  const stats = getStats();

  const tableData = trendData.map((item: any, index: number) => ({
    id: String(index + 1),
    name: item.time,
    value: item.value,
    rank: index + 1
  }));

  const tableColumns = [
    { key: 'rank', label: '序号' },
    { key: 'name', label: '时间' },
    {
      key: 'value',
      label: `用${currentEnergy.label}量(${currentEnergy.unit})`,
      format: (v: number) => v.toFixed(2)
    }
  ];

  const handleQuery = () => {
    setQueryKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <div className="w-72 flex-shrink-0 p-4">
          <TreeNav width={280} />
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="bg-gradient-to-r from-[#e3f2fd] to-[#f3e5f5] rounded-xl border border-blue-100 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#10469c] text-white text-xs font-bold">i</span>
              <span className="text-[#10469c] font-semibold">用能趋势功能说明：</span>
              <span className="text-gray-700">左侧设备树选择节点 → 选择能源类型和时间范围 → 点击"查询"按钮 → 查看趋势图表与数据明细 → 切换图表/表格视图查看不同形式数据</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">能源类型:</span>
                  <select
                    value={energyType}
                    onChange={(e) => setEnergyType(e.target.value as EnergyType)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1d90ff]/20 focus:border-[#1d90ff]"
                  >
                    {energyTypes.map((type) => (
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">时间范围:</span>
                  <div className="flex gap-1">
                    {timeRangeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTimeRange(option.value as TimeRange)}
                        className={cn(
                          'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                          timeRange === option.value
                            ? 'bg-[#10469c] text-white'
                            : 'text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {timeRange === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1d90ff]/20 focus:border-[#1d90ff]"
                    />
                    <span className="text-gray-400">至</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1d90ff]/20 focus:border-[#1d90ff]"
                    />
                  </div>
                )}

                <button
                  onClick={handleQuery}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10469c] text-white rounded-md text-sm font-medium hover:bg-[#0d3a80] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  查询
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('chart')}
                  className={cn(
                    'p-2 rounded-md transition-all duration-200',
                    viewMode === 'chart'
                      ? 'bg-gray-100 text-[#10469c]'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'p-2 rounded-md transition-all duration-200',
                    viewMode === 'table'
                      ? 'bg-gray-100 text-[#10469c]'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Table className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatItem
              label={`总用${stats.label}量`}
              value={stats.total}
              unit={stats.unit}
              color="#1d90ff"
            />
            <StatItem
              label={`日均用${stats.label}量`}
              value={stats.avg}
              unit={stats.unit}
              color="#10b981"
            />
            <StatItem
              label={`最大${getPeriodLabel()}用${stats.label}量`}
              value={stats.max}
              unit={stats.unit}
              color="#1d90ff"
            />
            <StatItem
              label={`最小${getPeriodLabel()}用${stats.label}量`}
              value={stats.min}
              unit={stats.unit}
              color="#10b981"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-4">
              {`用${currentEnergy.label}趋势详情`}
            </div>

            {viewMode === 'chart' ? (
              <div key={queryKey}>
                <AreaChart data={trendData} height={450} />
              </div>
            ) : (
              <DataTable key={queryKey} data={tableData} columns={tableColumns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
