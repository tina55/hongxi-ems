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
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

type EnergyType = 'electric' | 'water' | 'gas' | 'compressedAir' | 'co2' | 'argon' | 'energyMeter';
type TimeRange = 'day' | 'week' | 'month' | 'year';

const energyTypes: { key: EnergyType; label: string; unit: string }[] = [
  { key: 'electric', label: '电', unit: 'kW·h' },
  { key: 'water', label: '水', unit: 'm³' },
  { key: 'gas', label: '天然气', unit: 'm³' },
  { key: 'compressedAir', label: '压缩空气', unit: 'm³' },
  { key: 'co2', label: '二氧化碳', unit: 'kg' },
  { key: 'argon', label: '氩气', unit: 'm³' },
  { key: 'energyMeter', label: '能量计', unit: 'GJ' }
];

const momData: Record<EnergyType, { time: string; current: number; last: number }[]> = {
  electric: [
    { time: '1日', current: 152000, last: 148000 },
    { time: '2日', current: 148500, last: 145000 },
    { time: '3日', current: 156000, last: 150000 },
    { time: '4日', current: 162000, last: 155000 },
    { time: '5日', current: 158000, last: 152000 },
    { time: '6日', current: 145000, last: 140000 },
    { time: '7日', current: 138000, last: 135000 },
    { time: '8日', current: 155000, last: 150000 },
    { time: '9日', current: 160000, last: 156000 },
    { time: '10日', current: 165000, last: 158000 },
    { time: '11日', current: 158000, last: 154000 },
    { time: '12日', current: 152000, last: 149000 },
    { time: '13日', current: 148000, last: 146000 },
    { time: '14日', current: 145000, last: 142000 },
    { time: '15日', current: 150000, last: 148000 },
    { time: '16日', current: 155000, last: 151000 },
    { time: '17日', current: 158000, last: 154000 },
    { time: '18日', current: 160000, last: 156000 },
    { time: '19日', current: 156000, last: 152000 },
    { time: '20日', current: 150000, last: 148000 },
    { time: '21日', current: 148000, last: 145000 },
    { time: '22日', current: 145000, last: 143000 },
    { time: '23日', current: 152000, last: 149000 },
    { time: '24日', current: 158000, last: 154000 },
    { time: '25日', current: 160000, last: 155000 },
    { time: '26日', current: 155000, last: 151000 },
    { time: '27日', current: 150000, last: 147000 },
    { time: '28日', current: 148000, last: 145000 },
    { time: '29日', current: 152000, last: 149000 },
    { time: '30日', current: 149000, last: 146000 }
  ],
  water: [
    { time: '1日', current: 856, last: 812 },
    { time: '2日', current: 832, last: 792 },
    { time: '3日', current: 876, last: 832 },
    { time: '4日', current: 902, last: 856 },
    { time: '5日', current: 882, last: 838 },
    { time: '6日', current: 818, last: 776 },
    { time: '7日', current: 782, last: 742 },
    { time: '8日', current: 868, last: 822 },
    { time: '9日', current: 892, last: 846 },
    { time: '10日', current: 918, last: 870 },
    { time: '11日', current: 886, last: 840 },
    { time: '12日', current: 856, last: 812 },
    { time: '13日', current: 836, last: 794 },
    { time: '14日', current: 818, last: 776 },
    { time: '15日', current: 846, last: 802 },
    { time: '16日', current: 872, last: 826 },
    { time: '17日', current: 888, last: 842 },
    { time: '18日', current: 904, last: 858 },
    { time: '19日', current: 878, last: 832 },
    { time: '20日', current: 848, last: 804 },
    { time: '21日', current: 832, last: 790 },
    { time: '22日', current: 814, last: 772 },
    { time: '23日', current: 852, last: 808 },
    { time: '24日', current: 884, last: 838 },
    { time: '25日', current: 900, last: 854 },
    { time: '26日', current: 870, last: 824 },
    { time: '27日', current: 844, last: 800 },
    { time: '28日', current: 830, last: 788 },
    { time: '29日', current: 854, last: 810 },
    { time: '30日', current: 838, last: 796 }
  ],
  gas: [
    { time: '1日', current: 1256, last: 1180 },
    { time: '2日', current: 1226, last: 1152 },
    { time: '3日', current: 1288, last: 1208 },
    { time: '4日', current: 1322, last: 1240 },
    { time: '5日', current: 1296, last: 1216 },
    { time: '6日', current: 1220, last: 1146 },
    { time: '7日', current: 1172, last: 1102 },
    { time: '8日', current: 1276, last: 1196 },
    { time: '9日', current: 1306, last: 1224 },
    { time: '10日', current: 1342, last: 1258 },
    { time: '11日', current: 1298, last: 1218 },
    { time: '12日', current: 1260, last: 1180 },
    { time: '13日', current: 1232, last: 1154 },
    { time: '14日', current: 1210, last: 1134 },
    { time: '15日', current: 1246, last: 1166 },
    { time: '16日', current: 1278, last: 1198 },
    { time: '17日', current: 1302, last: 1220 },
    { time: '18日', current: 1326, last: 1242 },
    { time: '19日', current: 1300, last: 1218 },
    { time: '20日', current: 1248, last: 1168 },
    { time: '21日', current: 1228, last: 1150 },
    { time: '22日', current: 1206, last: 1128 },
    { time: '23日', current: 1252, last: 1172 },
    { time: '24日', current: 1296, last: 1216 },
    { time: '25日', current: 1322, last: 1240 },
    { time: '26日', current: 1276, last: 1196 },
    { time: '27日', current: 1244, last: 1166 },
    { time: '28日', current: 1224, last: 1146 },
    { time: '29日', current: 1256, last: 1176 },
    { time: '30日', current: 1240, last: 1160 }
  ],
  compressedAir: [
    { time: '1日', current: 8560, last: 8120 },
    { time: '2日', current: 8320, last: 7900 },
    { time: '3日', current: 8760, last: 8320 },
    { time: '4日', current: 9020, last: 8560 },
    { time: '5日', current: 8820, last: 8380 },
    { time: '6日', current: 8180, last: 7760 },
    { time: '7日', current: 7820, last: 7420 },
    { time: '8日', current: 8680, last: 8220 },
    { time: '9日', current: 8920, last: 8460 },
    { time: '10日', current: 9180, last: 8700 },
    { time: '11日', current: 8860, last: 8400 },
    { time: '12日', current: 8560, last: 8120 },
    { time: '13日', current: 8360, last: 7940 },
    { time: '14日', current: 8180, last: 7760 },
    { time: '15日', current: 8460, last: 8020 },
    { time: '16日', current: 8720, last: 8260 },
    { time: '17日', current: 8880, last: 8420 },
    { time: '18日', current: 9040, last: 8580 },
    { time: '19日', current: 8780, last: 8320 },
    { time: '20日', current: 8480, last: 8040 },
    { time: '21日', current: 8320, last: 7900 },
    { time: '22日', current: 8140, last: 7720 },
    { time: '23日', current: 8520, last: 8080 },
    { time: '24日', current: 8840, last: 8380 },
    { time: '25日', current: 9000, last: 8540 },
    { time: '26日', current: 8700, last: 8240 },
    { time: '27日', current: 8440, last: 8000 },
    { time: '28日', current: 8300, last: 7880 },
    { time: '29日', current: 8540, last: 8100 },
    { time: '30日', current: 8380, last: 7960 }
  ],
  co2: [
    { time: '1日', current: 325, last: 308 },
    { time: '2日', current: 316, last: 300 },
    { time: '3日', current: 334, last: 316 },
    { time: '4日', current: 344, last: 326 },
    { time: '5日', current: 336, last: 318 },
    { time: '6日', current: 314, last: 298 },
    { time: '7日', current: 300, last: 284 },
    { time: '8日', current: 330, last: 312 },
    { time: '9日', current: 340, last: 322 },
    { time: '10日', current: 350, last: 332 },
    { time: '11日', current: 338, last: 320 },
    { time: '12日', current: 326, last: 308 },
    { time: '13日', current: 318, last: 300 },
    { time: '14日', current: 312, last: 294 },
    { time: '15日', current: 322, last: 304 },
    { time: '16日', current: 332, last: 314 },
    { time: '17日', current: 338, last: 320 },
    { time: '18日', current: 344, last: 326 },
    { time: '19日', current: 336, last: 318 },
    { time: '20日', current: 324, last: 306 },
    { time: '21日', current: 318, last: 300 },
    { time: '22日', current: 312, last: 294 },
    { time: '23日', current: 324, last: 306 },
    { time: '24日', current: 336, last: 318 },
    { time: '25日', current: 344, last: 326 },
    { time: '26日', current: 330, last: 312 },
    { time: '27日', current: 322, last: 304 },
    { time: '28日', current: 316, last: 298 },
    { time: '29日', current: 326, last: 308 },
    { time: '30日', current: 320, last: 302 }
  ],
  argon: [
    { time: '1日', current: 456, last: 428 },
    { time: '2日', current: 444, last: 416 },
    { time: '3日', current: 468, last: 438 },
    { time: '4日', current: 480, last: 450 },
    { time: '5日', current: 470, last: 440 },
    { time: '6日', current: 438, last: 410 },
    { time: '7日', current: 420, last: 392 },
    { time: '8日', current: 464, last: 434 },
    { time: '9日', current: 476, last: 446 },
    { time: '10日', current: 490, last: 458 },
    { time: '11日', current: 472, last: 442 },
    { time: '12日', current: 456, last: 428 },
    { time: '13日', current: 446, last: 418 },
    { time: '14日', current: 436, last: 408 },
    { time: '15日', current: 452, last: 424 },
    { time: '16日', current: 466, last: 436 },
    { time: '17日', current: 474, last: 444 },
    { time: '18日', current: 482, last: 452 },
    { time: '19日', current: 470, last: 440 },
    { time: '20日', current: 454, last: 426 },
    { time: '21日', current: 446, last: 418 },
    { time: '22日', current: 436, last: 408 },
    { time: '23日', current: 454, last: 426 },
    { time: '24日', current: 470, last: 440 },
    { time: '25日', current: 480, last: 450 },
    { time: '26日', current: 464, last: 434 },
    { time: '27日', current: 450, last: 422 },
    { time: '28日', current: 444, last: 416 },
    { time: '29日', current: 456, last: 428 },
    { time: '30日', current: 450, last: 422 }
  ],
  energyMeter: [
    { time: '1日', current: 1256, last: 1180 },
    { time: '2日', current: 1226, last: 1152 },
    { time: '3日', current: 1288, last: 1208 },
    { time: '4日', current: 1322, last: 1240 },
    { time: '5日', current: 1296, last: 1216 },
    { time: '6日', current: 1220, last: 1146 },
    { time: '7日', current: 1172, last: 1102 },
    { time: '8日', current: 1276, last: 1196 },
    { time: '9日', current: 1306, last: 1224 },
    { time: '10日', current: 1342, last: 1258 },
    { time: '11日', current: 1298, last: 1218 },
    { time: '12日', current: 1260, last: 1180 },
    { time: '13日', current: 1232, last: 1154 },
    { time: '14日', current: 1210, last: 1134 },
    { time: '15日', current: 1246, last: 1166 },
    { time: '16日', current: 1278, last: 1198 },
    { time: '17日', current: 1302, last: 1220 },
    { time: '18日', current: 1326, last: 1242 },
    { time: '19日', current: 1300, last: 1218 },
    { time: '20日', current: 1248, last: 1168 },
    { time: '21日', current: 1228, last: 1150 },
    { time: '22日', current: 1206, last: 1128 },
    { time: '23日', current: 1252, last: 1172 },
    { time: '24日', current: 1296, last: 1216 },
    { time: '25日', current: 1322, last: 1240 },
    { time: '26日', current: 1276, last: 1196 },
    { time: '27日', current: 1244, last: 1166 },
    { time: '28日', current: 1224, last: 1146 },
    { time: '29日', current: 1256, last: 1176 },
    { time: '30日', current: 1240, last: 1160 }
  ]
};

const energyStatsData: Record<EnergyType, { node: string; today: number; yesterday: number }[]> = {
  electric: [
    { node: '宏奥厂区', today: 156231.28, yesterday: 148567.85 },
    { node: '涂装车间', today: 32156.5, yesterday: 30892.3 },
    { node: '涂装车间', today: 32231.8, yesterday: 30156.7 },
    { node: '数控车间', today: 45231.8, yesterday: 42156.7 },
    { node: 'CNC加工区', today: 18562.3, yesterday: 17234.5 },
    { node: 'SCDL-001电表', today: 8234.5, yesterday: 7656.3 },
    { node: 'SCDL-001-分电表', today: 4523.5, yesterday: 7234.6 },
    { node: 'SCDL-001-分电表', today: 4523.8, yesterday: 4234.6 },
    { node: '激光区', today: 12345.6, yesterday: 11567.8 },
    { node: '压铆区', today: 8923.4, yesterday: 8356.2 },
    { node: '压铆区', today: 8923.4, yesterday: 8356.2 },
    { node: '冲压车间', today: 28567.9, yesterday: 27234.6 },
    { node: 'V80车间', today: 35234.5, yesterday: 33892.3 },
    { node: '集成车间', today: 15040.58, yesterday: 14391.95 },
    { node: '集成车间', today: 15040.58, yesterday: 14391.95 },
    { node: 'UB线体产线电表', today: 5234.5, yesterday: 4987.6 },
    { node: 'MB线体产线电表', today: 4892.3, yesterday: 4656.8 },
    { node: '打磨房电表', today: 4913.78, yesterday: 4747.55 },
    { node: '打磨房电表', today: 4913.78, yesterday: 4747.55 }
  ],
  water: [
    { node: '宏奥厂区', today: 856.2, yesterday: 812.5 },
    { node: '涂装车间', today: 185.6, yesterday: 176.2 },
    { node: '涂装车间', today: 188.3, yesterday: 168.5 },
    { node: '数控车间', today: 265.8, yesterday: 248.3 },
    { node: 'CNC加工区', today: 108.5, yesterday: 102.3 },
    { node: 'SCDL-001水表', today: 48.3, yesterday: 45.2 },
    { node: 'SCDL-001-分水表', today: 26.8, yesterday: 25.1 },
    { node: 'SCDL-001-分水表', today: 26.5, yesterday: 24.6 },
    { node: '激光区', today: 72.5, yesterday: 68.3 },
    { node: '压铆区', today: 52.3, yesterday: 49.5 },
    { node: '压铆区', today: 52.3, yesterday: 49.5 },
    { node: '冲压车间', today: 168.5, yesterday: 158.3 },
    { node: 'V80车间', today: 208.5, yesterday: 196.2 },
    { node: '集成车间', today: 88.5, yesterday: 84.3 },
    { node: '集成车间', today: 88.5, yesterday: 84.3 },
    { node: 'UB线体产线水表', today: 30.8, yesterday: 29.2 },
    { node: 'MB线体产线水表', today: 28.5, yesterday: 27.1 },
    { node: '打磨房水表', today: 28.8, yesterday: 27.5 },
    { node: '打磨房水表', today: 28.8, yesterday: 27.5 }
  ],
  gas: [
    { node: '宏奥厂区', today: 1256.8, yesterday: 1180.5 },
    { node: '涂装车间', today: 285.6, yesterday: 268.3 },
    { node: '涂装车间', today: 288.3, yesterday: 258.5 },
    { node: '数控车间', today: 385.8, yesterday: 358.3 },
    { node: 'CNC加工区', today: 158.5, yesterday: 148.3 },
    { node: 'SCDL-001气表', today: 72.3, yesterday: 68.2 },
    { node: 'SCDL-001-分气表', today: 40.8, yesterday: 38.1 },
    { node: 'SCDL-001-分气表', today: 40.5, yesterday: 37.6 },
    { node: '激光区', today: 108.5, yesterday: 101.3 },
    { node: '压铆区', today: 78.3, yesterday: 73.5 },
    { node: '压铆区', today: 78.3, yesterday: 73.5 },
    { node: '冲压车间', today: 252.5, yesterday: 236.3 },
    { node: 'V80车间', today: 312.5, yesterday: 294.2 },
    { node: '集成车间', today: 132.5, yesterday: 124.3 },
    { node: '集成车间', today: 132.5, yesterday: 124.3 },
    { node: 'UB线体产线气表', today: 46.8, yesterday: 44.2 },
    { node: 'MB线体产线气表', today: 42.5, yesterday: 40.1 },
    { node: '打磨房气表', today: 43.8, yesterday: 41.5 },
    { node: '打磨房气表', today: 43.8, yesterday: 41.5 }
  ],
  compressedAir: [
    { node: '宏奥厂区', today: 8560.5, yesterday: 8120.3 },
    { node: '涂装车间', today: 1856.2, yesterday: 1762.5 },
    { node: '涂装车间', today: 1883.5, yesterday: 1685.2 },
    { node: '数控车间', today: 2658.3, yesterday: 2483.6 },
    { node: 'CNC加工区', today: 1085.6, yesterday: 1023.8 },
    { node: 'SCDL-001空压表', today: 483.2, yesterday: 452.6 },
    { node: 'SCDL-001-分空压表', today: 268.5, yesterday: 251.3 },
    { node: 'SCDL-001-分空压表', today: 265.8, yesterday: 246.5 },
    { node: '激光区', today: 725.8, yesterday: 683.5 },
    { node: '压铆区', today: 523.6, yesterday: 495.2 },
    { node: '压铆区', today: 523.6, yesterday: 495.2 },
    { node: '冲压车间', today: 1685.3, yesterday: 1583.6 },
    { node: 'V80车间', today: 2085.6, yesterday: 1962.3 },
    { node: '集成车间', today: 885.2, yesterday: 843.6 },
    { node: '集成车间', today: 885.2, yesterday: 843.6 },
    { node: 'UB线体产线空压表', today: 308.5, yesterday: 292.6 },
    { node: 'MB线体产线空压表', today: 285.3, yesterday: 271.5 },
    { node: '打磨房空压表', today: 288.6, yesterday: 275.3 },
    { node: '打磨房空压表', today: 288.6, yesterday: 275.3 }
  ],
  co2: [
    { node: '宏奥厂区', today: 325.8, yesterday: 308.5 },
    { node: '涂装车间', today: 72.5, yesterday: 68.3 },
    { node: '涂装车间', today: 73.5, yesterday: 65.8 },
    { node: '数控车间', today: 85.8, yesterday: 79.3 },
    { node: 'CNC加工区', today: 35.2, yesterday: 33.2 },
    { node: 'SCDL-001CO2表', today: 15.6, yesterday: 14.5 },
    { node: 'SCDL-001-分CO2表', today: 8.8, yesterday: 8.2 },
    { node: 'SCDL-001-分CO2表', today: 8.5, yesterday: 8.0 },
    { node: '激光区', today: 23.5, yesterday: 22.0 },
    { node: '压铆区', today: 16.8, yesterday: 15.8 },
    { node: '压铆区', today: 16.8, yesterday: 15.8 },
    { node: '冲压车间', today: 54.5, yesterday: 51.2 },
    { node: 'V80车间', today: 67.5, yesterday: 63.5 },
    { node: '集成车间', today: 28.5, yesterday: 27.0 },
    { node: '集成车间', today: 28.5, yesterday: 27.0 },
    { node: 'UB线体产线CO2表', today: 10.0, yesterday: 9.5 },
    { node: 'MB线体产线CO2表', today: 9.2, yesterday: 8.7 },
    { node: '打磨房CO2表', today: 9.3, yesterday: 8.9 },
    { node: '打磨房CO2表', today: 9.3, yesterday: 8.9 }
  ],
  argon: [
    { node: '宏奥厂区', today: 456.8, yesterday: 428.5 },
    { node: '涂装车间', today: 102.5, yesterday: 96.3 },
    { node: '涂装车间', today: 104.3, yesterday: 92.8 },
    { node: '数控车间', today: 120.5, yesterday: 112.3 },
    { node: 'CNC加工区', today: 49.5, yesterday: 46.8 },
    { node: 'SCDL-001氩气表', today: 22.0, yesterday: 20.6 },
    { node: 'SCDL-001-分氩气表', today: 12.3, yesterday: 11.5 },
    { node: 'SCDL-001-分氩气表', today: 12.0, yesterday: 11.2 },
    { node: '激光区', today: 33.0, yesterday: 31.0 },
    { node: '压铆区', today: 23.5, yesterday: 22.0 },
    { node: '压铆区', today: 23.5, yesterday: 22.0 },
    { node: '冲压车间', today: 76.5, yesterday: 71.8 },
    { node: 'V80车间', today: 94.5, yesterday: 88.5 },
    { node: '集成车间', today: 40.2, yesterday: 38.0 },
    { node: '集成车间', today: 40.2, yesterday: 38.0 },
    { node: 'UB线体产线氩气表', today: 14.0, yesterday: 13.2 },
    { node: 'MB线体产线氩气表', today: 13.0, yesterday: 12.2 },
    { node: '打磨房氩气表', today: 13.2, yesterday: 12.5 },
    { node: '打磨房氩气表', today: 13.2, yesterday: 12.5 }
  ],
  energyMeter: [
    { node: '宏奥厂区', today: 1256.8, yesterday: 1180.5 },
    { node: '涂装车间', today: 285.6, yesterday: 268.3 },
    { node: '涂装车间', today: 288.3, yesterday: 258.5 },
    { node: '数控车间', today: 385.8, yesterday: 358.3 },
    { node: 'CNC加工区', today: 158.5, yesterday: 148.3 },
    { node: 'SCDL-001能量计', today: 72.3, yesterday: 68.2 },
    { node: 'SCDL-001-分能量计', today: 40.8, yesterday: 38.1 },
    { node: 'SCDL-001-分能量计', today: 40.5, yesterday: 37.6 },
    { node: '激光区', today: 108.5, yesterday: 101.3 },
    { node: '压铆区', today: 78.3, yesterday: 73.5 },
    { node: '压铆区', today: 78.3, yesterday: 73.5 },
    { node: '冲压车间', today: 252.5, yesterday: 236.3 },
    { node: 'V80车间', today: 312.5, yesterday: 294.2 },
    { node: '集成车间', today: 132.5, yesterday: 124.3 },
    { node: '集成车间', today: 132.5, yesterday: 124.3 },
    { node: 'UB线体产线能量计', today: 46.8, yesterday: 44.2 },
    { node: 'MB线体产线能量计', today: 42.5, yesterday: 40.1 },
    { node: '打磨房能量计', today: 43.8, yesterday: 41.5 },
    { node: '打磨房能量计', today: 43.8, yesterday: 41.5 }
  ]
};

function formatNum(num: number): string {
  if (num >= 1000000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

export default function MomAnalysis() {
  const [selectedDate, setSelectedDate] = useState('2026-06-30');
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [energyType, setEnergyType] = useState<EnergyType>('electric');

  const currentEnergy = energyTypes.find(e => e.key === energyType)!;
  const currentData = momData[energyType];
  const currentStatsData = energyStatsData[energyType];

  const currentPeriodTotal = currentData.slice(0, 15).reduce((sum, item) => sum + item.current, 0);
  const previousPeriodTotal = currentData.slice(15, 30).reduce((sum, item) => sum + item.last, 0);
  const changePercent = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
  const changeValue = currentPeriodTotal - previousPeriodTotal;
  const isPositive = changePercent > 0;

  const compareCards = [
    {
      label: '本期用能总量',
      value: formatNum(currentPeriodTotal),
      unit: currentEnergy.unit,
      period: selectedDate
    },
    {
      label: '上期用能总量',
      value: formatNum(previousPeriodTotal),
      unit: currentEnergy.unit,
      period: '上期'
    },
    {
      label: '环比变化',
      value: formatNum(Math.abs(changeValue)),
      unit: currentEnergy.unit,
      percent: changePercent.toFixed(2),
      isPositive
    }
  ];

  const getTimeRangeLabel = () => {
    const labels: Record<TimeRange, string> = {
      day: '日',
      week: '周',
      month: '月',
      year: '年'
    };
    return labels[timeRange];
  };

  const getDateInputType = () => {
    if (timeRange === 'year') return 'number';
    if (timeRange === 'month') return 'month';
    return 'date';
  };

  const getDateInputPlaceholder = () => {
    if (timeRange === 'year') return '请输入年份';
    if (timeRange === 'month') return '请选择月份';
    return '请选择日期';
  };

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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">日期</span>
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value as TimeRange);
                  if (e.target.value === 'year') {
                    setSelectedDate('2026');
                  } else if (e.target.value === 'month') {
                    setSelectedDate('2026-06');
                  } else {
                    setSelectedDate('2026-06-30');
                  }
                }}
                className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 cursor-pointer min-w-[80px]"
              >
                <option value="day">日</option>
                <option value="week">周</option>
                <option value="month">月</option>
                <option value="year">年</option>
              </select>
              <input
                type={getDateInputType()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder={getDateInputPlaceholder()}
                min={timeRange === 'year' ? '2020' : undefined}
                max={timeRange === 'year' ? '2030' : undefined}
                className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 bg-white focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 cursor-pointer"
              />
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-[#10469c] text-white text-sm font-medium rounded-lg hover:bg-[#0d3a7f] transition-colors flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                查询
              </button>
            </div>
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
            本期 vs 上期 环比趋势对比
          </div>
          <div style={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorMomCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d90ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d90ff" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorMomLast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#999', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e5e5' }}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: '#999', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v}
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
                    name === 'current' ? '本期' : '上期'
                  ]}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-gray-500">
                      {value === 'current' ? '本期' : '上期'}
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
                  fill="url(#colorMomCurrent)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="last"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorMomLast)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-800 mb-4">能源{currentEnergy.label}统计</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#2c5bb5] text-white">
                  <th className="text-left px-4 py-3 font-medium">能源节点</th>
                  <th className="text-right px-4 py-3 font-medium">当日{currentEnergy.label}({currentEnergy.unit})</th>
                  <th className="text-right px-4 py-3 font-medium">昨日{currentEnergy.label}({currentEnergy.unit})</th>
                  <th className="text-right px-4 py-3 font-medium">增加值({currentEnergy.unit})</th>
                  <th className="text-right px-4 py-3 font-medium">环比(%)</th>
                </tr>
              </thead>
              <tbody>
                {currentStatsData.map((item, index) => {
                  const increase = item.today - item.yesterday;
                  const ratio = ((increase / item.yesterday) * 100).toFixed(2);
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-gray-800">{item.node}</td>
                      <td className="px-4 py-3 text-right text-gray-800">{item.today}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.yesterday}</td>
                      <td className="px-4 py-3 text-right text-gray-800">{increase.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-red-500">
                        {ratio > 0 ? '+' : ''}{ratio}% ↑
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
