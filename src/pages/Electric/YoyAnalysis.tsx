import { useState } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

type EnergyType = 'electric' | 'water' | 'gas' | 'compressedAir' | 'co2' | 'argon' | 'energyMeter';

const energyTypes: { key: EnergyType; label: string; unit: string }[] = [
  { key: 'electric', label: '电', unit: 'kW·h' },
  { key: 'water', label: '水', unit: 'm³' },
  { key: 'gas', label: '天然气', unit: 'm³' },
  { key: 'compressedAir', label: '压缩空气', unit: 'm³' },
  { key: 'co2', label: '二氧化碳', unit: 'kg' },
  { key: 'argon', label: '氩气', unit: 'm³' },
  { key: 'energyMeter', label: '能量计', unit: 'GJ' }
];

const yoyData: Record<EnergyType, { time: string; current: number; last: number }[]> = {
  electric: [
    { time: '1月', current: 4250000, last: 3950000 },
    { time: '2月', current: 3980000, last: 3720000 },
    { time: '3月', current: 4520000, last: 4180000 },
    { time: '4月', current: 4680000, last: 4350000 },
    { time: '5月', current: 4850000, last: 4520000 },
    { time: '6月', current: 5120000, last: 4780000 },
    { time: '7月', current: 4950000, last: 4620000 },
    { time: '8月', current: 4720000, last: 4480000 },
    { time: '9月', current: 4850000, last: 4550000 },
    { time: '10月', current: 4580000, last: 4320000 },
    { time: '11月', current: 4420000, last: 4180000 },
    { time: '12月', current: 4750000, last: 4450000 }
  ],
  water: [
    { time: '1月', current: 25680, last: 24150 },
    { time: '2月', current: 21400, last: 20150 },
    { time: '3月', current: 28560, last: 26800 },
    { time: '4月', current: 30240, last: 28480 },
    { time: '5月', current: 32200, last: 30350 },
    { time: '6月', current: 34160, last: 32200 },
    { time: '7月', current: 35480, last: 33350 },
    { time: '8月', current: 36800, last: 34600 },
    { time: '9月', current: 31920, last: 30100 },
    { time: '10月', current: 27440, last: 25900 },
    { time: '11月', current: 24080, last: 22700 },
    { time: '12月', current: 23240, last: 21950 }
  ],
  gas: [
    { time: '1月', current: 38560, last: 35820 },
    { time: '2月', current: 34120, last: 31750 },
    { time: '3月', current: 42560, last: 39500 },
    { time: '4月', current: 44800, last: 41650 },
    { time: '5月', current: 47040, last: 43750 },
    { time: '6月', current: 49280, last: 45850 },
    { time: '7月', current: 50960, last: 47400 },
    { time: '8月', current: 52640, last: 48950 },
    { time: '9月', current: 46480, last: 43300 },
    { time: '10月', current: 40320, last: 37600 },
    { time: '11月', current: 36240, last: 34000 },
    { time: '12月', current: 34880, last: 32750 }
  ],
  compressedAir: [
    { time: '1月', current: 256800, last: 241500 },
    { time: '2月', current: 232400, last: 219500 },
    { time: '3月', current: 285600, last: 268000 },
    { time: '4月', current: 302400, last: 284800 },
    { time: '5月', current: 322000, last: 303500 },
    { time: '6月', current: 341600, last: 322000 },
    { time: '7月', current: 354800, last: 333500 },
    { time: '8月', current: 368000, last: 346000 },
    { time: '9月', current: 322000, last: 303500 },
    { time: '10月', current: 285600, last: 268000 },
    { time: '11月', current: 262400, last: 247000 },
    { time: '12月', current: 250000, last: 235000 }
  ],
  co2: [
    { time: '1月', current: 9768, last: 9255 },
    { time: '2月', current: 8688, last: 8220 },
    { time: '3月', current: 10867, last: 10248 },
    { time: '4月', current: 11424, last: 10776 },
    { time: '5月', current: 12096, last: 11394 },
    { time: '6月', current: 12768, last: 12012 },
    { time: '7月', current: 13286, last: 12501 },
    { time: '8月', current: 13805, last: 12990 },
    { time: '9月', current: 12096, last: 11394 },
    { time: '10月', current: 10867, last: 10248 },
    { time: '11月', current: 9888, last: 9369 },
    { time: '12月', current: 9485, last: 8977 }
  ],
  argon: [
    { time: '1月', current: 13686, last: 12855 },
    { time: '2月', current: 11970, last: 11310 },
    { time: '3月', current: 15120, last: 14256 },
    { time: '4月', current: 15876, last: 14976 },
    { time: '5月', current: 16632, last: 15696 },
    { time: '6月', current: 17388, last: 16416 },
    { time: '7月', current: 18018, last: 16992 },
    { time: '8月', current: 18648, last: 17568 },
    { time: '9月', current: 16632, last: 15696 },
    { time: '10月', current: 15120, last: 14256 },
    { time: '11月', current: 13686, last: 12855 },
    { time: '12月', current: 12960, last: 12192 }
  ],
  energyMeter: [
    { time: '1月', current: 37704, last: 35415 },
    { time: '2月', current: 34120, last: 31950 },
    { time: '3月', current: 41472, last: 38750 },
    { time: '4月', current: 43776, last: 40920 },
    { time: '5月', current: 46080, last: 43090 },
    { time: '6月', current: 48384, last: 45260 },
    { time: '7月', current: 50016, last: 46820 },
    { time: '8月', current: 51648, last: 48380 },
    { time: '9月', current: 46080, last: 43090 },
    { time: '10月', current: 41472, last: 38750 },
    { time: '11月', current: 37704, last: 35415 },
    { time: '12月', current: 35880, last: 33680 }
  ]
};

const currentYear = 2026;
const years = [2026, 2025, 2024, 2023];

function formatNum(num: number): string {
  if (num >= 1000000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

export default function YoyAnalysis() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [energyType, setEnergyType] = useState<EnergyType>('electric');

  const currentEnergy = energyTypes.find(e => e.key === energyType)!;
  const currentData = yoyData[energyType];

  const currentTotal = currentData.reduce((sum, item) => sum + item.current, 0);
  const previousTotal = currentData.reduce((sum, item) => sum + item.last, 0);
  const changePercent = ((currentTotal - previousTotal) / previousTotal) * 100;
  const changeValue = currentTotal - previousTotal;
  const isPositive = changePercent > 0;

  const compareCards = [
    {
      label: '当年用能总量',
      value: formatNum(currentTotal),
      unit: currentEnergy.unit,
      period: `${selectedYear}年`
    },
    {
      label: '去年同期总量',
      value: formatNum(previousTotal),
      unit: currentEnergy.unit,
      period: `${selectedYear - 1}年`
    },
    {
      label: '同比变化',
      value: formatNum(Math.abs(changeValue)),
      unit: currentEnergy.unit,
      percent: changePercent.toFixed(2),
      isPositive
    }
  ];

  return (
    <div className="flex h-full">
      <TreeNav width={280} />
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">能源类型:</span>
              <select
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value as EnergyType)}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 cursor-pointer min-w-[120px]"
              >
                {energyTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">选择年份:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 cursor-pointer min-w-[100px]"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {}}
              className="px-6 py-2 bg-[#10469c] text-white text-sm font-medium rounded-lg hover:bg-[#0d3a7f] transition-colors"
            >
              查询
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {compareCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="text-sm text-gray-500 mb-2">{card.label}</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-800">
                  {card.value}
                  <span className="text-sm ml-1 text-gray-400">{card.unit}</span>
                </div>
                {card.period && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {card.period}
                  </span>
                )}
              </div>
              {card.percent && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  card.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{card.isPositive ? '+' : ''}{card.percent}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-4">
            {selectedYear}年 vs {selectedYear - 1}年 同比趋势对比
          </div>
          <div style={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d90ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d90ff" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#999', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e5e5' }}
                />
                <YAxis
                  tick={{ fill: '#999', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : v}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize: 12
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} ${currentEnergy.unit}`,
                    name === 'current' ? `${selectedYear}年` : `${selectedYear - 1}年`
                  ]}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-gray-500">
                      {value === 'current' ? `${selectedYear}年` : `${selectedYear - 1}年`}
                    </span>
                  )}
                  iconType="circle"
                  iconSize={8}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#1d90ff"
                  strokeWidth={2}
                  fill="url(#colorCurrent)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="last"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorLast)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-4">同比增长率统计</div>
          <div className="grid grid-cols-6 gap-3">
            {[
              { month: '1月', rate: '+10.53%' },
              { month: '2月', rate: '+8.57%' },
              { month: '3月', rate: '+9.76%' },
              { month: '4月', rate: '+9.09%' },
              { month: '5月', rate: '+8.33%' },
              { month: '6月', rate: '+11.54%' },
              { month: '7月', rate: '+10.71%' },
              { month: '8月', rate: '+11.32%' },
              { month: '9月', rate: '+10.20%' },
              { month: '10月', rate: '+10.87%' },
              { month: '11月', rate: '+11.63%' },
              { month: '12月', rate: '+12.50%' }
            ].map((item) => (
              <div
                key={item.month}
                className="bg-gray-50 rounded-lg py-3 text-center"
              >
                <div className="text-xs text-gray-500 mb-1">{item.month}</div>
                <div className="text-sm font-medium text-red-500">{item.rate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
