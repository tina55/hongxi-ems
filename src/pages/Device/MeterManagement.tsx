import { useState } from 'react';
import { Plus, Upload, Download, Trash2, X, Edit2, Settings } from 'lucide-react';

interface MeterItem {
  id: string;
  circuitName: string;
  currentRatio: string;
  voltageRatio: string;
  meterModel: string;
  meterCode: string;
  meterUniqueId: string;
}

const meterData: MeterItem[] = [
  { id: '1', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56910', meterUniqueId: '12107210930028_1' },
  { id: '2', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56911', meterUniqueId: '12107210930028_2' },
  { id: '3', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56912', meterUniqueId: '12107210930028_3' },
  { id: '4', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56913', meterUniqueId: '12107210930028_4' },
  { id: '5', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56914', meterUniqueId: '12107210930028_5' },
  { id: '6', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56915', meterUniqueId: '12107210930028_6' },
  { id: '7', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56916', meterUniqueId: '12107210930028_7' },
  { id: '8', circuitName: '海荣空调面...', currentRatio: '1', voltageRatio: '1', meterModel: 'HRJN-2010C', meterCode: 'k56917', meterUniqueId: '12107210930028_8' },
];

const meterModelOptions = [
  { value: 'HRJN-2010C', label: 'HRJN-2010C' },
  { value: 'HRJN-2010D', label: 'HRJN-2010D' },
  { value: 'HRJN-2020A', label: 'HRJN-2020A' },
];

interface TagItem {
  id: string;
  index: number;
  tagId: string;
  tagName: string;
  tagType: string;
  tagDesc: string;
  sort: number;
  sensorName: string;
  dataType: string;
  unit: string;
  createTime: string;
  updateTime: string;
}

const tagData: TagItem[] = [
  { id: '1', index: 1, tagId: 'V_A10093', tagName: '电压', tagType: '电表标签', tagDesc: '1#配电柜A相电压', sort: 0, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'V', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '2', index: 2, tagId: 'I_A10093', tagName: '电流', tagType: '电表标签', tagDesc: '1#配电柜A相电流', sort: 1, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'A', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '3', index: 3, tagId: 'P_A10093', tagName: '有功功率', tagType: '电表标签', tagDesc: '1#配电柜有功功率', sort: 2, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'kW', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '4', index: 4, tagId: 'Q_A10093', tagName: '无功功率', tagType: '电表标签', tagDesc: '1#配电柜无功功率', sort: 3, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'kvar', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '5', index: 5, tagId: 'PF_A10093', tagName: '功率因数', tagType: '电表标签', tagDesc: '1#配电柜功率因数', sort: 4, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'cosφ', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '6', index: 6, tagId: 'F_A10093', tagName: '频率', tagType: '电表标签', tagDesc: '1#配电柜电网频率', sort: 5, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'Hz', createTime: '2025-04-23', updateTime: '2025-04-23' },
];

export default function MeterManagement() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '5']);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 测点配置弹窗状态
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [currentMeterName, setCurrentMeterName] = useState('');
  const [tagSearchName, setTagSearchName] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagCurrentPage, setTagCurrentPage] = useState(1);
  const tagPageSize = 10;

  const [formData, setFormData] = useState({
    meterModel: '',
    circuitName: '',
    meterCode: '',
    voltageRatio: '1',
    currentRatio: '1',
    offlineAlarm: false,
    installImage: '',
    remark: '',
  });

  const handleAdd = () => {
    setIsEdit(false);
    setFormData({
      meterModel: '',
      circuitName: '',
      meterCode: '',
      voltageRatio: '1',
      currentRatio: '1',
      offlineAlarm: false,
      installImage: '',
      remark: '',
    });
    setModalVisible(true);
  };

  const handleEdit = (item: MeterItem) => {
    setIsEdit(true);
    setFormData({
      meterModel: item.meterModel,
      circuitName: item.circuitName,
      meterCode: item.meterCode,
      voltageRatio: item.voltageRatio,
      currentRatio: item.currentRatio,
      offlineAlarm: false,
      installImage: '',
      remark: '',
    });
    setModalVisible(true);
  };

  const handleTagConfig = (item: MeterItem) => {
    setCurrentMeterName(item.circuitName);
    setTagModalVisible(true);
  };

  const handleDelete = (id: string) => {
    console.log('删除', id);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    console.log('保存', formData);
    setModalVisible(false);
  };

  const handleSelectDevice = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === meterData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(meterData.map(d => d.id));
    }
  };

  const total = meterData.length;
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Plus className="w-4 h-4" />
                新增
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button
                onClick={() => console.log('批量删除', selectedIds)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                批量删除
              </button>
            </div>
            <div className="text-sm text-gray-500">
              已选择 <span className="text-[#10469c] font-medium">{selectedIds.length}</span> 项
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#10469c] text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === meterData.length && meterData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#10469c] focus:ring-[#10469c]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">回路名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">电流变比</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">电压变比</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">仪表型号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">仪表代号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">仪表唯一编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium w-32">操作</th>
                </tr>
              </thead>
              <tbody>
                {meterData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedIds.includes(item.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectDevice(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#10469c] focus:ring-[#10469c]"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs">⧉</span>
                        {item.circuitName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.currentRatio}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.voltageRatio}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.meterModel}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.meterCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs">⧉</span>
                        {item.meterUniqueId}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTagConfig(item)}
                          className="text-sm text-[#10469c] hover:text-[#0d3a80] transition-colors"
                        >
                          测点配置
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-sm text-[#10469c] hover:text-[#0d3a80] transition-colors"
                        >
                          编辑
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-sm text-red-500 hover:text-red-600 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              共 <span className="font-medium text-gray-700">{total}</span> 条
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-[#10469c] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">{isEdit ? '编辑表计' : '新增表计'}</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">仪表型号</label>
                <select
                  value={formData.meterModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, meterModel: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                >
                  <option value="">请选择</option>
                  {meterModelOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>回路名称
                </label>
                <input
                  type="text"
                  value={formData.circuitName}
                  onChange={(e) => setFormData(prev => ({ ...prev, circuitName: e.target.value }))}
                  placeholder="请输入回路名称"
                  className="flex-1 px-3 py-2 text-sm border border-red-300 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>
              {formData.circuitName === '' && (
                <div className="pl-36 -mt-3">
                  <span className="text-xs text-red-500">该字段是必须的</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">表计编码</label>
                <input
                  type="text"
                  value={formData.meterCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, meterCode: e.target.value }))}
                  placeholder="请输入表计编码"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>电压变比
                </label>
                <input
                  type="text"
                  value={formData.voltageRatio}
                  onChange={(e) => setFormData(prev => ({ ...prev, voltageRatio: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>电流变比
                </label>
                <input
                  type="text"
                  value={formData.currentRatio}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentRatio: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>离线报警
                </label>
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="offlineAlarm"
                      checked={formData.offlineAlarm === true}
                      onChange={() => setFormData(prev => ({ ...prev, offlineAlarm: true }))}
                      className="w-4 h-4 text-[#10469c]"
                    />
                    <span className="text-sm text-gray-700">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="offlineAlarm"
                      checked={formData.offlineAlarm === false}
                      onChange={() => setFormData(prev => ({ ...prev, offlineAlarm: false }))}
                      className="w-4 h-4 text-[#10469c]"
                    />
                    <span className="text-sm text-[#10469c]">否</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">安装图片</label>
                <div className="flex flex-col gap-2">
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500">上传图片大小不能超过 10M!</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <label className="w-32 pt-2 text-right text-sm font-medium text-gray-700">备注</label>
                <div className="flex-1">
                  <textarea
                    value={formData.remark}
                    onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value.slice(0, 200) }))}
                    placeholder="请输入备注"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 resize-y"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{formData.remark.length}/200</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
                >
                  确认
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-8 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 测点配置弹窗 */}
      {tagModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">测点配置 - {currentMeterName}</h3>
              <button onClick={() => setTagModalVisible(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* 搜索和操作栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">标签名称：</label>
                  <input
                    type="text"
                    value={tagSearchName}
                    onChange={(e) => setTagSearchName(e.target.value)}
                    placeholder="请输入标签名称"
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-48"
                  />
                </div>
                <button
                  onClick={() => console.log('搜索标签', tagSearchName)}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
                >
                  查询
                </button>
                <button
                  onClick={() => setTagSearchName('')}
                  className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => console.log('新增标签')}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新增标签
                </button>
                <button
                  onClick={() => console.log('导入标签')}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  导入
                </button>
                <button
                  onClick={() => console.log('导出标签')}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  导出
                </button>
                <button
                  onClick={() => console.log('批量删除标签', selectedTagIds)}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  批量删除
                </button>
              </div>
            </div>

            {/* 标签列表 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#10469c] text-white">
                    <th className="px-3 py-3 text-left text-sm font-medium w-12">
                      <input
                        type="checkbox"
                        checked={selectedTagIds.length === tagData.length && tagData.length > 0}
                        onChange={() => {
                          if (selectedTagIds.length === tagData.length) {
                            setSelectedTagIds([]);
                          } else {
                            setSelectedTagIds(tagData.map(t => t.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[#10469c] focus:ring-[#10469c]"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-sm font-medium">标签ID</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">标签名称</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">标签描述</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">数据类型</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">单位</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">排序</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">创建时间</th>
                    <th className="px-3 py-3 text-left text-sm font-medium">更新时间</th>
                    <th className="px-3 py-3 text-left text-sm font-medium w-32">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {tagData.map((tag) => (
                    <tr
                      key={tag.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedTagIds.includes(tag.id) ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={() => {
                            setSelectedTagIds(prev =>
                              prev.includes(tag.id) ? prev.filter(i => i !== tag.id) : [...prev, tag.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#10469c] focus:ring-[#10469c]"
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.tagId}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.tagName}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.tagDesc}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.dataType}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.unit}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.sort}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.createTime}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{tag.updateTime}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => console.log('编辑标签', tag.id)}
                            className="text-sm text-[#10469c] hover:text-[#0d3a80] transition-colors"
                          >
                            编辑
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => console.log('删除标签', tag.id)}
                            className="text-sm text-red-500 hover:text-red-600 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                已选择 <span className="text-[#10469c] font-medium">{selectedTagIds.length}</span> 项，共 <span className="font-medium text-gray-700">{tagData.length}</span> 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTagCurrentPage(Math.max(1, tagCurrentPage - 1))}
                  disabled={tagCurrentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>
                <button
                  onClick={() => setTagCurrentPage(Math.min(Math.ceil(tagData.length / tagPageSize), tagCurrentPage + 1))}
                  disabled={tagCurrentPage >= Math.ceil(tagData.length / tagPageSize)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
