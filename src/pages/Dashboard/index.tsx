import { useState, useEffect } from 'react';
import { StatCard } from '@/components/StatCard/StatCard';
import { PieChart } from '@/components/Chart/PieChart';
import { useEnergyStore } from '@/store/energyStore';
import { dashboardTrendData, workshopDistributionData, workshopEnergyData } from '@/data/trendData';
import { TrendingUp, Factory, Clock, Building2, Zap, Droplets, Flame, Wind, CircleDot, Atom, Thermometer } from 'lucide-react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const energyTypeConfig = {
  electric: { icon: Zap, label: '电', unit: 'kWh', color: '#3b82f6' },
  water: { icon: Droplets, label: '水', unit: 'm³', color: '#10b981' },
  gas: { icon: Flame, label: '天然气', unit: 'm³', color: '#f59e0b' },
  compressedAir: { icon: Wind, label: '压缩空气', unit: 'm³', color: '#06b6d4' },
  co2: { icon: CircleDot, label: '二氧化碳', unit: 'kg', color: '#ef4444' },
  argon: { icon: Atom, label: '氩气', unit: 'm³', color: '#8b5cf6' },
  heat: { icon: Thermometer, label: '热量', unit: 'GJ', color: '#ec4899' }
};

const workshopConfig = {
  paintShop: { name: '涂装车间', types: ['electric', 'water', 'gas', 'compressedAir', 'heat'] as const },
  cncShop: { name: '数控车间', types: ['electric', 'compressedAir', 'co2'] as const },
  stampingShop: { name: '冲压车间', types: ['electric', 'compressedAir', 'water'] as const },
  v80Shop: { name: 'V80车间', types: ['electric', 'compressedAir', 'argon'] as const },
  integratedShop: { name: '集成车间', types: ['electric', 'compressedAir', 'argon', 'water'] as const }
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(1);
}

function WorkshopEnergyCard({ workshopKey, workshop }: { workshopKey: keyof typeof workshopConfig; workshop: typeof workshopConfig[keyof typeof workshopConfig] }) {
  const data = workshopEnergyData[workshopKey];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-[#10469c]" />
        <h3 className="text-sm font-semibold text-gray-800">{workshop.name}</h3>
      </div>
      
      <div className="space-y-2">
        {workshop.types.map((type) => {
          const config = energyTypeConfig[type];
          const Icon = config.icon;
          return (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                <span className="text-xs text-gray-600">{config.label}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">今日</div>
                  <div className="font-medium text-gray-800">{formatNumber(data.today[type])}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">当月</div>
                  <div className="font-medium text-gray-800">{formatNumber(data.month[type])}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400">当年</div>
                  <div className="font-medium text-gray-800">{formatNumber(data.year[type])}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { timeRange } = useEnergyStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { type: 'electric' as const, period: 'today' as const, current: 12580, previous: 11200, changePercent: 12.3, changeValue: 1380, unit: 'kWh' },
    { type: 'water' as const, period: 'today' as const, current: 856, previous: 920, changePercent: -7.0, changeValue: -64, unit: 'm³' },
    { type: 'gas' as const, period: 'today' as const, current: 2340, previous: 2100, changePercent: 11.4, changeValue: 240, unit: 'm³' },
    { type: 'compressedAir' as const, period: 'today' as const, current: 5680, previous: 5200, changePercent: 9.2, changeValue: 480, unit: 'm³' },
    { type: 'co2' as const, period: 'today' as const, current: 320, previous: 295, changePercent: 8.5, changeValue: 25, unit: 'kg' },
    { type: 'argon' as const, period: 'today' as const, current: 450, previous: 410, changePercent: 9.8, changeValue: 40, unit: 'm³' },
    { type: 'heat' as const, period: 'today' as const, current: 45.6, previous: 42.1, changePercent: 8.3, changeValue: 3.5, unit: 'GJ' },
  ];

  const monthStats = [
    { type: 'electric' as const, period: 'month' as const, current: 358200, previous: 336000, changePercent: 6.6, changeValue: 22200, unit: 'kWh' },
    { type: 'water' as const, period: 'month' as const, current: 24560, previous: 25200, changePercent: -2.5, changeValue: -640, unit: 'm³' },
    { type: 'gas' as const, period: 'month' as const, current: 67800, previous: 62000, changePercent: 9.4, changeValue: 5800, unit: 'm³' },
    { type: 'compressedAir' as const, period: 'month' as const, current: 156800, previous: 148000, changePercent: 5.9, changeValue: 8800, unit: 'm³' },
    { type: 'co2' as const, period: 'month' as const, current: 9600, previous: 8900, changePercent: 7.9, changeValue: 700, unit: 'kg' },
    { type: 'argon' as const, period: 'month' as const, current: 13500, previous: 12400, changePercent: 8.9, changeValue: 1100, unit: 'm³' },
    { type: 'heat' as const, period: 'month' as const, current: 1280, previous: 1190, changePercent: 7.6, changeValue: 90, unit: 'GJ' },
  ];

  const yearStats = [
    { type: 'electric' as const, period: 'year' as const, current: 42500000, previous: 39800000, changePercent: 6.8, changeValue: 2700000, unit: 'kWh' },
    { type: 'water' as const, period: 'year' as const, current: 295600, previous: 282000, changePercent: 4.8, changeValue: 13600, unit: 'm³' },
    { type: 'gas' as const, period: 'year' as const, current: 825000, previous: 768000, changePercent: 7.4, changeValue: 57000, unit: 'm³' },
    { type: 'compressedAir' as const, period: 'year' as const, current: 2850000, previous: 2680000, changePercent: 6.3, changeValue: 170000, unit: 'm³' },
    { type: 'co2' as const, period: 'year' as const, current: 112000, previous: 105000, changePercent: 6.7, changeValue: 7000, unit: 'kg' },
    { type: 'argon' as const, period: 'year' as const, current: 165000, previous: 154000, changePercent: 7.1, changeValue: 11000, unit: 'm³' },
    { type: 'heat' as const, period: 'year' as const, current: 445000, previous: 418000, changePercent: 6.5, changeValue: 27000, unit: 'GJ' },
  ];

  const energyKeys = ['electric', 'water', 'gas', 'compressedAir', 'co2', 'argon', 'heat'] as const;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">首页概览</h1>
          <p className="text-sm text-gray-400 mt-1">实时监控厂区能源消耗情况</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleString('zh-CN')}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#10469c]" />
          <h2 className="text-lg font-semibold text-gray-800">今日用能概览</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={`today-${index}`} data={stat} variant="light" />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="w-5 h-5 text-[#10469c]" />
          <h2 className="text-lg font-semibold text-gray-800">当月用能概览</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {monthStats.map((stat, index) => (
            <StatCard key={`month-${index}`} data={stat} variant="light" />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="w-5 h-5 text-[#10469c]" />
          <h2 className="text-lg font-semibold text-gray-800">当年用能概览</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {yearStats.map((stat, index) => (
            <StatCard key={`year-${index}`} data={stat} variant="light" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">能耗趋势分析</h3>
            <div className="flex items-center gap-4 text-sm">
              {energyKeys.map(key => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: energyTypeConfig[key].color }} />
                  {energyTypeConfig[key].label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart data={dashboardTrendData}>
              <defs>
                {energyKeys.map(key => (
                  <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={energyTypeConfig[key].color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={energyTypeConfig[key].color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#999', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e5e5' }}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: 12
                }}
                formatter={(value: number, name: string) => {
                  const config = energyTypeConfig[name as keyof typeof energyTypeConfig];
                  return [`${value.toLocaleString()} ${config?.unit || ''}`, config?.label || name];
                }}
              />
              <Legend
                formatter={(value: string) => {
                  const config = energyTypeConfig[value as keyof typeof energyTypeConfig];
                  return <span className="text-xs text-gray-600">{config?.label || value}</span>;
                }}
                iconType="circle"
                iconSize={8}
              />
              {energyKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={energyTypeConfig[key].color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={i === 0 ? `url(#color-${key})` : 'none'}
                  dot={{ r: 2, fill: '#fff', stroke: energyTypeConfig[key].color, strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: energyTypeConfig[key].color, stroke: '#fff', strokeWidth: 2 }}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">车间能耗分布</h3>
          <PieChart data={workshopDistributionData} height={280} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-[#10469c]" />
          <h2 className="text-lg font-semibold text-gray-800">车间用能统计</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <WorkshopEnergyCard workshopKey="paintShop" workshop={workshopConfig.paintShop} />
          <WorkshopEnergyCard workshopKey="cncShop" workshop={workshopConfig.cncShop} />
          <WorkshopEnergyCard workshopKey="stampingShop" workshop={workshopConfig.stampingShop} />
          <WorkshopEnergyCard workshopKey="v80Shop" workshop={workshopConfig.v80Shop} />
          <WorkshopEnergyCard workshopKey="integratedShop" workshop={workshopConfig.integratedShop} />
        </div>
      </div>
    </div>
  );
}