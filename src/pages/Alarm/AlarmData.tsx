import { useState } from 'react';
import { Search, RotateCcw, AlertTriangle, History } from 'lucide-react';

interface AlarmItem {
  id: string;
  index: number;
  alarmTime: string;
  alarmName: string;
  alarmLevel: string;
  alarmLocation: string;
  alarmDesc: string;
  confirmed: boolean;
}

const realtimeAlarms: AlarmItem[] = [
  {
    id: '1',
    index: 1,
    alarmTime: '2026-07-08 20:31:50',
    alarmName: '湿度',
    alarmLevel: '第一等级',
    alarmLocation: '#40温湿度（A3-35KV...',
    alarmDesc: '湿度 越限告警,值: 51.0...',
    confirmed: false,
  },
  {
    id: '2',
    index: 2,
    alarmTime: '2026-07-08 20:06:05',
    alarmName: '湿度',
    alarmLevel: '第一等级',
    alarmLocation: '#39温湿度（A3-35KV...',
    alarmDesc: '湿度 越限告警,值: 51.2...',
    confirmed: false,
  },
  {
    id: '3',
    index: 3,
    alarmTime: '2026-07-08 20:01:10',
    alarmName: '湿度',
    alarmLevel: '第一等级',
    alarmLocation: '#40温湿度（A3-35KV...',
    alarmDesc: '湿度 越限告警,值: 50.0...',
    confirmed: false,
  },
  {
    id: '4',
    index: 4,
    alarmTime: '2026-07-08 19:56:10',
    alarmName: '湿度',
    alarmLevel: '第一等级',
    alarmLocation: '#40温湿度（A3-35KV...',
    alarmDesc: '湿度 越限告警,值: 50.0...',
    confirmed: false,
  },
  {
    id: '5',
    index: 5,
    alarmTime: '2026-07-08 19:44:00',
    alarmName: '温度',
    alarmLevel: '第一等级',
    alarmLocation: '#16温湿度（A3-PACK...',
    alarmDesc: '温度 越限告警,值: 27.5...',
    confirmed: false,
  },
];

const historyAlarms: AlarmItem[] = [
  {
    id: '1',
    index: 1,
    alarmTime: '2026-07-07 18:30:20',
    alarmName: '电压',
    alarmLevel: '第二等级',
    alarmLocation: '#12电表（A3-数控车间）',
    alarmDesc: '电压 越限告警,值: 420.5',
    confirmed: true,
  },
  {
    id: '2',
    index: 2,
    alarmTime: '2026-07-07 15:20:10',
    alarmName: '电流',
    alarmLevel: '第三等级',
    alarmLocation: '#8电表（A3-涂装车间）',
    alarmDesc: '电流 越限告警,值: 150.2',
    confirmed: true,
  },
  {
    id: '3',
    index: 3,
    alarmTime: '2026-07-06 10:15:30',
    alarmName: '温度',
    alarmLevel: '第一等级',
    alarmLocation: '#5温湿度（A3-冲压车间）',
    alarmDesc: '温度 越限告警,值: 35.0',
    confirmed: true,
  },
  {
    id: '4',
    index: 4,
    alarmTime: '2026-07-05 22:10:05',
    alarmName: '压力',
    alarmLevel: '第二等级',
    alarmLocation: '#3压缩空气表（A3-V80车间）',
    alarmDesc: '压力 越限告警,值: 0.85',
    confirmed: true,
  },
];

export default function AlarmData() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'history'>('realtime');
  const [searchForm, setSearchForm] = useState({
    desc: '',
    type: '',
    startTime: '2026-07-08 00:00:00',
    endTime: '2026-07-08 23:59:59',
    level: '',
  });

  const handleSearch = () => {
    console.log('搜索', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      desc: '',
      type: '',
      startTime: '2026-07-08 00:00:00',
      endTime: '2026-07-08 23:59:59',
      level: '',
    });
  };

  const handleConfirm = (id: string) => {
    console.log('确认告警', id);
  };

  const alarmData = activeTab === 'realtime' ? realtimeAlarms : historyAlarms;

  const getLevelClass = (level: string) => {
    if (level === '第一等级') return 'text-red-500 bg-red-50';
    if (level === '第二等级') return 'text-orange-500 bg-orange-50';
    return 'text-yellow-500 bg-yellow-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'realtime'
                  ? 'border-[#10469c] text-[#10469c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                实时告警
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-[#10469c] text-[#10469c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                告警记录
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">告警描述:</span>
            <input
              type="text"
              value={searchForm.desc}
              onChange={(e) => setSearchForm({ ...searchForm, desc: e.target.value })}
              placeholder="请输入告警描述"
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 min-w-[200px]"
            />
            <span className="text-sm text-gray-600">告警类型:</span>
            <select
              value={searchForm.type}
              onChange={(e) => setSearchForm({ ...searchForm, type: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
            >
              <option value="">请选择告警类型</option>
              <option value="temperature">温度</option>
              <option value="humidity">湿度</option>
              <option value="voltage">电压</option>
              <option value="current">电流</option>
              <option value="pressure">压力</option>
            </select>
            <span className="text-sm text-gray-600">告警时间:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchForm.startTime}
                onChange={(e) => setSearchForm({ ...searchForm, startTime: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[200px]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                value={searchForm.endTime}
                onChange={(e) => setSearchForm({ ...searchForm, endTime: e.target.value })}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[200px]"
              />
            </div>
            <span className="text-sm text-gray-600">告警级别:</span>
            <select
              value={searchForm.level}
              onChange={(e) => setSearchForm({ ...searchForm, level: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
            >
              <option value="">请选择告警级别</option>
              <option value="1">第一等级</option>
              <option value="2">第二等级</option>
              <option value="3">第三等级</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">序号</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">告警时间</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">告警名称</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">告警级别</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">告警位置</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">告警描述</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {alarmData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.index}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.alarmTime}</td>
                    <td className="px-4 py-3 text-center text-gray-800">{item.alarmName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelClass(item.alarmLevel)}`}>
                        {item.alarmLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.alarmLocation}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.alarmDesc}</td>
                    <td className="px-4 py-3 text-center">
                      {!item.confirmed && (
                        <button
                          onClick={() => handleConfirm(item.id)}
                          className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
                        >
                          确认
                        </button>
                      )}
                      {item.confirmed && (
                        <span className="text-gray-400 text-sm">已确认</span>
                      )}
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
