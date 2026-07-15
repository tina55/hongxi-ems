export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  category: string;
  values: { name: string; value: number }[];
}

export interface LineChartData {
  time: string;
  [key: string]: number | string;
}

export interface ChartConfig {
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  height?: number;
}