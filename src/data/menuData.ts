import type { MenuItem } from '@/types/menu';

export const menuData: MenuItem[] = [
  {
    id: 'dashboard',
    name: '首页概览',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    hasContent: true
  },
  {
    id: 'cockpit',
    name: '能源驾驶舱',
    icon: 'Monitor',
    path: '/cockpit',
    hasContent: true
  },
  {
    id: 'realtime',
    name: '实时数据',
    icon: 'BarChart2',
    path: '/realtime',
    hasContent: true,
    children: [
      { id: 'realtime-overview', name: '实时数据', path: '/electric/overview', icon: 'Activity', hasContent: true },
      { id: 'realtime-history', name: '历史数据', path: '/realtime/history', icon: 'History', hasContent: true }
    ]
  },
  {
    id: 'electric',
    name: '能耗分析',
    icon: 'Zap',
    path: '/electric',
    hasContent: true,
    children: [
      { id: 'electric-trend', name: '用能趋势', path: '/electric/trend', icon: 'LineChart', hasContent: true },
      { id: 'electric-yoymom', name: '同环比分析', path: '/electric/yoymom', icon: 'BarChart3', hasContent: true },
      { id: 'statistics-team-hongao', name: '班组分析（宏奥）', path: '/statistics/team-hongao', icon: 'Users', hasContent: true },
      { id: 'statistics-team', name: '班组分析2', path: '/statistics/team', icon: 'Users', hasContent: true },
      { id: 'statistics-product', name: '单位能耗', path: '/statistics/product', icon: 'Package', hasContent: true }
    ]
  },
  {
    id: 'report',
    name: '报表管理',
    icon: 'FileText',
    path: '/report',
    hasContent: true,
    children: [
      { id: 'report-energy', name: '用能报表', path: '/report/energy', icon: 'BarChart3', hasContent: true },
      { id: 'report-manual', name: '手工录入（宏奥）', path: '/report/manual', icon: 'Edit3', hasContent: true }
    ]
  },
  {
    id: 'device',
    name: '设备管理',
    icon: 'Settings',
    path: '/device',
    hasContent: true,
    children: [
      { id: 'device-list', name: '设备拓扑', path: '/device/list', icon: 'Server', hasContent: true },
      { id: 'device-meter', name: '表计管理', path: '/device/meter', icon: 'Gauge', hasContent: true }
    ]
  },
  {
    id: 'alarm',
    name: '告警管理',
    icon: 'Bell',
    path: '/alarm',
    hasContent: true,
    children: [
      { id: 'alarm-data', name: '告警数据', path: '/alarm/data', icon: 'Bell', hasContent: true },
      { id: 'alarm-config', name: '告警配置', path: '/alarm/config', icon: 'Settings', hasContent: true }
    ]
  },
  {
    id: 'system',
    name: '系统管理',
    icon: 'Shield',
    path: '/system',
    hasContent: false
  },
  {
    id: 'other',
    name: '其他',
    icon: 'MoreHorizontal',
    path: '/other',
    hasContent: true,
    children: [
      { id: 'statistics-process', name: '工艺能耗1（宏创）', path: '/statistics/process', icon: 'Cog', hasContent: true },
      { id: 'statistics-process2', name: '工艺能耗2（宏创）', path: '/statistics/process2', icon: 'Cog', hasContent: true },
      { id: 'electric-yoy', name: '同比分析（废弃）', path: '/electric/yoy', icon: 'TrendingUp', hasContent: true },
      { id: 'electric-mom', name: '环比分析（废弃）', path: '/electric/mom', icon: 'Activity', hasContent: true },
      { id: 'device-group', name: '设备分组（废弃）', path: '/device/group', icon: 'Folder', hasContent: true },
      { id: 'device-tag', name: '标签管理（废弃）', path: '/device/tag', icon: 'Tag', hasContent: true }
    ]
  }
];
