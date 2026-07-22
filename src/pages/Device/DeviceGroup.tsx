import { useState } from 'react';
import { Search, RotateCcw, Plus, Edit, Trash2, ChevronDown, ChevronRight, Folder, X } from 'lucide-react';
import { treeData } from '@/data/treeData';

interface DeviceGroup {
  id: string;
  name: string;
  sort: number;
  createTime: string;
  deviceCount: number;
  children?: DeviceGroup[];
  expanded?: boolean;
}

function generateGroupsFromTree(): DeviceGroup[] {
  const groups: DeviceGroup[] = [];
  let sortIndex = 0;

  treeData.forEach((factory) => {
    const workshopGroups: DeviceGroup[] = [];
    factory.children?.forEach((workshop) => {
      const children: DeviceGroup[] = [];
      workshop.children?.forEach((item) => {
        children.push({
          id: item.id,
          name: item.name,
          sort: sortIndex++,
          createTime: '2025-06-23 15:13:13',
          deviceCount: item.children?.length || 0,
        });
      });

      workshopGroups.push({
        id: workshop.id,
        name: workshop.name,
        sort: sortIndex++,
        createTime: '2025-06-23 15:13:13',
        deviceCount: children.reduce((sum, c) => sum + c.deviceCount, 0),
        expanded: false,
        children: children.length > 0 ? children : undefined,
      });
    });

    groups.push({
      id: factory.id,
      name: factory.name,
      sort: sortIndex++,
      createTime: '2025-06-23 15:13:13',
      deviceCount: workshopGroups.reduce((sum, c) => sum + c.deviceCount, 0),
      expanded: false,
      children: workshopGroups,
    });
  });

  return groups;
}

const initialData: DeviceGroup[] = generateGroupsFromTree();

interface ModalForm {
  parentId: string;
  name: string;
  sort: string;
}

export default function DeviceGroup() {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState<DeviceGroup[]>(initialData);
  const [allExpanded, setAllExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加分组');
  const [editingId, setEditingId] = useState<string>('');
  const [form, setForm] = useState<ModalForm>({ parentId: '', name: '', sort: '' });
  const [errors, setErrors] = useState<{ name?: string; sort?: string }>({});

  const handleSearch = () => {
    console.log('搜索', searchText);
  };

  const handleReset = () => {
    setSearchText('');
  };

  const openAddModal = (parentId: string = '') => {
    setModalTitle('添加分组');
    setEditingId('');
    setForm({ parentId, name: '', sort: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (group: DeviceGroup) => {
    setModalTitle('编辑分组');
    setEditingId(group.id);
    setForm({ parentId: '', name: group.name, sort: String(group.sort) });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; sort?: string } = {};
    if (!form.name.trim()) {
      newErrors.name = '请输入分组名称';
    }
    if (!form.sort.trim()) {
      newErrors.sort = '请输入序号';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log('提交', { editingId, form });
    closeModal();
  };

  const handleToggleExpandAll = () => {
    setAllExpanded(!allExpanded);
    setGroups(prev => prev.map(group => ({
      ...group,
      expanded: !allExpanded,
      children: group.children?.map(child => ({ ...child, expanded: !allExpanded }))
    })));
  };

  const handleToggleExpand = (id: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === id) {
        return { ...group, expanded: !group.expanded };
      }
      if (group.children) {
        return {
          ...group,
          children: group.children.map(child =>
            child.id === id ? { ...child, expanded: !child.expanded } : child
          )
        };
      }
      return group;
    }));
  };

  const handleDelete = (id: string) => {
    console.log('删除', id);
  };

  const findGroupById = (id: string, list: DeviceGroup[] = groups): DeviceGroup | undefined => {
    for (const g of list) {
      if (g.id === id) return g;
      if (g.children) {
        const found = findGroupById(id, g.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const getAllGroupOptions = (): { id: string; name: string }[] => {
    const options: { id: string; name: string }[] = [];
    groups.forEach(g => {
      options.push({ id: g.id, name: g.name });
      g.children?.forEach(c => {
        options.push({ id: c.id, name: `  ${c.name}` });
      });
    });
    return options;
  };

  const renderRow = (group: DeviceGroup, level: number = 0) => {
    const hasChildren = group.children && group.children.length > 0;
    const paddingLeft = level * 20;

    return (
      <>
        <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
          <td className="px-6 py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft }}>
              {hasChildren && (
                <button
                  onClick={() => handleToggleExpand(group.id)}
                  className="p-0.5 hover:bg-gray-200 rounded"
                >
                  {group.expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}
              {!hasChildren && <span className="w-5" />}
              <Folder className="w-4 h-4 text-[#10469c]" />
              <span className="text-gray-800">{group.name}</span>
            </div>
          </td>
          <td className="px-6 py-3 text-center text-gray-600">{group.sort}</td>
          <td className="px-6 py-3 text-center text-gray-600">{group.createTime}</td>
          <td className="px-6 py-3 text-center text-gray-600">{group.deviceCount}</td>
          <td className="px-6 py-3 text-center">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => openAddModal(group.id)}
                className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                新增
              </button>
              <button
                onClick={() => openEditModal(group)}
                className="text-[#10469c] hover:text-[#0d3a80] text-sm font-medium"
              >
                <Edit className="w-4 h-4 inline" />
              </button>
              {level > 0 && (
                <button
                  onClick={() => handleDelete(group.id)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              )}
            </div>
          </td>
        </tr>
        {hasChildren && group.expanded && group.children!.map(child => renderRow(child, level + 1))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">分组名称</span>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="请输入分组名称"
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 min-w-[200px]"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={() => openAddModal()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
            <button
              onClick={handleToggleExpandAll}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              {allExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              展开/折叠
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">分组名称</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">排序</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">创建时间</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">设备数量</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(group => renderRow(group))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-lg shadow-xl w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">上级分组</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                >
                  <option value="">选择上级分组</option>
                  {getAllGroupOptions().map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>分组名称
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="请输入分组名称"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#10469c]/30 ${
                      errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#10469c]'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>序号
                  </label>
                  <input
                    type="text"
                    value={form.sort}
                    onChange={(e) => setForm({ ...form, sort: e.target.value })}
                    placeholder="请输入序号"
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#10469c]/30 ${
                      errors.sort ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#10469c]'
                    }`}
                  />
                  {errors.sort && <p className="mt-1 text-xs text-red-500">{errors.sort}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
              >
                确定
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
