import { useState } from 'react';
import { Plus, Save, Calendar, Trash2, Edit2, X, ChevronDown } from 'lucide-react';

interface EntryData {
  id: string;
  date: string;
  energyType: string;
  location: string;
  meterReading: string;
  consumption: string;
}

const energyTypeOptions = [
  { value: 'gas', label: '天然气', unit: 'm³' },
];

const locationOptions = [
  { value: 'coating', label: '涂装车间' },
  { value: 'topcoat', label: '面漆线区' },
  { value: 'electrophoresis', label: '电泳区' },
];

const mockData: EntryData[] = [
  { id: '1', date: '2026-07-02', energyType: 'gas', location: 'coating', meterReading: '125680.5', consumption: '356.8' },
  { id: '2', date: '2026-07-02', energyType: 'gas', location: 'topcoat', meterReading: '126037.3', consumption: '385.2' },
  { id: '3', date: '2026-07-02', energyType: 'gas', location: 'electrophoresis', meterReading: '126422.5', consumption: '412.7' },
  { id: '4', date: '2026-07-01', energyType: 'gas', location: 'coating', meterReading: '126789.3', consumption: '398.1' },
  { id: '5', date: '2026-07-01', energyType: 'gas', location: 'topcoat', meterReading: '127156.8', consumption: '405.2' },
];

interface ModalState {
  show: boolean;
  isEdit: boolean;
  entry: EntryData;
}

const emptyEntry: EntryData = {
  id: '',
  date: '',
  energyType: 'gas',
  location: '',
  meterReading: '',
  consumption: ''
};

export default function ManualEntry() {
  const [entries, setEntries] = useState<EntryData[]>(mockData);
  const [modalState, setModalState] = useState<ModalState>({
    show: false,
    isEdit: false,
    entry: { ...emptyEntry }
  });

  const handleAdd = () => {
    setModalState({
      show: true,
      isEdit: false,
      entry: { ...emptyEntry }
    });
  };

  const handleEdit = (entry: EntryData) => {
    setModalState({
      show: true,
      isEdit: true,
      entry: { ...entry }
    });
  };

  const handleClose = () => {
    setModalState({
      show: false,
      isEdit: false,
      entry: { ...emptyEntry }
    });
  };

  const handleSave = () => {
    const { isEdit, entry } = modalState;

    if (!entry.date || !entry.energyType || !entry.location || !entry.meterReading || !entry.consumption) {
      alert('请填写完整信息');
      return;
    }

    if (isEdit) {
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
    } else {
      const newEntry: EntryData = {
        ...entry,
        id: Date.now().toString()
      };
      setEntries(prev => [...prev, newEntry]);
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleInputChange = (field: keyof EntryData, value: string) => {
    setModalState(prev => ({
      ...prev,
      entry: { ...prev.entry, [field]: value }
    }));
  };

  const getEnergyLabel = (value: string) => {
    return energyTypeOptions.find(e => e.value === value)?.label || value;
  };

  const getEnergyUnit = (value: string) => {
    return energyTypeOptions.find(e => e.value === value)?.unit || '';
  };

  const getLocationLabel = (value: string) => {
    return locationOptions.find(l => l.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">手工录入（宏奥）</h1>
              <p className="text-sm text-gray-500 mt-1">录入能源每日数据</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加记录
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#2c5bb5' }}>
                  <th className="px-4 py-3 text-center font-semibold text-white">序号</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">日期</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">能源类型</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">区域位置</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">今日读数</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">日消耗量</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">操作</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-center text-gray-600">{idx + 1}</td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium">{entry.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                        {getEnergyLabel(entry.energyType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {getLocationLabel(entry.location)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{entry.meterReading} {getEnergyUnit(entry.energyType)}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-800">{entry.consumption} {getEnergyUnit(entry.energyType)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-500 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          删除
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

      {modalState.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {modalState.isEdit ? '编辑记录' : '新增记录'}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">日期</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={modalState.entry.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">能源类型</label>
                <div className="relative">
                  <select
                    value={modalState.entry.energyType}
                    onChange={(e) => handleInputChange('energyType', e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 pr-8 bg-white"
                  >
                    {energyTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}（{opt.unit}）
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">区域位置</label>
                <div className="relative">
                  <select
                    value={modalState.entry.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 pr-8 bg-white"
                  >
                    <option value="">请选择区域位置</option>
                    {locationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  今日读数 ({getEnergyUnit(modalState.entry.energyType)})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={modalState.entry.meterReading}
                  onChange={(e) => handleInputChange('meterReading', e.target.value)}
                  placeholder="输入今日读数"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
