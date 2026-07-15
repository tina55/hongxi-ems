import type { TeamEnergyData, ProductEnergyData, ProcessEnergyData } from '@/types/energy';

export const teamEnergyData: TeamEnergyData[] = [
  {
    teamId: 'team-1',
    teamName: '一班',
    totalEnergy: 1523456.8,
    output: 8500,
    energyPerUnit: 179.23,
    rank: 1
  },
  {
    teamId: 'team-2',
    teamName: '二班',
    totalEnergy: 1485634.2,
    output: 8200,
    energyPerUnit: 182.14,
    rank: 2
  },
  {
    teamId: 'team-3',
    teamName: '三班',
    totalEnergy: 1456234.5,
    output: 7800,
    energyPerUnit: 186.70,
    rank: 3
  },
  {
    teamId: 'team-4',
    teamName: '四班',
    totalEnergy: 1423456.7,
    output: 7500,
    energyPerUnit: 189.79,
    rank: 4
  }
];

export const productEnergyData: ProductEnergyData[] = [
  {
    productId: 'product-1',
    productName: '产品A',
    batchNo: 'A-2024-001',
    totalEnergy: 125634.5,
    output: 500,
    energyPerUnit: 251.27,
    stages: [
      { name: '原材料加工', energy: 25634.5, percent: 20.5 },
      { name: '成型工序', energy: 45634.2, percent: 36.4 },
      { name: '精加工', energy: 35634.5, percent: 28.4 },
      { name: '包装', energy: 18865.3, percent: 15.1 }
    ]
  },
  {
    productId: 'product-2',
    productName: '产品B',
    batchNo: 'B-2024-002',
    totalEnergy: 98562.4,
    output: 350,
    energyPerUnit: 281.60,
    stages: [
      { name: '原材料加工', energy: 18562.4, percent: 18.8 },
      { name: '成型工序', energy: 38562.4, percent: 39.1 },
      { name: '精加工', energy: 28562.4, percent: 29.0 },
      { name: '包装', energy: 11437.6, percent: 11.6 }
    ]
  },
  {
    productId: 'product-3',
    productName: '产品C',
    batchNo: 'C-2024-003',
    totalEnergy: 75623.8,
    output: 200,
    energyPerUnit: 378.12,
    stages: [
      { name: '原材料加工', energy: 12562.4, percent: 16.6 },
      { name: '成型工序', energy: 28562.4, percent: 37.8 },
      { name: '精加工', energy: 22562.4, percent: 29.9 },
      { name: '包装', energy: 11958.6, percent: 15.8 }
    ]
  }
];

export const processEnergyData: ProcessEnergyData[] = [
  {
    processId: 'process-1',
    processName: '涂装工艺',
    totalEnergy: 1256345.8,
    stages: [
      { id: 'stage-1', name: '预处理', energy: 185634.5, duration: 2.5, efficiency: 85.2 },
      { id: 'stage-2', name: '底漆喷涂', energy: 356345.2, duration: 4.2, efficiency: 88.5 },
      { id: 'stage-3', name: '面漆喷涂', energy: 425634.5, duration: 5.0, efficiency: 90.2 },
      { id: 'stage-4', name: '烘干固化', energy: 289731.6, duration: 3.5, efficiency: 92.1 }
    ]
  },
  {
    processId: 'process-2',
    processName: '冲压工艺',
    totalEnergy: 985623.4,
    stages: [
      { id: 'stage-1', name: '材料准备', energy: 125623.4, duration: 1.5, efficiency: 78.5 },
      { id: 'stage-2', name: '冲压成型', energy: 525623.4, duration: 6.0, efficiency: 82.3 },
      { id: 'stage-3', name: '修整处理', energy: 234523.4, duration: 2.5, efficiency: 85.6 },
      { id: 'stage-4', name: '质量检验', energy: 100253.2, duration: 1.0, efficiency: 95.2 }
    ]
  }
];