import { useState } from 'react';
import { Search, Download, Plus, X, Minus, Users } from 'lucide-react';
import { treeData } from '@/data/treeData';

interface AlarmRule {
  id: string;
  ruleName: string;
  alarmType: string;
  energyType: string;
  areaLocation: string;
  alarmCondition: string;
  severityLevel: '严重' | '紧急' | '一般';
  status: boolean;
  pushPerson: string;
}

interface ConditionItem {
  operator: string;
  threshold: string;
  unit: string;
}

const alarmRules: AlarmRule[] = [
  { id: '1', ruleName: '总用电越限', alarmType: '阈值告警', energyType: '电能', areaLocation: '宏奥厂区', alarmCondition: '≥ 520 kWh', severityLevel: '严重', status: true, pushPerson: '系统管理员' },
  { id: '2', ruleName: '空调能耗过高', alarmType: '趋势告警', energyType: '电能', areaLocation: '数控车间', alarmCondition: '区间 300 ~ 400 kWh', severityLevel: '紧急', status: true, pushPerson: '运维工程师' },
  { id: '3', ruleName: '照明能耗预警', alarmType: '用能告警（日）', energyType: '电能', areaLocation: '集成车间', alarmCondition: '≥ 120 kWh', severityLevel: '一般', status: false, pushPerson: '值班长' },
  { id: '4', ruleName: '电压波动检测', alarmType: '阈值告警', energyType: '电能', areaLocation: '涂装车间', alarmCondition: '≤ 198V 或 ≥ 242V', severityLevel: '严重', status: true, pushPerson: '安全管理员' },
  { id: '5', ruleName: '功率因数过低', alarmType: '用能告警（月）', energyType: '电能', areaLocation: 'V80车间', alarmCondition: '≤ 0.85', severityLevel: '紧急', status: false, pushPerson: '审计管理员' },
];

const operatorOptions = [
  { value: '>', label: '大于 >' },
  { value: '<', label: '小于 <' },
  { value: '=', label: '等于 =' },
  { value: '>=', label: '大于等于 >=' },
];

const roleOptions = [
  { id: '1', name: '系统管理员' },
  { id: '2', name: '安全管理员' },
  { id: '3', name: '运维工程师' },
  { id: '4', name: '值班长' },
  { id: '5', name: '审计管理员' },
];

const positionOptions = [
  { id: '1', name: '生产主管' },
  { id: '2', name: '设备主管' },
  { id: '3', name: '电气工程师' },
  { id: '4', name: '项目经理' },
  { id: '5', name: '质量经理' },
];

const personOptions = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
  { id: '4', name: '赵六' },
  { id: '5', name: '孙七' },
  { id: '6', name: '周八' },
];

const getChildrenById = (nodeId: string | null, data: typeof treeData = treeData): { id: string; name: string }[] => {
  if (!nodeId) {
    return data.map(node => ({ id: node.id, name: node.name }));
  }
  const findNode = (nodes: typeof treeData): any => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  const node = findNode(data);
  return node?.children ? node.children.map((child: any) => ({ id: child.id, name: child.name })) : [];
};

export default function AlarmConfig() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rules, setRules] = useState(alarmRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    ruleName: '',
    alarmType: '阈值告警',
    energyType: '电能',
    areaLevel1: '',
    areaLevel2: '',
    areaLevel3: '',
    conditions: [{ operator: '>=', threshold: '', unit: 'kWh' }],
    duration: '连续 3 个周期',
    trendType: '上升趋势',
    trendRate: '',
    analysisWindow: '最近 1 小时',
    severityLevel: '紧急',
    status: '启用',
  });

  const [pushFormData, setPushFormData] = useState({
    pushType: '角色',
    selectedRoles: [] as string[],
    selectedPositions: [] as string[],
    selectedPersons: [] as string[],
  });

  const handleSearch = () => console.log('搜索', searchTerm);
  const handleExport = () => console.log('导出');
  const handleEdit = (id: string) => console.log('编辑', id);

  const handleAdd = () => {
    setFormData({
      ruleName: '',
      alarmType: '阈值告警',
      energyType: '电能',
      areaLevel1: '',
      areaLevel2: '',
      areaLevel3: '',
      conditions: [{ operator: '>=', threshold: '', unit: 'kWh' }],
      duration: '连续 3 个周期',
      trendType: '上升趋势',
      trendRate: '',
      analysisWindow: '最近 1 小时',
      severityLevel: '紧急',
      status: '启用',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    setSelectedRuleIds(selectedRuleIds.filter(rid => rid !== id));
  };

  const handleToggleStatus = (id: string) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, status: !rule.status } : rule));
  };

  const handleSelectRule = (id: string) => {
    if (selectedRuleIds.includes(id)) {
      setSelectedRuleIds(selectedRuleIds.filter(rid => rid !== id));
    } else {
      setSelectedRuleIds([...selectedRuleIds, id]);
    }
  };

  const handleSelectAllRules = () => {
    if (selectedRuleIds.length === filteredRules.length) {
      setSelectedRuleIds([]);
    } else {
      setSelectedRuleIds(filteredRules.map(r => r.id));
    }
  };

  const handleOpenPushModal = () => {
    setPushFormData({
      pushType: '角色',
      selectedRoles: [],
      selectedPositions: [],
      selectedPersons: [],
    });
    setIsPushModalOpen(true);
  };

  const handleSavePushConfig = () => {
    const pushNames: string[] = [];
    if (pushFormData.pushType === '角色') {
      pushNames.push(...pushFormData.selectedRoles.map(id => roleOptions.find(r => r.id === id)?.name || ''));
    } else if (pushFormData.pushType === '岗位') {
      pushNames.push(...pushFormData.selectedPositions.map(id => positionOptions.find(p => p.id === id)?.name || ''));
    } else {
      pushNames.push(...pushFormData.selectedPersons.map(id => personOptions.find(p => p.id === id)?.name || ''));
    }
    const pushPerson = pushNames.join(', ') || '未设置';
    setRules(rules.map(rule => selectedRuleIds.includes(rule.id) ? { ...rule, pushPerson } : rule));
    setIsPushModalOpen(false);
  };

  const handleAreaLevelChange = (level: number, value: string) => {
    const newData = { ...formData };
    if (level === 1) {
      newData.areaLevel1 = value;
      newData.areaLevel2 = '';
      newData.areaLevel3 = '';
    } else if (level === 2) {
      newData.areaLevel2 = value;
      newData.areaLevel3 = '';
    } else {
      newData.areaLevel3 = value;
    }
    setFormData(newData);
  };

  const handleConditionChange = (index: number, field: keyof ConditionItem, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  const addCondition = () => {
    if (formData.conditions.length < 5) {
      setFormData({
        ...formData,
        conditions: [...formData.conditions, { operator: '>=', threshold: '', unit: 'kWh' }],
      });
    }
  };

  const removeCondition = (index: number) => {
    if (formData.conditions.length > 1) {
      const newConditions = formData.conditions.filter((_, i) => i !== index);
      setFormData({ ...formData, conditions: newConditions });
    }
  };

  const handleSave = () => {
    const areaNames = [];
    if (formData.areaLevel1) {
      const level1 = getChildrenById(null).find(n => n.id === formData.areaLevel1);
      if (level1) areaNames.push(level1.name);
    }
    if (formData.areaLevel2) {
      const level2 = getChildrenById(formData.areaLevel1).find(n => n.id === formData.areaLevel2);
      if (level2) areaNames.push(level2.name);
    }
    if (formData.areaLevel3) {
      const level3 = getChildrenById(formData.areaLevel2).find(n => n.id === formData.areaLevel3);
      if (level3) areaNames.push(level3.name);
    }

    const conditionText = formData.conditions
      .map(c => `${c.operator} ${c.threshold} ${c.unit}`)
      .join(' 且 ');

    const newRule: AlarmRule = {
      id: Date.now().toString(),
      ruleName: formData.ruleName,
      alarmType: formData.alarmType,
      energyType: formData.energyType,
      areaLocation: areaNames.join(' > '),
      alarmCondition: conditionText,
      severityLevel: formData.severityLevel as '严重' | '紧急' | '一般',
      status: formData.status === '启用',
      pushPerson: '未设置',
    };
    setRules([newRule, ...rules]);
    setIsModalOpen(false);
  };

  const getSeverityClass = (level: string) => {
    if (level === '严重') return 'text-red-600 bg-red-100';
    if (level === '紧急') return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getSeverityText = (level: string) => {
    return level;
  };

  const filteredRules = rules.filter(rule =>
    rule.ruleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const level1Options = getChildrenById(null);
  const level2Options = formData.areaLevel1 ? getChildrenById(formData.areaLevel1) : [];
  const level3Options = formData.areaLevel2 ? getChildrenById(formData.areaLevel2) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索阈值规则..."
                  className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg w-[280px] focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>
              <button onClick={handleSearch} className="px-4 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-lg hover:bg-[#0d3a80] transition-colors">搜索</button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />导出
              </button>
              <button onClick={handleOpenPushModal} disabled={selectedRuleIds.length === 0} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-lg hover:bg-[#0d3a80] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                <Users className="w-4 h-4" />批量设置推送人员
              </button>
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-lg hover:bg-[#0d3a80] transition-colors">
                <Plus className="w-4 h-4" />新增规则
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-center font-semibold text-gray-700 w-14">
                    <input type="checkbox" checked={selectedRuleIds.length === filteredRules.length && filteredRules.length > 0} onChange={handleSelectAllRules} className="w-4 h-4 text-[#10469c] border-gray-300 rounded focus:ring-[#10469c]" />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">规则名称</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">告警类型</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">能源类型</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">区域位置</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">告警条件</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">严重等级</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">推送人员</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" checked={selectedRuleIds.includes(rule.id)} onChange={() => handleSelectRule(rule.id)} className="w-4 h-4 text-[#10469c] border-gray-300 rounded focus:ring-[#10469c]" />
                    </td>
                    <td className="px-6 py-4"><span className="font-medium text-gray-800">{rule.ruleName}</span></td>
                    <td className="px-6 py-4 text-gray-600">{rule.alarmType}</td>
                    <td className="px-6 py-4 text-gray-600">{rule.energyType}</td>
                    <td className="px-6 py-4 text-gray-600">{rule.areaLocation}</td>
                    <td className="px-6 py-4 text-gray-600">{rule.alarmCondition}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityClass(rule.severityLevel)}`}>
                        {getSeverityText(rule.severityLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{rule.pushPerson}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleToggleStatus(rule.id)} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${rule.status ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {rule.status ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(rule.id)} className="text-sm font-medium text-[#10469c] hover:text-[#0d3a80] transition-colors">编辑</button>
                        <button onClick={() => handleDelete(rule.id)} className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">新建告警规则</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">告警规则名称 <span className="text-red-500">*</span></label>
                <input type="text" value={formData.ruleName} onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })} placeholder="例：空调用电过高" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">告警类型 <span className="text-red-500">*</span></label>
                <select value={formData.alarmType} onChange={(e) => setFormData({ ...formData, alarmType: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  <option value="阈值告警">阈值告警</option>
                  <option value="趋势告警">趋势告警</option>
                  <option value="用能告警（日）">用能告警（日）</option>
                  <option value="用能告警（月）">用能告警（月）</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">能源类型 <span className="text-red-500">*</span></label>
                <select value={formData.energyType} onChange={(e) => setFormData({ ...formData, energyType: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  <option value="电能">电能</option>
                  <option value="水能">水能</option>
                  <option value="天然气">天然气</option>
                  <option value="压缩空气">压缩空气</option>
                  <option value="氩气">氩气</option>
                  <option value="二氧化碳">二氧化碳</option>
                  <option value="热能">热能</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">区域位置 <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={formData.areaLevel1} onChange={(e) => handleAreaLevelChange(1, e.target.value)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[150px]">
                    <option value="">请选择厂区</option>
                    {level1Options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                  </select>
                  {formData.areaLevel1 && (
                    <>
                      <span className="text-gray-400">{'>'}</span>
                      <select value={formData.areaLevel2} onChange={(e) => handleAreaLevelChange(2, e.target.value)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[150px]">
                        <option value="">请选择车间</option>
                        {level2Options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </select>
                    </>
                  )}
                  {formData.areaLevel2 && (
                    <>
                      <span className="text-gray-400">{'>'}</span>
                      <select value={formData.areaLevel3} onChange={(e) => handleAreaLevelChange(3, e.target.value)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[150px]">
                        <option value="">请选择区域</option>
                        {level3Options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </select>
                    </>
                  )}
                </div>
              </div>

              {formData.alarmType !== '趋势告警' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">告警条件 <span className="text-red-500">*</span></label>
                    <div className="space-y-3">
                      {formData.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <select value={condition.operator} onChange={(e) => handleConditionChange(index, 'operator', e.target.value)} className="flex-shrink-0 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[120px]">
                            {operatorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <input type="text" value={condition.threshold} onChange={(e) => handleConditionChange(index, 'threshold', e.target.value)} placeholder="阈值" className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
                          <select value={condition.unit} onChange={(e) => handleConditionChange(index, 'unit', e.target.value)} className="flex-shrink-0 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white min-w-[100px]">
                            <option value="kWh">kWh</option>
                            <option value="V">V</option>
                            <option value="A">A</option>
                            <option value="°C">°C</option>
                            <option value="%RH">%RH</option>
                            <option value="MPa">MPa</option>
                            <option value="Nm³">Nm³</option>
                          </select>
                          {formData.conditions.length > 1 && (
                            <button onClick={() => removeCondition(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {formData.conditions.length < 5 && (
                        <button onClick={addCondition} className="flex items-center gap-2 text-sm text-[#10469c] hover:text-[#0d3a80] transition-colors">
                          <Plus className="w-4 h-4" />添加条件
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.alarmType !== '用能告警（日）' && formData.alarmType !== '用能告警（月）' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">持续时间（防误报）</label>
                      <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                        <option value="立即触发">立即触发</option>
                        <option value="连续 3 个周期">连续 3 个周期</option>
                        <option value="连续 5 个周期">连续 5 个周期</option>
                        <option value="连续 10 个周期">连续 10 个周期</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">连续超过阈值一定次数后才触发告警，避免瞬时波动</p>
                    </div>
                  )}
                </>
              )}

              {formData.alarmType === '趋势告警' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">趋势类型 <span className="text-red-500">*</span></label>
                    <select value={formData.trendType} onChange={(e) => setFormData({ ...formData, trendType: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                      <option value="上升趋势">上升趋势</option>
                      <option value="下降趋势">下降趋势</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">变化速率阈值 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-3">
                      <input type="text" value={formData.trendRate} onChange={(e) => setFormData({ ...formData, trendRate: e.target.value })} placeholder="变化速率阈值" className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
                      <span className="text-gray-600 whitespace-nowrap">% / 小时</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分析窗口 <span className="text-red-500">*</span></label>
                    <select value={formData.analysisWindow} onChange={(e) => setFormData({ ...formData, analysisWindow: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                      <option value="最近 1 小时">最近 1 小时</option>
                      <option value="最近 2 小时">最近 2 小时</option>
                      <option value="最近 4 小时">最近 4 小时</option>
                      <option value="最近 8 小时">最近 8 小时</option>
                      <option value="最近 12 小时">最近 12 小时</option>
                      <option value="最近 24 小时">最近 24 小时</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">告警等级 <span className="text-red-500">*</span></label>
                <select value={formData.severityLevel} onChange={(e) => setFormData({ ...formData, severityLevel: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  <option value="严重">严重</option>
                  <option value="紧急">紧急</option>
                  <option value="一般">一般</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  <option value="启用">启用</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-lg hover:bg-[#0d3a80] transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}

      {isPushModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">批量设置推送人员</h2>
              <button onClick={() => setIsPushModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">告警推送 <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  {['角色', '岗位', '具体人员'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="pushType" value={type} checked={pushFormData.pushType === type} onChange={(e) => setPushFormData({ ...pushFormData, pushType: e.target.value })} className="w-4 h-4 text-[#10469c] border-gray-300 focus:ring-[#10469c]" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                {pushFormData.pushType === '角色' && (
                  <div className="p-4 space-y-2">
                    {roleOptions.map(role => (
                      <label key={role.id} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={pushFormData.selectedRoles.includes(role.id)} onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [...pushFormData.selectedRoles, role.id]
                            : pushFormData.selectedRoles.filter(id => id !== role.id);
                          setPushFormData({ ...pushFormData, selectedRoles: newSelected });
                        }} className="w-4 h-4 text-[#10469c] border-gray-300 rounded focus:ring-[#10469c]" />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                )}

                {pushFormData.pushType === '岗位' && (
                  <div className="p-4 space-y-2">
                    {positionOptions.map(pos => (
                      <label key={pos.id} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={pushFormData.selectedPositions.includes(pos.id)} onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [...pushFormData.selectedPositions, pos.id]
                            : pushFormData.selectedPositions.filter(id => id !== pos.id);
                          setPushFormData({ ...pushFormData, selectedPositions: newSelected });
                        }} className="w-4 h-4 text-[#10469c] border-gray-300 rounded focus:ring-[#10469c]" />
                        <span className="text-sm text-gray-700">{pos.name}</span>
                      </label>
                    ))}
                  </div>
                )}

                {pushFormData.pushType === '具体人员' && (
                  <div className="p-4 space-y-2">
                    {personOptions.map(person => (
                      <label key={person.id} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={pushFormData.selectedPersons.includes(person.id)} onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [...pushFormData.selectedPersons, person.id]
                            : pushFormData.selectedPersons.filter(id => id !== person.id);
                          setPushFormData({ ...pushFormData, selectedPersons: newSelected });
                        }} className="w-4 h-4 text-[#10469c] border-gray-300 rounded focus:ring-[#10469c]" />
                        <span className="text-sm text-gray-700">{person.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setIsPushModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={handleSavePushConfig} className="px-5 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-lg hover:bg-[#0d3a80] transition-colors">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
