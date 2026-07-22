import { useState, useMemo } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import { Search, Download, X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const intervalOptions = [
  { value: '1min', label: '1分钟' },
  { value: '5min', label: '5分钟' },
  { value: '10min', label: '10分钟' },
  { value: '15min', label: '15分钟' },
  { value: '30min', label: '30分钟' },
  { value: '1hour', label: '1小时' },
];

const pointOptions = [
  { value: 'ep', label: '吸收有功电能一次侧（用电量）' },
  { value: 'p', label: '有功功率' },
  { value: 'q', label: '无功功率' },
  { value: 'ua', label: 'A相电压' },
  { value: 'ia', label: 'A相电流' },
];

function generateHistoryData() {
  const data: { time: string; value: number }[] = [];
  const baseValue = 814.5;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 144; i++) {
    const time = new Date(now.getTime() + i * 10 * 60 * 1000);
    const timeStr = time.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');

    const value = baseValue + i * 0.015 + Math.random() * 0.05;
    data.push({
      time: timeStr,
      value: Number(value.toFixed(2)),
    });
  }

  return data;
}

export default function HistoryData() {
  const [startTime, setStartTime] = useState('2025-08-22 00:00:00');
  const [endTime, setEndTime] = useState('2025-08-22 23:59:59');
  const [interval, setInterval] = useState('10min');
  const [selectedPoints, setSelectedPoints] = useState<string[]>(['ep']);
  const [chartData] = useState(generateHistoryData);

  const handlePointToggle = (value: string) => {
    setSelectedPoints((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearch = () => {
    console.log('查询历史数据', { startTime, endTime, interval, selectedPoints });
  };

  const activePointLabels = useMemo(() => {
    return pointOptions.filter((p) => selectedPoints.includes(p.value));
  }, [selectedPoints]);

  return (
    <div className="flex h-full">
      <TreeNav width={280} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">查询日期:</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[180px]"
              />
              <span className="text-sm text-gray-500">至</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[180px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">统计间隔:</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[100px]"
              >
                {intervalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[280px]">
              <label className="text-sm text-gray-600 font-medium shrink-0">设备测点:</label>
              <div className="flex items-center gap-2 flex-wrap flex-1">
                <select
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white flex-1 min-w-[200px]"
                  onChange={(e) => {
                    if (e.target.value) {
                      handlePointToggle(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">请选择测点</option>
                  {pointOptions
                    .filter((p) => !selectedPoints.includes(p.value))
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
          </div>

          {selectedPoints.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {activePointLabels.map((point) => (
                <span
                  key={point.value}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-[#10469c] rounded border border-blue-100"
                >
                  {point.label}
                  <button
                    onClick={() => handlePointToggle(point.value)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">历史数据</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#10469c] border border-[#10469c] rounded-md hover:bg-[#10469c] hover:text-white transition-colors">
              <Download className="w-4 h-4" />
              下载
            </button>
          </div>

          <div className="h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  tickLine={{ stroke: '#d1d5db' }}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  label={{ value: '测点值', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="吸收有功电能一次侧（用电量）"
                  stroke="#2c5bb5"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#2c5bb5', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
