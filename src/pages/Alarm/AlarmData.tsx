import { useState } from 'react';
import { Search, RotateCcw, AlertTriangle, History, CheckCircle, Clock, Send, XCircle } from 'lucide-react';

interface AlarmItem {
  id: string;
  index: number;
  alarmTime: string;
  alarmName: string;
  alarmType: string;
  alarmLevel: '严重' | '紧急' | '一般';
  energyType: string;
  alarmLocation: string;
  alarmDesc: string;
  pushPerson: string;
  pushStatus: 'success' | 'failed';
  confirmed: boolean;
  status: 'alarm' | 'recovered';
  recoverTime?: string;
  confirmTime?: string;
  confirmPerson?: string;
}

const realtimeAlarms: AlarmItem[] = [
  {
    id: '1',
    index: 1,
    alarmTime: '2026-07-17 20:31:50',
    alarmName: '总用电越限',
    alarmType: '阈值告警',
    alarmLevel: '严重',
    energyType: '电能',
    alarmLocation: '宏奥厂区',
    alarmDesc: '当前总用电量 535 kWh，已超过阈值 520 kWh，请及时关注',
    pushPerson: '系统管理员',
    pushStatus: 'success',
    confirmed: false,
    status: 'alarm',
  },
  {
    id: '2',
    index: 2,
    alarmTime: '2026-07-17 20:06:05',
    alarmName: '电压波动检测',
    alarmType: '阈值告警',
    alarmLevel: '严重',
    energyType: '电能',
    alarmLocation: '涂装车间',
    alarmDesc: '涂装车间电压波动至 248V，超出正常范围，请检查设备',
    pushPerson: '安全管理员',
    pushStatus: 'success',
    confirmed: false,
    status: 'alarm',
  },
  {
    id: '3',
    index: 3,
    alarmTime: '2026-07-17 19:44:00',
    alarmName: '空调能耗过高',
    alarmType: '趋势告警',
    alarmLevel: '紧急',
    energyType: '电能',
    alarmLocation: '数控车间',
    alarmDesc: '数控车间空调能耗呈持续上升趋势，建议检查空调运行状态',
    pushPerson: '运维工程师',
    pushStatus: 'failed',
    confirmed: true,
    status: 'alarm',
  },
  {
    id: '4',
    index: 4,
    alarmTime: '2026-07-17 18:30:20',
    alarmName: '照明能耗预警',
    alarmType: '用能告警（日）',
    alarmLevel: '一般',
    energyType: '电能',
    alarmLocation: '集成车间',
    alarmDesc: '集成车间今日照明用电已达 128 kWh，超过日阈值 120 kWh',
    pushPerson: '值班长',
    pushStatus: 'success',
    confirmed: false,
    status: 'alarm',
  },
];

const historyAlarms: AlarmItem[] = [
  {
    id: '1',
    index: 1,
    alarmTime: '2026-07-16 18:30:20',
    alarmName: '总用电越限',
    alarmType: '阈值告警',
    alarmLevel: '严重',
    energyType: '电能',
    alarmLocation: '宏奥厂区',
    alarmDesc: '当日总用电量 542 kWh，超过阈值 520 kWh',
    pushPerson: '系统管理员',
    pushStatus: 'success',
    confirmed: true,
    status: 'recovered',
    recoverTime: '2026-07-16 19:45:30',
    confirmTime: '2026-07-16 18:35:00',
    confirmPerson: '系统管理员',
  },
  {
    id: '2',
    index: 2,
    alarmTime: '2026-07-16 15:20:10',
    alarmName: '功率因数过低',
    alarmType: '用能告警（月）',
    alarmLevel: '紧急',
    energyType: '电能',
    alarmLocation: 'V80车间',
    alarmDesc: '本月V80车间平均功率因数 0.83，低于阈值 0.85',
    pushPerson: '审计管理员',
    pushStatus: 'success',
    confirmed: true,
    status: 'recovered',
    recoverTime: '2026-07-16 16:30:00',
    confirmTime: '2026-07-16 15:25:00',
    confirmPerson: '值班长',
  },
  {
    id: '3',
    index: 3,
    alarmTime: '2026-07-15 10:15:30',
    alarmName: '空调能耗过高',
    alarmType: '趋势告警',
    alarmLevel: '紧急',
    energyType: '电能',
    alarmLocation: '数控车间',
    alarmDesc: '数控车间空调能耗上升速率超过 15%/小时',
    pushPerson: '运维工程师',
    pushStatus: 'failed',
    confirmed: true,
    status: 'recovered',
    recoverTime: '2026-07-15 11:20:00',
    confirmTime: '2026-07-15 10:20:00',
    confirmPerson: '运维工程师',
  },
  {
    id: '4',
    index: 4,
    alarmTime: '2026-07-14 22:10:05',
    alarmName: '电压波动检测',
    alarmType: '阈值告警',
    alarmLevel: '严重',
    energyType: '电能',
    alarmLocation: '涂装车间',
    alarmDesc: '涂装车间电压波动至 195V，低于正常范围下限',
    pushPerson: '安全管理员',
    pushStatus: 'success',
    confirmed: true,
    status: 'recovered',
    recoverTime: '2026-07-14 23:00:00',
    confirmTime: '2026-07-14 22:15:00',
    confirmPerson: '安全管理员',
  },
  {
    id: '5',
    index: 5,
    alarmTime: '2026-07-13 09:00:00',
    alarmName: '照明能耗预警',
    alarmType: '用能告警（日）',
    alarmLevel: '一般',
    energyType: '电能',
    alarmLocation: '集成车间',
    alarmDesc: '集成车间昨日照明用电 132 kWh，超过日阈值 120 kWh',
    pushPerson: '值班长',
    pushStatus: 'success',
    confirmed: true,
    status: 'recovered',
    recoverTime: '2026-07-13 10:30:00',
    confirmTime: '2026-07-13 09:10:00',
    confirmPerson: '值班长',
  },
];

export default function AlarmData() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'history'>('realtime');
  const [searchForm, setSearchForm] = useState({
    alarmName: '',
    alarmType: '',
    alarmLevel: '',
    energyType: '',
    pushStatus: '',
    startTime: '2026-07-17 00:00:00',
    endTime: '2026-07-17 23:59:59',
  });

  const handleSearch = () => {
    console.log('搜索', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      alarmName: '',
      alarmType: '',
      alarmLevel: '',
      energyType: '',
      pushStatus: '',
      startTime: '2026-07-17 00:00:00',
      endTime: '2026-07-17 23:59:59',
    });
  };

  const handleConfirm = (id: string) => {
    console.log('确认告警', id);
  };

  const handleRetryPush = (id: string) => {
    console.log('重新推送', id);
  };

  const alarmData = activeTab === 'realtime' ? realtimeAlarms : historyAlarms;

  const getLevelClass = (level: string) => {
    if (level === '严重') return 'text-red-600 bg-red-100';
    if (level === '紧急') return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getLevelText = (level: string) => {
    return level;
  };

  const getStatusClass = (status: string) => {
    if (status === 'alarm') return 'text-red-500 bg-red-50';
    return 'text-green-500 bg-green-50';
  };

  const getStatusText = (status: string) => {
    if (status === 'alarm') return '告警中';
    return '已恢复';
  };

  const getPushStatusClass = (status: string) => {
    if (status === 'success') return 'text-green-600 bg-green-50';
    return 'text-red-500 bg-red-50';
  };

  const getPushStatusText = (status: string) => {
    if (status === 'success') return '已推送';
    return '推送失败';
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
                历史告警
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">告警名称:</span>
            <input
              type="text"
              value={searchForm.alarmName}
              onChange={(e) => setSearchForm({ ...searchForm, alarmName: e.target.value })}
              placeholder="请输入告警名称"
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 min-w-[200px]"
            />
            <span className="text-sm text-gray-600">告警类型:</span>
            <select
              value={searchForm.alarmType}
              onChange={(e) => setSearchForm({ ...searchForm, alarmType: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
            >
              <option value="">请选择告警类型</option>
              <option value="阈值告警">阈值告警</option>
              <option value="趋势告警">趋势告警</option>
              <option value="用能告警（日）">用能告警（日）</option>
              <option value="用能告警（月）">用能告警（月）</option>
            </select>
            <span className="text-sm text-gray-600">告警级别:</span>
            <select
              value={searchForm.alarmLevel}
              onChange={(e) => setSearchForm({ ...searchForm, alarmLevel: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
            >
              <option value="">请选择告警级别</option>
              <option value="严重">严重</option>
              <option value="紧急">紧急</option>
              <option value="一般">一般</option>
            </select>
            <span className="text-sm text-gray-600">能源类型:</span>
            <select
              value={searchForm.energyType}
              onChange={(e) => setSearchForm({ ...searchForm, energyType: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[180px]"
            >
              <option value="">请选择能源类型</option>
              <option value="电能">电能</option>
              <option value="水能">水能</option>
              <option value="天然气">天然气</option>
              <option value="压缩空气">压缩空气</option>
              <option value="氩气">氩气</option>
              <option value="二氧化碳">二氧化碳</option>
              <option value="热能">热能</option>
            </select>
            <span className="text-sm text-gray-600">推送状态:</span>
            <select
              value={searchForm.pushStatus}
              onChange={(e) => setSearchForm({ ...searchForm, pushStatus: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[160px]"
            >
              <option value="">全部</option>
              <option value="success">已推送</option>
              <option value="failed">推送失败</option>
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
            <table className="w-full text-sm min-w-[1800px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-3 text-center w-10 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">序号</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警时间</th>
                  {activeTab === 'history' && (
                    <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">恢复时间</th>
                  )}
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警名称</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警类型</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警级别</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">能源类型</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警位置</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">告警描述</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">推送人员</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">推送状态</th>
                  {activeTab === 'history' && (
                    <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">告警状态</th>
                  )}
                  {activeTab === 'history' && (
                    <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">确认时间</th>
                  )}
                  {activeTab === 'history' && (
                    <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">确认人</th>
                  )}
                  {activeTab === 'realtime' && (
                    <th className="px-3 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">操作</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {alarmData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.index}</td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.alarmTime}</td>
                    {activeTab === 'history' && (
                      <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.recoverTime}</td>
                    )}
                    <td className="px-3 py-3 text-center text-gray-800 font-medium whitespace-nowrap">{item.alarmName}</td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.alarmType}</td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelClass(item.alarmLevel)}`}>
                        {getLevelText(item.alarmLevel)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.energyType}</td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.alarmLocation}</td>
                    <td className="px-3 py-3 text-left text-gray-600 whitespace-nowrap max-w-[320px]" title={item.alarmDesc}>
                      {item.alarmDesc}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.pushPerson}</td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${getPushStatusClass(item.pushStatus)}`}>
                        {item.pushStatus === 'success' ? <Send className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {getPushStatusText(item.pushStatus)}
                      </span>
                    </td>
                    {activeTab === 'history' && (
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${getStatusClass(item.status)}`}>
                          {item.status === 'alarm' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {getStatusText(item.status)}
                        </span>
                      </td>
                    )}
                    {activeTab === 'history' && (
                      <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.confirmTime}</td>
                    )}
                    {activeTab === 'history' && (
                      <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">{item.confirmPerson}</td>
                    )}
                    {activeTab === 'realtime' && (
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          {!item.confirmed && (
                            <button
                              onClick={() => handleConfirm(item.id)}
                              className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
                            >
                              确认
                            </button>
                          )}
                          {item.confirmed && (
                            <span className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium">确认</span>
                          )}
                          <button
                            onClick={() => handleRetryPush(item.id)}
                            className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
                          >
                            重新推送
                          </button>
                        </div>
                      </td>
                    )}
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
