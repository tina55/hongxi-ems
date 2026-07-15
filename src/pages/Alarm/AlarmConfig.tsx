import { useState } from 'react';
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface AlarmConfigItem {
  id: string;
  index: number;
  alarmName: string;
  alarmType: string;
  alarmLevel: string;
  threshold: string;
  deviceName: string;
  enabled: boolean;
}

const configData: AlarmConfigItem[] = [
  {
    id: '1',
    index: 1,
    alarmName: '温度越限',
    alarmType: '温度',
    alarmLevel: '第一等级',
    threshold: '> 35℃',
    deviceName: '温湿度传感器',
    enabled: true,
  },
  {
    id: '2',
    index: 2,
    alarmName: '湿度越限',
    alarmType: '湿度',
    alarmLevel: '第一等级',
    threshold: '> 50%RH',
    deviceName: '温湿度传感器',
    enabled: true,
  },
  {
    id: '3',
    index: 3,
    alarmName: '电压越限',
    alarmType: '电压',
    alarmLevel: '第二等级',
    threshold: '> 420V',
    deviceName: '电表',
    enabled: true,
  },
  {
    id: '4',
    index: 4,
    alarmName: '电流越限',
    alarmType: '电流',
    alarmLevel: '第三等级',
    threshold: '> 150A',
    deviceName: '电表',
    enabled: false,
  },
  {
    id: '5',
    index: 5,
    alarmName: '压力越限',
    alarmType: '压力',
    alarmLevel: '第二等级',
    threshold: '> 0.85MPa',
    deviceName: '压缩空气表',
    enabled: true,
  },
];

export default function AlarmConfig() {
  const [searchText, setSearchText] = useState('');
  const [configs, setConfigs] = useState<AlarmConfigItem[]>(configData);

  const handleSearch = () => {
    console.log('搜索', searchText);
  };

  const handleAdd = () => {
    console.log('新增配置');
  };

  const handleEdit = (id: string) => {
    console.log('编辑', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除', id);
  };

  const handleToggle = (id: string) => {
    setConfigs(prev => prev.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const getLevelClass = (level: string) => {
    if (level === '第一等级') return 'text-red-500 bg-red-50';
    if (level === '第二等级') return 'text-orange-500 bg-orange-50';
    return 'text-yellow-500 bg-yellow-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="请输入告警名称"
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 min-w-[200px]"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
            <div className="flex-1" />
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">序号</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">告警名称</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">告警类型</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">告警级别</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">告警阈值</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">关联设备</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">启用状态</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 text-center text-gray-600">{item.index}</td>
                    <td className="px-6 py-3 text-center text-gray-800">{item.alarmName}</td>
                    <td className="px-6 py-3 text-center text-gray-600">{item.alarmType}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelClass(item.alarmLevel)}`}>
                        {item.alarmLevel}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-gray-600">{item.threshold}</td>
                    <td className="px-6 py-3 text-center text-gray-600">{item.deviceName}</td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => handleToggle(item.id)}>
                        {item.enabled ? (
                          <ToggleRight className="w-6 h-6 text-[#10469c]" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
