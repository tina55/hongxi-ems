import type { EnergyStats, EnergyOverviewData, DistributionData, RankingData } from '@/types/energy';

export const electricStatsData: EnergyStats[] = [
  {
    type: 'electric',
    current: 152847.5,
    previous: 148230.2,
    changePercent: 3.12,
    changeValue: 4617.3,
    unit: 'kW·h',
    period: 'today'
  },
  {
    type: 'electric',
    current: 4562312.8,
    previous: 4325678.5,
    changePercent: 5.48,
    changeValue: 236634.3,
    unit: 'kW·h',
    period: 'month'
  },
  {
    type: 'electric',
    current: 52348967.2,
    previous: 48756234.8,
    changePercent: 7.35,
    changeValue: 3592732.4,
    unit: 'kW·h',
    period: 'year'
  }
];

export const waterStatsData: EnergyStats[] = [
  {
    type: 'water',
    current: 1234.5,
    previous: 1180.2,
    changePercent: 4.59,
    changeValue: 54.3,
    unit: 'm³',
    period: 'today'
  },
  {
    type: 'water',
    current: 36897.2,
    previous: 35245.8,
    changePercent: 4.69,
    changeValue: 1651.4,
    unit: 'm³',
    period: 'month'
  },
  {
    type: 'water',
    current: 425678.9,
    previous: 398234.5,
    changePercent: 6.88,
    changeValue: 27444.4,
    unit: 'm³',
    period: 'year'
  }
];

export const electricOverviewData: EnergyOverviewData = {
  total: 4562312.8,
  peak: 2850.6,
  avg: 1520.4,
  loadRate: 68.5
};

export const waterOverviewData: EnergyOverviewData = {
  total: 36897.2,
  peak: 125.6,
  avg: 78.5,
  loadRate: 62.3
};

export const electricDistributionData: DistributionData[] = [
  { name: '涂装车间', value: 1256342.8, percent: 27.5 },
  { name: '激光区', value: 985623.4, percent: 21.6 },
  { name: '压铆区', value: 756234.5, percent: 16.6 },
  { name: '冲压车间', value: 654321.2, percent: 14.3 },
  { name: 'V80车间', value: 523456.7, percent: 11.5 },
  { name: '装配车间', value: 392634.2, percent: 8.6 }
];

export const waterDistributionData: DistributionData[] = [
  { name: '涂装车间', value: 12567.8, percent: 34.0 },
  { name: '激光区', value: 8956.2, percent: 24.3 },
  { name: '压铆区', value: 6543.5, percent: 17.7 },
  { name: '冲压车间', value: 5234.8, percent: 14.2 },
  { name: 'V80车间', value: 2345.7, percent: 6.4 },
  { name: '装配车间', value: 1249.2, percent: 3.4 }
];

export const electricRankingData: RankingData[] = [
  { id: '1', name: '涂装车间', value: 1256342.8, rank: 1 },
  { id: '2', name: '激光区', value: 985623.4, rank: 2 },
  { id: '3', name: '压铆区', value: 756234.5, rank: 3 },
  { id: '4', name: '冲压车间', value: 654321.2, rank: 4 },
  { id: '5', name: 'V80车间', value: 523456.7, rank: 5 }
];

export const waterRankingData: RankingData[] = [
  { id: '1', name: '涂装车间', value: 12567.8, rank: 1 },
  { id: '2', name: '激光区', value: 8956.2, rank: 2 },
  { id: '3', name: '压铆区', value: 6543.5, rank: 3 },
  { id: '4', name: '冲压车间', value: 5234.8, rank: 4 },
  { id: '5', name: 'V80车间', value: 2345.7, rank: 5 }
];