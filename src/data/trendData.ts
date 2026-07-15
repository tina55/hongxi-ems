import type { TrendData, TrendDataPoint } from '@/types/energy';

// 生成小时数据的辅助函数
function generateHourlyData(baseValue: number, variance: number): TrendData[] {
  const data: TrendData[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    const value = baseValue + Math.random() * variance - variance / 2;
    data.push({ time: hour, value: Math.round(value * 100) / 100 });
  }
  return data;
}

// 生成日电量数据的辅助函数
function generateDailyData(baseValue: number, variance: number): TrendData[] {
  const data: TrendData[] = [];
  for (let i = 1; i <= 30; i++) {
    const day = i.toString().padStart(2, '0');
    const value = baseValue + Math.random() * variance - variance / 2;
    data.push({ time: day, value: Math.round(value * 100) / 100 });
  }
  return data;
}

// 生成月度数据的辅助函数
function generateMonthlyData(baseValue: number, variance: number): TrendData[] {
  const data: TrendData[] = [];
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  for (const month of months) {
    const value = baseValue + Math.random() * variance - variance / 2;
    data.push({ time: month + '月', value: Math.round(value * 100) / 100 });
  }
  return data;
}

export const hourlyPowerData: TrendData[] = generateHourlyData(1520, 500);

export const dailyElectricTrendData: TrendData[] = generateDailyData(150000, 20000);
export const dailyWaterTrendData: TrendData[] = generateDailyData(1200, 200);
export const dailyGasTrendData: TrendData[] = generateDailyData(2500, 300);
export const dailyCompressedAirTrendData: TrendData[] = generateDailyData(8500, 1200);
export const dailyCo2TrendData: TrendData[] = generateDailyData(320, 50);
export const dailyArgonTrendData: TrendData[] = generateDailyData(450, 80);
export const dailyHeatTrendData: TrendData[] = generateDailyData(1250, 200);

export const monthlyElectricTrendData: TrendData[] = generateMonthlyData(4500000, 300000);
export const monthlyWaterTrendData: TrendData[] = generateMonthlyData(35000, 5000);
export const monthlyGasTrendData: TrendData[] = generateMonthlyData(75000, 8000);
export const monthlyCompressedAirTrendData: TrendData[] = generateMonthlyData(255000, 30000);
export const monthlyCo2TrendData: TrendData[] = generateMonthlyData(9600, 1200);
export const monthlyArgonTrendData: TrendData[] = generateMonthlyData(13500, 1800);
export const monthlyHeatTrendData: TrendData[] = generateMonthlyData(37500, 4500);

export const yearlyElectricTrendData: TrendData[] = [
  { time: '2022年', value: 45000000 },
  { time: '2023年', value: 47562348 },
  { time: '2024年', value: 52348967 },
  { time: '2025年', value: 56892345 }
];

export const yearlyWaterTrendData: TrendData[] = [
  { time: '2022年', value: 380000 },
  { time: '2023年', value: 398234 },
  { time: '2024年', value: 425678 },
  { time: '2025年', value: 452345 }
];

export const yearlyGasTrendData: TrendData[] = [
  { time: '2022年', value: 850000 },
  { time: '2023年', value: 892345 },
  { time: '2024年', value: 956789 },
  { time: '2025年', value: 1023456 }
];

export const yearlyCompressedAirTrendData: TrendData[] = [
  { time: '2022年', value: 2800000 },
  { time: '2023年', value: 2956789 },
  { time: '2024年', value: 3189234 },
  { time: '2025年', value: 3423456 }
];

export const yearlyCo2TrendData: TrendData[] = [
  { time: '2022年', value: 105000 },
  { time: '2023年', value: 112345 },
  { time: '2024年', value: 118923 },
  { time: '2025年', value: 125678 }
];

export const yearlyArgonTrendData: TrendData[] = [
  { time: '2022年', value: 145000 },
  { time: '2023年', value: 152345 },
  { time: '2024年', value: 161234 },
  { time: '2025年', value: 172345 }
];

export const yearlyHeatTrendData: TrendData[] = [
  { time: '2022年', value: 420000 },
  { time: '2023年', value: 445678 },
  { time: '2024年', value: 478923 },
  { time: '2025年', value: 512345 }
];

// 双能源趋势数据
export const combinedDailyTrendData: TrendDataPoint[] = dailyElectricTrendData.map((item, index) => ({
  date: item.time,
  electric: item.value,
  water: dailyWaterTrendData[index]?.value || 0
}));

export const combinedMonthlyTrendData: TrendDataPoint[] = monthlyElectricTrendData.map((item, index) => ({
  date: item.time,
  electric: item.value,
  water: monthlyWaterTrendData[index]?.value || 0
}));

// 同比对比数据
export const electricYoyData: TrendData[] = monthlyElectricTrendData.map((item, index) => ({
  time: item.time,
  value: item.value,
  compareValue: item.value * 0.92
}));

export const waterYoyData: TrendData[] = monthlyWaterTrendData.map((item, index) => ({
  time: item.time,
  value: item.value,
  compareValue: item.value * 0.93
}));

// 环比对比数据
export const electricMomData: TrendData[] = generateDailyData(150000, 15000).map((item, index) => ({
  time: item.time,
  value: item.value,
  compareValue: item.value * (0.95 + Math.random() * 0.1)
}));

export const waterMomData: TrendData[] = generateDailyData(1200, 150).map((item, index) => ({
  time: item.time,
  value: item.value,
  compareValue: item.value * (0.92 + Math.random() * 0.15)
}));

export const dashboardTrendData: Array<{ time: string; electric: number; water: number; gas: number; compressedAir: number; co2: number; argon: number; heat: number }> = [];
for (let i = 1; i <= 30; i++) {
  const day = i.toString().padStart(2, '0');
  dashboardTrendData.push({
    time: day + '日',
    electric: Math.round((150000 + Math.random() * 20000) * 100) / 100,
    water: Math.round((1200 + Math.random() * 200) * 100) / 100,
    gas: Math.round((2500 + Math.random() * 300) * 100) / 100,
    compressedAir: Math.round((8500 + Math.random() * 1200) * 100) / 100,
    co2: Math.round((320 + Math.random() * 50) * 100) / 100,
    argon: Math.round((450 + Math.random() * 80) * 100) / 100,
    heat: Math.round((1250 + Math.random() * 200) * 100) / 100
  });
}

export const powerCurveData: Array<{ time: string; electric: number; water: number; gas: number; compressedAir: number; co2: number; argon: number; heat: number }> = [];
for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, '0') + ':00';
  powerCurveData.push({
    time: hour,
    electric: Math.round((800 + Math.random() * 400) * 10) / 10,
    water: Math.round((20 + Math.random() * 10) * 10) / 10,
    gas: Math.round((50 + Math.random() * 30) * 10) / 10,
    compressedAir: Math.round((120 + Math.random() * 40) * 10) / 10,
    co2: Math.round((15 + Math.random() * 5) * 10) / 10,
    argon: Math.round((8 + Math.random() * 3) * 10) / 10,
    heat: Math.round((25 + Math.random() * 10) * 10) / 10
  });
}

export const workshopEnergyData: Record<string, { today: Record<string, number>; month: Record<string, number>; year: Record<string, number> }> = {
  paintShop: {
    today: { electric: 35200, water: 280, gas: 680, compressedAir: 2200, heat: 320 },
    month: { electric: 980000, water: 8200, gas: 19800, compressedAir: 65000, heat: 9500 },
    year: { electric: 11500000, water: 98000, gas: 235000, compressedAir: 780000, heat: 112000 }
  },
  cncShop: {
    today: { electric: 42500, compressedAir: 1800, co2: 95 },
    month: { electric: 1200000, compressedAir: 52000, co2: 2780 },
    year: { electric: 14200000, compressedAir: 620000, co2: 33000 }
  },
  stampingShop: {
    today: { electric: 18500, compressedAir: 1200, water: 150 },
    month: { electric: 520000, compressedAir: 35000, water: 4400 },
    year: { electric: 6200000, compressedAir: 420000, water: 52000 }
  },
  v80Shop: {
    today: { electric: 12800, compressedAir: 950, argon: 120 },
    month: { electric: 365000, compressedAir: 27500, argon: 3500 },
    year: { electric: 4350000, compressedAir: 330000, argon: 42000 }
  },
  integratedShop: {
    today: { electric: 25200, compressedAir: 1500, argon: 85, water: 220 },
    month: { electric: 715000, compressedAir: 44000, argon: 2500, water: 6500 },
    year: { electric: 8500000, compressedAir: 525000, argon: 30000, water: 78000 }
  }
};

export const workshopDistributionData: Array<{ name: string; value: number; percent: number }> = [
  { name: '数控车间', value: 285000, percent: 33 },
  { name: '涂装车间', value: 245000, percent: 28 },
  { name: '冲压车间', value: 135000, percent: 16 },
  { name: '集成车间', value: 120000, percent: 14 },
  { name: 'V80车间', value: 80000, percent: 9 }
];