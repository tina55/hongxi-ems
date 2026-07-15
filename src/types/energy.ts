export interface EnergyStats {
  type: 'electric' | 'water' | 'gas' | 'compressedAir' | 'heat';
  current: number;
  previous: number;
  changePercent: number;
  changeValue: number;
  unit: string;
  period: 'today' | 'month' | 'year';
}

export interface TrendData {
  time: string;
  value: number;
  compareValue?: number;
}

export interface TrendDataPoint {
  date: string;
  electric: number;
  water: number;
}

export interface AnalysisData {
  currentPeriod: {
    start: string;
    end: string;
    total: number;
    avg: number;
    peak: number;
  };
  comparePeriod: {
    start: string;
    end: string;
    total: number;
    avg: number;
    peak: number;
  };
  changePercent: number;
  changeValue: number;
}

export interface TeamEnergyData {
  teamId: string;
  teamName: string;
  totalEnergy: number;
  output: number;
  energyPerUnit: number;
  rank: number;
}

export interface ProductEnergyData {
  productId: string;
  productName: string;
  batchNo: string;
  totalEnergy: number;
  output: number;
  energyPerUnit: number;
  stages: {
    name: string;
    energy: number;
    percent: number;
  }[];
}

export interface ProcessEnergyData {
  processId: string;
  processName: string;
  stages: {
    id: string;
    name: string;
    energy: number;
    duration: number;
    efficiency: number;
  }[];
  totalEnergy: number;
}

export interface EnergyOverviewData {
  total: number;
  peak: number;
  avg: number;
  loadRate: number;
}

export interface DistributionData {
  name: string;
  value: number;
  percent: number;
}

export interface RankingData {
  id: string;
  name: string;
  value: number;
  rank: number;
}