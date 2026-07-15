import { TrendingUp, TrendingDown, Zap, Droplets, Flame, Wind, Thermometer, CircleDot, Atom } from 'lucide-react';
import type { EnergyStats } from '@/types/energy';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  data: EnergyStats;
  onClick?: () => void;
  variant?: 'dark' | 'light';
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(1);
}

const typeConfig: Record<string, { icon: typeof Zap; label: string; color: string; bgColor: string; lightColor: string; lightBg: string }> = {
  electric: { icon: Zap, label: '电', color: 'text-[#58a6ff]', bgColor: 'bg-[#58a6ff]/10', lightColor: 'text-blue-600', lightBg: 'bg-blue-50' },
  water: { icon: Droplets, label: '水', color: 'text-[#3fb950]', bgColor: 'bg-[#3fb950]/10', lightColor: 'text-emerald-600', lightBg: 'bg-emerald-50' },
  gas: { icon: Flame, label: '天然气', color: 'text-orange-400', bgColor: 'bg-orange-400/10', lightColor: 'text-orange-600', lightBg: 'bg-orange-50' },
  compressedAir: { icon: Wind, label: '压缩空气', color: 'text-sky-400', bgColor: 'bg-sky-400/10', lightColor: 'text-sky-600', lightBg: 'bg-sky-50' },
  co2: { icon: CircleDot, label: '二氧化碳', color: 'text-red-400', bgColor: 'bg-red-400/10', lightColor: 'text-red-600', lightBg: 'bg-red-50' },
  argon: { icon: Atom, label: '氩气', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10', lightColor: 'text-cyan-600', lightBg: 'bg-cyan-50' },
  heat: { icon: Thermometer, label: '热量', color: 'text-rose-400', bgColor: 'bg-rose-400/10', lightColor: 'text-rose-600', lightBg: 'bg-rose-50' },
};

export function StatCard({ data, onClick, variant = 'dark' }: StatCardProps) {
  const isPositive = data.changePercent > 0;
  const config = typeConfig[data.type] || typeConfig.electric;
  const Icon = config.icon;

  const periodLabel = {
    today: '今日',
    month: '当月',
    year: '当年'
  };

  if (variant === 'light') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full rounded-lg border border-gray-200 p-3 transition-all duration-200 bg-white',
          'hover:border-blue-300 hover:shadow-md'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn('w-6 h-6 rounded flex items-center justify-center', config.lightBg)}>
              <Icon className={cn('w-3 h-3', config.lightColor)} />
            </div>
            <span className="text-xs text-gray-500">{periodLabel[data.period]}用{config.label}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]',
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          )}>
            {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            <span>{data.changePercent.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-800 font-mono">{formatNumber(data.current)}</span>
            <span className="text-[10px] text-gray-400">{data.unit}</span>
          </div>
          <div className="text-[10px] text-gray-400">
            同期: {formatNumber(data.previous)}
            <span className={cn(
              'ml-1',
              isPositive ? 'text-emerald-500' : 'text-red-500'
            )}>
              {isPositive ? '+' : ''}{formatNumber(data.changeValue)}
            </span>
          </div>
        </div>
      </button>
    );
  }

  const gradientClass = data.type === 'electric'
    ? 'from-[#1a3a5c] to-[#0d1f33]'
    : 'from-[#1a3a4c] to-[#0d1f2c]';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border border-[#30363d] p-4 transition-all duration-200',
        'hover:border-[#58a6ff] hover:shadow-lg hover:shadow-[#58a6ff]/10',
        `bg-gradient-to-br ${gradientClass}`
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn(
          'w-5 h-5',
          data.type === 'electric' ? 'text-[#58a6ff]' : 'text-[#3fb950]'
        )} />
        <span className="text-sm text-[#8b949e]">{periodLabel[data.period]}用{config.label}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold text-white font-mono">
          {formatNumber(data.current)}
          <span className="text-sm ml-1">{data.unit}</span>
        </div>
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-md text-sm',
          isPositive ? 'bg-[#238636]/20 text-[#3fb950]' : 'bg-[#da3633]/20 text-[#f85149]'
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>+{data.changePercent.toFixed(2)}%</span>
        </div>
      </div>

      <div className="text-xs text-[#8b949e]">
        同期: {formatNumber(data.previous)}{data.unit}
        <span className={cn(
          'ml-2',
          isPositive ? 'text-[#3fb950]' : 'text-[#f85149]'
        )}>
          +{formatNumber(data.changeValue)}{data.unit}
        </span>
      </div>
    </button>
  );
}
