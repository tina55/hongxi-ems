import { useState, useMemo } from 'react';
import { TreeNav } from '@/components/TreeNav/TreeNav';
import { useTreeStore } from '@/store/treeStore';
import { treeData } from '@/data/treeData';
import { ChevronRight, Activity, X } from 'lucide-react';
import type { TreeNode } from '@/types/tree';

type DeviceStatus = 'all' | 'normal' | 'abnormal' | 'offline';
type DataType = 'normal' | 'abnormal';
type MeterType = 'electric' | 'water' | 'gas' | 'compressedAir' | 'argon' | 'co2' | 'heat';

interface DeviceMetric {
  label: string;
  value: string | number;
  unit?: string;
}

interface DeviceData {
  id: string;
  name: string;
  path: string;
  status: 'normal' | 'abnormal' | 'offline';
  meterType: MeterType;
  updateTime: string;
  metrics: DeviceMetric[];
}

const statusFilters = [
  { key: 'all' as DeviceStatus, label: '全部', count: 0 },
  { key: 'normal' as DeviceStatus, label: '正常', count: 0 },
  { key: 'abnormal' as DeviceStatus, label: '异常', count: 0 },
  { key: 'offline' as DeviceStatus, label: '离线', count: 0 },
];

const statusMap: Record<string, { label: string; color: string; bgColor: string; leftBarColor: string }> = {
  normal: { label: '正常', color: '#10b981', bgColor: '#ecfdf5', leftBarColor: '#10b981' },
  abnormal: { label: '异常', color: '#ef4444', bgColor: '#fef2f2', leftBarColor: '#ef4444' },
  offline: { label: '离线', color: '#6b7280', bgColor: '#f9fafb', leftBarColor: '#6b7280' },
};

const meterTypeConfigs: Record<MeterType, {
  cardMetrics: DeviceMetric[];
  detailMetrics: DeviceMetric[];
}> = {
  electric: {
    cardMetrics: [
      { label: '电流', value: '-', unit: 'A' },
      { label: '功率', value: '-', unit: 'kW' },
      { label: '电能', value: '-', unit: 'kWh' },
      { label: '额定电流', value: '-', unit: 'A' },
    ],
    detailMetrics: [
      { label: '电流', value: '--', unit: 'A' },
      { label: '功率', value: '--', unit: 'kW' },
      { label: '电能', value: '--', unit: 'kWh' },
      { label: '额定电流', value: '--', unit: 'A' },
      { label: '相电压 UA', value: '--', unit: 'V' },
      { label: '相电压 UB', value: '--', unit: 'V' },
      { label: '相电压 UC', value: '--', unit: 'V' },
      { label: '线电压 UAB', value: '--', unit: 'V' },
      { label: '线电压 UBC', value: '--', unit: 'V' },
      { label: '线电压 UAC', value: '--', unit: 'V' },
      { label: 'A相电流 IA', value: '--', unit: 'A' },
      { label: 'B相电流 IB', value: '--', unit: 'A' },
      { label: 'C相电流 IC', value: '--', unit: 'A' },
      { label: 'A相有功功率 PA', value: '--', unit: 'kW' },
      { label: 'B相有功功率 PB', value: '--', unit: 'kW' },
      { label: 'C相有功功率 PC', value: '--', unit: 'kW' },
      { label: '有功功率总和 P 总', value: '--', unit: 'kW' },
      { label: 'A相的无功功率 QA', value: '--', unit: 'kvar' },
      { label: 'B相的无功功率 QB', value: '--', unit: 'kvar' },
      { label: 'C相的无功功率 QC', value: '--', unit: 'kvar' },
      { label: '总无功功率 Q 总', value: '--', unit: 'kvar' },
      { label: 'A相功率因数 PFA', value: '--' },
      { label: 'B相功率因数 PFB', value: '--' },
      { label: 'C相功率因数 PFC', value: '--' },
      { label: '总功率因数 PF', value: '--' },
      { label: '频率 F', value: '--', unit: 'Hz' },
      { label: '正向有功电能 Ep', value: '--', unit: 'kWh' },
      { label: '反向有功电能 En', value: '--', unit: 'kWh' },
    ],
  },
  water: {
    cardMetrics: [
      { label: '瞬时流量', value: '-', unit: 'm³/h' },
      { label: '累计流量', value: '-', unit: 'm³' },
      { label: '流速', value: '-', unit: 'm/s' },
      { label: '额定流量', value: '-', unit: 'm³/h' },
    ],
    detailMetrics: [
      { label: '瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '流速', value: '--', unit: 'm/s' },
      { label: '额定流量', value: '--', unit: 'm³/h' },
      { label: '管径', value: '--', unit: 'mm' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '温度', value: '--', unit: '°C' },
      { label: '密度', value: '--', unit: 'kg/m³' },
      { label: '今日用量', value: '--', unit: 'm³' },
      { label: '本月用量', value: '--', unit: 'm³' },
      { label: '上月用量', value: '--', unit: 'm³' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时流量', value: '--', unit: 'm³/h' },
      { label: '最小瞬时流量', value: '--', unit: 'm³/h' },
      { label: '平均瞬时流量', value: '--', unit: 'm³/h' },
    ],
  },
  gas: {
    cardMetrics: [
      { label: '瞬时流量', value: '-', unit: 'm³/h' },
      { label: '累计流量', value: '-', unit: 'm³' },
      { label: '压力', value: '-', unit: 'MPa' },
      { label: '温度', value: '-', unit: '°C' },
    ],
    detailMetrics: [
      { label: '瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '温度', value: '--', unit: '°C' },
      { label: '标况流量', value: '--', unit: 'Nm³/h' },
      { label: '标况累计', value: '--', unit: 'Nm³' },
      { label: '密度', value: '--', unit: 'kg/m³' },
      { label: '热值', value: '--', unit: 'MJ/Nm³' },
      { label: '今日用量', value: '--', unit: 'm³' },
      { label: '本月用量', value: '--', unit: 'm³' },
      { label: '上月用量', value: '--', unit: 'm³' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时流量', value: '--', unit: 'm³/h' },
      { label: '最小瞬时流量', value: '--', unit: 'm³/h' },
      { label: '平均瞬时流量', value: '--', unit: 'm³/h' },
    ],
  },
  compressedAir: {
    cardMetrics: [
      { label: '瞬时流量', value: '-', unit: 'm³/min' },
      { label: '累计流量', value: '-', unit: 'm³' },
      { label: '压力', value: '-', unit: 'MPa' },
      { label: '露点温度', value: '-', unit: '°C' },
    ],
    detailMetrics: [
      { label: '瞬时流量', value: '--', unit: 'm³/min' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '露点温度', value: '--', unit: '°C' },
      { label: '温度', value: '--', unit: '°C' },
      { label: '含油量', value: '--', unit: 'mg/m³' },
      { label: '含尘量', value: '--', unit: 'mg/m³' },
      { label: '管径', value: '--', unit: 'mm' },
      { label: '今日用量', value: '--', unit: 'm³' },
      { label: '本月用量', value: '--', unit: 'm³' },
      { label: '上月用量', value: '--', unit: 'm³' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时流量', value: '--', unit: 'm³/min' },
      { label: '最小瞬时流量', value: '--', unit: 'm³/min' },
      { label: '平均瞬时流量', value: '--', unit: 'm³/min' },
    ],
  },
  argon: {
    cardMetrics: [
      { label: '瞬时流量', value: '-', unit: 'm³/h' },
      { label: '累计流量', value: '-', unit: 'm³' },
      { label: '压力', value: '-', unit: 'MPa' },
      { label: '纯度', value: '-', unit: '%' },
    ],
    detailMetrics: [
      { label: '瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '纯度', value: '--', unit: '%' },
      { label: '温度', value: '--', unit: '°C' },
      { label: '密度', value: '--', unit: 'kg/m³' },
      { label: '管径', value: '--', unit: 'mm' },
      { label: '今日用量', value: '--', unit: 'm³' },
      { label: '本月用量', value: '--', unit: 'm³' },
      { label: '上月用量', value: '--', unit: 'm³' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时流量', value: '--', unit: 'm³/h' },
      { label: '最小瞬时流量', value: '--', unit: 'm³/h' },
      { label: '平均瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计运行时间', value: '--', unit: 'h' },
    ],
  },
  co2: {
    cardMetrics: [
      { label: '瞬时流量', value: '-', unit: 'm³/h' },
      { label: '累计流量', value: '-', unit: 'm³' },
      { label: '压力', value: '-', unit: 'MPa' },
      { label: '浓度', value: '-', unit: '%' },
    ],
    detailMetrics: [
      { label: '瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '浓度', value: '--', unit: '%' },
      { label: '温度', value: '--', unit: '°C' },
      { label: '密度', value: '--', unit: 'kg/m³' },
      { label: '管径', value: '--', unit: 'mm' },
      { label: '今日用量', value: '--', unit: 'm³' },
      { label: '本月用量', value: '--', unit: 'm³' },
      { label: '上月用量', value: '--', unit: 'm³' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时流量', value: '--', unit: 'm³/h' },
      { label: '最小瞬时流量', value: '--', unit: 'm³/h' },
      { label: '平均瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计运行时间', value: '--', unit: 'h' },
    ],
  },
  heat: {
    cardMetrics: [
      { label: '瞬时热量', value: '-', unit: 'GJ/h' },
      { label: '累计热量', value: '-', unit: 'GJ' },
      { label: '供水温度', value: '-', unit: '°C' },
      { label: '回水温度', value: '-', unit: '°C' },
    ],
    detailMetrics: [
      { label: '瞬时热量', value: '--', unit: 'GJ/h' },
      { label: '累计热量', value: '--', unit: 'GJ' },
      { label: '供水温度', value: '--', unit: '°C' },
      { label: '回水温度', value: '--', unit: '°C' },
      { label: '瞬时流量', value: '--', unit: 'm³/h' },
      { label: '累计流量', value: '--', unit: 'm³' },
      { label: '压力', value: '--', unit: 'MPa' },
      { label: '温差', value: '--', unit: '°C' },
      { label: '今日用热量', value: '--', unit: 'GJ' },
      { label: '本月用热量', value: '--', unit: 'GJ' },
      { label: '上月用热量', value: '--', unit: 'GJ' },
      { label: '同比增长率', value: '--', unit: '%' },
      { label: '最大瞬时热量', value: '--', unit: 'GJ/h' },
      { label: '最小瞬时热量', value: '--', unit: 'GJ/h' },
      { label: '平均瞬时热量', value: '--', unit: 'GJ/h' },
    ],
  },
};

function collectLeafNodes(nodes: TreeNode[], parentPath: string[] = []): Array<{ node: TreeNode; path: string[] }> {
  const result: Array<{ node: TreeNode; path: string[] }> = [];
  for (const node of nodes) {
    const currentPath = [...parentPath, node.name];
    if (node.children.length === 0) {
      result.push({ node, path: currentPath });
    } else {
      result.push(...collectLeafNodes(node.children, currentPath));
    }
  }
  return result;
}

function generateDevicesFromTree(): DeviceData[] {
  const leafNodes = collectLeafNodes(treeData);
  return leafNodes.map((item, index) => {
    const pathStr = item.path.join('/');
    const statuses: Array<'normal' | 'abnormal' | 'offline'> = ['offline', 'normal', 'abnormal'];
    const status = statuses[index % 3];
    const meterType = item.node.meterType || 'electric';
    const config = meterTypeConfigs[meterType];

    const metrics = config.cardMetrics.map(m => ({
      ...m,
      value: status === 'offline' ? '-' : getRandomValueForMetric(m.label, meterType),
    }));

    return {
      id: item.node.id,
      name: item.node.name,
      path: pathStr,
      status,
      meterType,
      updateTime: status === 'offline' ? '-' : new Date().toLocaleString('zh-CN'),
      metrics,
    };
  });
}

function getRandomValueForMetric(label: string, meterType: MeterType): string {
  if (meterType === 'electric') {
    if (label.includes('电流')) return (Math.random() * 200 + 100).toFixed(1);
    if (label.includes('功率')) return (Math.random() * 500 + 100).toFixed(1);
    if (label.includes('电能')) return (Math.random() * 10000 + 5000).toFixed(1);
    return (Math.random() * 400 + 200).toFixed(1);
  }
  if (meterType === 'water') {
    if (label.includes('瞬时流量')) return (Math.random() * 100 + 20).toFixed(1);
    if (label.includes('累计流量')) return (Math.random() * 5000 + 1000).toFixed(1);
    if (label.includes('流速')) return (Math.random() * 2 + 0.5).toFixed(2);
    if (label.includes('额定流量')) return (Math.random() * 150 + 50).toFixed(1);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  if (meterType === 'gas') {
    if (label.includes('瞬时流量')) return (Math.random() * 50 + 10).toFixed(1);
    if (label.includes('累计流量')) return (Math.random() * 2000 + 500).toFixed(1);
    if (label.includes('压力')) return (Math.random() * 0.5 + 0.1).toFixed(3);
    if (label.includes('温度')) return (Math.random() * 30 + 10).toFixed(1);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  if (meterType === 'compressedAir') {
    if (label.includes('瞬时流量')) return (Math.random() * 10 + 2).toFixed(1);
    if (label.includes('累计流量')) return (Math.random() * 5000 + 1000).toFixed(1);
    if (label.includes('压力')) return (Math.random() * 0.8 + 0.4).toFixed(2);
    if (label.includes('露点温度')) return (Math.random() * 10 - 20).toFixed(1);
    if (label.includes('含油量')) return (Math.random() * 0.1).toFixed(3);
    if (label.includes('含尘量')) return (Math.random() * 0.1).toFixed(3);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  if (meterType === 'argon') {
    if (label.includes('瞬时流量')) return (Math.random() * 20 + 5).toFixed(1);
    if (label.includes('累计流量')) return (Math.random() * 1000 + 200).toFixed(1);
    if (label.includes('压力')) return (Math.random() * 0.5 + 0.1).toFixed(2);
    if (label.includes('纯度')) return (Math.random() * 0.01 + 99.99).toFixed(2);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  if (meterType === 'co2') {
    if (label.includes('瞬时流量')) return (Math.random() * 30 + 10).toFixed(1);
    if (label.includes('累计流量')) return (Math.random() * 1500 + 300).toFixed(1);
    if (label.includes('压力')) return (Math.random() * 0.3 + 0.1).toFixed(2);
    if (label.includes('浓度')) return (Math.random() * 5 + 95).toFixed(1);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  if (meterType === 'heat') {
    if (label.includes('瞬时热量')) return (Math.random() * 2 + 0.5).toFixed(2);
    if (label.includes('累计热量')) return (Math.random() * 500 + 100).toFixed(1);
    if (label.includes('供水温度')) return (Math.random() * 30 + 50).toFixed(1);
    if (label.includes('回水温度')) return (Math.random() * 20 + 40).toFixed(1);
    if (label.includes('温差')) return (Math.random() * 10 + 5).toFixed(1);
    return (Math.random() * 100 + 10).toFixed(1);
  }
  return (Math.random() * 100 + 50).toFixed(1);
}

export default function RealtimeData() {
  const [statusFilter, setStatusFilter] = useState<DeviceStatus>('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [dataType, setDataType] = useState<DataType>('normal');
  const { selectedNodeId } = useTreeStore();

  const allDevices = useMemo(() => generateDevicesFromTree(), []);

  const filteredDevices = useMemo(() => {
    let devices = allDevices;

    if (selectedNodeId) {
      const findNodePath = (nodes: TreeNode[], targetId: string, currentPath: string[] = []): string[] | null => {
        for (const node of nodes) {
          const newPath = [...currentPath, node.name];
          if (node.id === targetId) {
            return newPath;
          }
          if (node.children.length > 0) {
            const found = findNodePath(node.children, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      const selectedPath = findNodePath(treeData, selectedNodeId);
      if (selectedPath) {
        const selectedName = selectedPath[selectedPath.length - 1];
        devices = devices.filter(d =>
          d.path.includes(selectedName)
        );
      }
    }

    if (statusFilter !== 'all') {
      devices = devices.filter(d => d.status === statusFilter);
    }

    return devices;
  }, [allDevices, selectedNodeId, statusFilter]);

  const statusCounts = useMemo(() => {
    let devicesForCount = allDevices;

    if (selectedNodeId) {
      const findNodePath = (nodes: TreeNode[], targetId: string, currentPath: string[] = []): string[] | null => {
        for (const node of nodes) {
          const newPath = [...currentPath, node.name];
          if (node.id === targetId) {
            return newPath;
          }
          if (node.children.length > 0) {
            const found = findNodePath(node.children, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      const selectedPath = findNodePath(treeData, selectedNodeId);
      if (selectedPath) {
        const selectedName = selectedPath[selectedPath.length - 1];
        devicesForCount = devicesForCount.filter(d => d.path.includes(selectedName));
      }
    }

    return {
      all: devicesForCount.length,
      normal: devicesForCount.filter(d => d.status === 'normal').length,
      abnormal: devicesForCount.filter(d => d.status === 'abnormal').length,
      offline: devicesForCount.filter(d => d.status === 'offline').length,
    };
  }, [allDevices, selectedNodeId]);

  const handleOpenDetail = (device: DeviceData) => {
    setSelectedDevice(device);
    setDetailOpen(true);
    setDataType('normal');
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedDevice(null);
  };

  const getDetailMetrics = () => {
    if (!selectedDevice) return meterTypeConfigs.electric.detailMetrics;
    const config = meterTypeConfigs[selectedDevice.meterType];
    if (selectedDevice.status === 'offline') return config.detailMetrics;
    return config.detailMetrics.map(m => ({
      ...m,
      value: getRandomValueForMetric(m.label, selectedDevice.meterType),
    }));
  };

  return (
    <div className="flex h-full relative">
      <TreeNav width={280} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">设备状态:</span>
            <div className="flex gap-2">
              {statusFilters.map((filter) => {
                const count = statusCounts[filter.key];
                return (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === filter.key
                        ? 'bg-[#10469c] text-white'
                        : 'text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {filter.label}
                    <span className={`ml-1 ${statusFilter === filter.key ? 'text-white/80' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDevices.map((device) => {
            const statusInfo = statusMap[device.status];
            return (
              <div
                key={device.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{ backgroundColor: statusInfo.leftBarColor }}
                ></div>
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-gray-800 font-medium truncate">
                          {device.path}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-gray-500">设备状态:</span>
                        <span
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{
                            color: statusInfo.color,
                            backgroundColor: statusInfo.bgColor,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-gray-500">更新时间:</span>
                        <span className="text-sm text-gray-400">{device.updateTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenDetail(device)}
                      className="flex items-center gap-1 text-sm text-[#10469c] hover:text-[#0d3a80] transition-colors shrink-0 ml-4"
                    >
                      查看详情
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {device.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Activity className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">{metric.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-gray-800">
                            {metric.value}
                          </span>
                          {metric.unit && metric.value !== '-' && (
                            <span className="text-xs text-gray-400">{metric.unit}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDevices.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400 text-sm">暂无符合条件的设备</div>
          </div>
        )}
      </div>

      {detailOpen && selectedDevice && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleCloseDetail}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[640px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-base font-semibold text-gray-800">{selectedDevice.path}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedDevice.meterType === 'electric' ? '电表' : selectedDevice.meterType === 'water' ? '水表' : selectedDevice.meterType === 'gas' ? '天然气表' : selectedDevice.meterType === 'compressedAir' ? '压缩空气表' : selectedDevice.meterType === 'argon' ? '氩气表' : selectedDevice.meterType === 'co2' ? '二氧化碳气表' : '热量表'}详情
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full">正常数据</span>
                  <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-full">异常数据</span>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-3">
                {getDetailMetrics().map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="text-xs text-gray-500 font-medium mb-1.5">
                      {metric.label}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-800">
                        {metric.value}
                      </span>
                      {metric.unit && metric.value !== '--' && metric.value !== '-' && (
                        <span className="text-xs text-gray-400">{metric.unit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
