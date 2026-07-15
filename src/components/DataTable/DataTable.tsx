import type { RankingData } from '@/types/energy';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface DataTableProps {
  data: RankingData[];
  title?: string;
  columns?: { key: string; label: string; format?: (value: number) => string }[];
}

export function DataTable({ data, title, columns }: DataTableProps) {
  const defaultColumns = [
    { key: 'rank', label: '排名' },
    { key: 'name', label: '名称' },
    {
      key: 'value',
      label: '用电量(kW·h)',
      format: (v: number) => v.toFixed(2)
    }
  ];

  const tableColumns = columns || defaultColumns;

  return (
    <>
      {title && (
        <div className="text-sm font-medium text-[#8b949e] mb-4">{title}</div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#30363d]">
            {tableColumns.map((col) => (
              <th
                key={col.key}
                className="text-left py-2 text-sm font-medium text-[#8b949e]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-[#30363d] last:border-b-0',
                index % 2 === 0 ? 'bg-[#0d1117]' : 'bg-[#161b22]'
              )}
            >
              {tableColumns.map((col) => (
                <td key={col.key} className="py-2 text-sm text-[#c9d1d9]">
                  {col.format
                    ? col.format(row[col.key as keyof RankingData] as number)
                    : row[col.key as keyof RankingData]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}