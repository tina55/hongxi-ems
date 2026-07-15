import { useEnergyStore } from '@/store/energyStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface TimeSelectorProps {
  options?: { value: string; label: string }[];
  variant?: 'dark' | 'light';
}

export function TimeSelector({ options, variant = 'dark' }: TimeSelectorProps) {
  const { timeRange, setTimeRange } = useEnergyStore();

  const defaultOptions = [
    { value: 'day', label: '当日' },
    { value: 'month', label: '当月' },
    { value: 'year', label: '当年' }
  ];

  const timeOptions = options || defaultOptions;

  if (variant === 'light') {
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg border border-gray-200 p-1">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as 'day' | 'month' | 'year')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              timeRange === option.value
                ? 'bg-white text-[#10469c] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#161b22] rounded-lg border border-[#30363d] p-1">
      {timeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTimeRange(option.value as 'day' | 'month' | 'year')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            timeRange === option.value
              ? 'bg-[#21262d] text-[#58a6ff]'
              : 'text-[#8b949e] hover:text-[#c9d1d9]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}