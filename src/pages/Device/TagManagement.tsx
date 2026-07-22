import { useState } from 'react';
import { Plus, Upload, Download, Trash2, ChevronLeft, ChevronRight, X, Save } from 'lucide-react';

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

interface FormData {
  tagId: string;
  tagName: string;
  tagDesc: string;
  sensorName: string;
  dataType: string;
  unit: string;
  sort: string;
}

const tagData: TagItem[] = [
  {
    id: '1',
    index: 1,
    tagId: 'V_A10093',
    tagName: '电压',
    tagType: '电表标签',
    tagDesc: '1#配电柜A相电压',
    sort: 0,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'V',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
  {
    id: '2',
    index: 2,
    tagId: 'I_A10093',
    tagName: '电流',
    tagType: '电表标签',
    tagDesc: '1#配电柜A相电流',
    sort: 1,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'A',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
  {
    id: '3',
    index: 3,
    tagId: 'P_A10093',
    tagName: '有功功率',
    tagType: '电表标签',
    tagDesc: '1#配电柜有功功率',
    sort: 2,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'kW',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
  {
    id: '4',
    index: 4,
    tagId: 'Q_A10093',
    tagName: '无功功率',
    tagType: '电表标签',
    tagDesc: '1#配电柜无功功率',
    sort: 3,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'kvar',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
  {
    id: '5',
    index: 5,
    tagId: 'PF_A10093',
    tagName: '功率因数',
    tagType: '电表标签',
    tagDesc: '1#配电柜功率因数',
    sort: 4,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'cosφ',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
  {
    id: '6',
    index: 6,
    tagId: 'F_A10093',
    tagName: '频率',
    tagType: '电表标签',
    tagDesc: '1#配电柜电网频率',
    sort: 5,
    sensorName: '1#配电柜电表',
    dataType: '浮点',
    unit: 'Hz',
    createTime: '2025-04-23',
    updateTime: '2025-04-23',
  },
];

export default function TagManagement() {
  const [sensorName, setSensorName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '5']);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tagId: '',
    tagName: '',
    tagDesc: '',
    sensorName: '',
    dataType: '浮点',
    unit: '',
    sort: '',
  });

  const handleSearch = () => {
    console.log('搜索', sensorName);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      tagId: '',
      tagName: '',
      tagDesc: '',
      sensorName: '',
      dataType: '浮点',
      unit: '',
      sort: '',
    });
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('新增标签', formData);
    handleCloseModal();
  };

  const handleImport = () => {
    console.log('导入');
  };

  const handleExport = () => {
    console.log('导出');
  };

  const handleBatchDelete = () => {
    console.log('批量删除', selectedIds);
  };

  const handleSelectDevice = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tagData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tagData.map(d => d.id));
    }
  };

  const handleEdit = (id: string) => {
    console.log('编辑', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除', id);
  };

  const totalPages = Math.ceil(tagData.length / pageSize);
  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">名称:</span>
              <input
                type="text"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[200px]"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                查询
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Plus className="w-4 h-4" />
                新增标签
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                批量删除
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === tagData.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">标签ID</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">标签名称</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">标签描述</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">所属设备</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">数据类型</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">单位</th>
                  <th className="px-4 py-3 text-center font-semibold text-red-500">排序</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">更新时间</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {tagData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectDevice(item.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-800">{item.tagId}</td>
                    <td className="px-4 py-3 text-center text-gray-800">{item.tagName}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.tagDesc}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.sensorName}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.dataType}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3 text-center text-red-500">{item.sort}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.createTime}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.updateTime}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
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

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[32px] h-[32px] flex items-center justify-center rounded text-sm font-medium ${
                    currentPage === page
                      ? 'bg-[#10469c] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-200 rounded"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>
              <span className="text-sm text-gray-500">
                跳至 <input type="text" defaultValue="5" className="w-12 px-2 py-1 text-sm border border-gray-200 rounded mx-1" /> 页
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">新增标签</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">标签ID</span>
                <input
                  type="text"
                  value={formData.tagId}
                  onChange={(e) => handleFormChange('tagId', e.target.value)}
                  placeholder="请输入标签ID"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">标签名称</span>
                <input
                  type="text"
                  value={formData.tagName}
                  onChange={(e) => handleFormChange('tagName', e.target.value)}
                  placeholder="请输入标签名称"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">标签描述</span>
                <input
                  type="text"
                  value={formData.tagDesc}
                  onChange={(e) => handleFormChange('tagDesc', e.target.value)}
                  placeholder="请输入标签描述"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">所属设备</span>
                <input
                  type="text"
                  value={formData.sensorName}
                  onChange={(e) => handleFormChange('sensorName', e.target.value)}
                  placeholder="请输入所属设备"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">数据类型</span>
                <select
                  value={formData.dataType}
                  onChange={(e) => handleFormChange('dataType', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                >
                  <option value="浮点">浮点</option>
                  <option value="整数">整数</option>
                  <option value="字符串">字符串</option>
                  <option value="布尔">布尔</option>
                  <option value="日期">日期</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">单位</span>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleFormChange('unit', e.target.value)}
                  placeholder="请输入单位"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-24">排序</span>
                <input
                  type="number"
                  value={formData.sort}
                  onChange={(e) => handleFormChange('sort', e.target.value)}
                  placeholder="请输入排序"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
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
