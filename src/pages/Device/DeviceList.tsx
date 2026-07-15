import { useState, useCallback, useEffect } from 'react';
import {
  Plus, Upload, Download, ChevronDown, ChevronRight, Folder, X, Save, Trash2,
  ChevronLeft, Pencil, MoreHorizontal
} from 'lucide-react';
import { treeData } from '@/data/treeData';

interface GroupItem {
  id: string;
  name: string;
  expanded: boolean;
  children?: GroupItem[];
  selected?: boolean;
  parentId?: string;
  energyType?: string;
  nodeCode?: string;
  sort?: number;
  isIncoming?: boolean;
  nodeAttribute?: string;
  circuitName?: string;
  formula?: string;
}

interface NodeFormData {
  id: string;
  parentId: string;
  name: string;
  energyType: string;
  nodeCode: string;
  sort: string;
  isIncoming: boolean;
  nodeAttribute: string;
  circuitName: string;
  processCode: string;
}

interface DeviceItem {
  id: string;
  index: number;
  name: string;
  type: string;
  sort: number;
  pointCount: number;
  manager: string;
}

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

interface TagFormData {
  tagId: string;
  tagName: string;
  tagDesc: string;
  sensorName: string;
  dataType: string;
  unit: string;
  sort: string;
}

function generateGroupsFromTree(): GroupItem[] {
  const groups: GroupItem[] = [];
  let sortIndex = 0;

  treeData.forEach((factory) => {
    const workshopGroups: GroupItem[] = [];
    factory.children?.forEach((workshop) => {
      const children: GroupItem[] = [];
      workshop.children?.forEach((item) => {
        children.push({
          id: item.id,
          name: item.name,
          sort: sortIndex++,
          expanded: false,
          selected: false,
          parentId: workshop.id,
          energyType: 'electric',
          nodeCode: '',
          isIncoming: false,
          nodeAttribute: 'equipment',
          circuitName: '',
          processCode: '',
          formula: '',
          children: item.children?.map(c => ({
            id: c.id,
            name: c.name,
            expanded: false,
            selected: false,
            parentId: item.id,
            energyType: 'electric',
            nodeCode: '',
            sort: sortIndex++,
            isIncoming: false,
            nodeAttribute: 'meter',
            circuitName: '',
          processCode: '',
            formula: '',
          })),
        });
      });

      workshopGroups.push({
        id: workshop.id,
        name: workshop.name,
        sort: sortIndex++,
        expanded: false,
        selected: false,
        parentId: factory.id,
        energyType: 'electric',
        nodeCode: '',
        isIncoming: false,
        nodeAttribute: 'workshop',
        circuitName: '',
          processCode: '',
        formula: '',
        children: children.length > 0 ? children : undefined,
      });
    });

    groups.push({
      id: factory.id,
      name: factory.name,
      sort: sortIndex++,
      expanded: true,
      selected: false,
      parentId: '',
      energyType: 'electric',
      nodeCode: '',
      isIncoming: false,
      nodeAttribute: 'building',
      circuitName: '',
          processCode: '',
      formula: '',
      children: workshopGroups,
    });
  });

  return groups;
}

function flattenGroups(groups: GroupItem[]): GroupItem[] {
  const result: GroupItem[] = [];
  groups.forEach(group => {
    result.push(group);
    if (group.children) {
      result.push(...flattenGroups(group.children));
    }
  });
  return result;
}

function findGroupById(groups: GroupItem[], id: string): GroupItem | null {
  for (const group of groups) {
    if (group.id === id) return group;
    if (group.children) {
      const found = findGroupById(group.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentGroup(groups: GroupItem[], childId: string): GroupItem | null {
  for (const group of groups) {
    if (group.children?.some(c => c.id === childId)) return group;
    if (group.children) {
      const found = findParentGroup(group.children, childId);
      if (found) return found;
    }
  }
  return null;
}

const deviceData: DeviceItem[] = [
  { id: '1', index: 1, name: '4007#1模组...', type: '电表', sort: 0, pointCount: 28, manager: '' },
  { id: '2', index: 2, name: '400V 43车...', type: '电表', sort: 0, pointCount: 28, manager: '' },
  { id: '3', index: 3, name: '4007#1模组...', type: '电表', sort: 0, pointCount: 28, manager: '' },
  { id: '4', index: 4, name: '400V 43车...', type: '电表', sort: 0, pointCount: 28, manager: '' },
  { id: '5', index: 5, name: '4007#1模组...', type: '电表', sort: 0, pointCount: 28, manager: '' },
  { id: '6', index: 6, name: '400V 43车...', type: '电表', sort: 0, pointCount: 28, manager: '' },
];

const tagData: TagItem[] = [
  { id: '1', index: 1, tagId: 'V_A10093', tagName: '电压', tagType: '电表标签', tagDesc: '1#配电柜A相电压', sort: 0, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'V', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '2', index: 2, tagId: 'I_A10093', tagName: '电流', tagType: '电表标签', tagDesc: '1#配电柜A相电流', sort: 1, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'A', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '3', index: 3, tagId: 'P_A10093', tagName: '有功功率', tagType: '电表标签', tagDesc: '1#配电柜有功功率', sort: 2, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'kW', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '4', index: 4, tagId: 'Q_A10093', tagName: '无功功率', tagType: '电表标签', tagDesc: '1#配电柜无功功率', sort: 3, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'kvar', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '5', index: 5, tagId: 'PF_A10093', tagName: '功率因数', tagType: '电表标签', tagDesc: '1#配电柜功率因数', sort: 4, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'cosφ', createTime: '2025-04-23', updateTime: '2025-04-23' },
  { id: '6', index: 6, tagId: 'F_A10093', tagName: '频率', tagType: '电表标签', tagDesc: '1#配电柜电网频率', sort: 5, sensorName: '1#配电柜电表', dataType: '浮点', unit: 'Hz', createTime: '2025-04-23', updateTime: '2025-04-23' },
];

const energyTypes = [
  { value: 'electric', label: '电' },
  { value: 'water', label: '水' },
  { value: 'gas', label: '天然气' },
  { value: 'compressedAir', label: '压缩空气' },
  { value: 'co2', label: '二氧化碳' },
  { value: 'argon', label: '氩气' },
  { value: 'heat', label: '热量表' },
];

const nodeAttributeOptions = [
  { value: 'factory', label: '厂区' },
  { value: 'workshop', label: '车间' },
  { value: 'area', label: '区域' },
  { value: 'equipment', label: '设备' },
  { value: 'meter', label: '仪表' },
];

const defaultNodeForm: NodeFormData = {
  id: '',
  parentId: '',
  name: '',
  energyType: 'electric',
  nodeCode: '',
  sort: '0',
  isIncoming: false,
  nodeAttribute: 'equipment',
  circuitName: '',
  processCode: '',
};

export default function DeviceList() {
  const [searchText, setSearchText] = useState('');
  const [groups, setGroups] = useState<GroupItem[]>(generateGroupsFromTree());

  // 节点表单状态
  const [nodeFormMode, setNodeFormMode] = useState<'add' | 'edit' | null>(null);
  const [nodeFormData, setNodeFormData] = useState<NodeFormData>(defaultNodeForm);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [customAttributes, setCustomAttributes] = useState<{ name: string; value: string }[]>([]);

  // 设备弹窗状态
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditDevice, setIsEditDevice] = useState(false);
  const [deviceFormData, setDeviceFormData] = useState({
    name: '', deviceCode: '', type: 'electric', attribute: 'equipment', power: '', sort: '', manager: '',
  });

  // 测点配置状态
  const [pointConfigVisible, setPointConfigVisible] = useState(false);
  const [sensorName, setSensorName] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(['1', '5']);
  const [currentTagPage, setCurrentTagPage] = useState(1);
  const [tagPageSize, setTagPageSize] = useState(10);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagFormData, setTagFormData] = useState<TagFormData>({ tagId: '', tagName: '', tagDesc: '', sensorName: '', dataType: '浮点', unit: '', sort: '' });

  // 初始化时自动选中第一个节点
  useEffect(() => {
    if (groups.length > 0 && !nodeFormMode) {
      const firstNode = groups[0];
      handleSelectNode(firstNode.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allNodes = flattenGroups(groups);

  const getNodeFormTitle = () => {
    if (nodeFormMode === 'add') return '新增节点';
    if (nodeFormMode === 'edit') return '编辑节点';
    return '';
  };

  const handleSelectNode = (id: string) => {
    const node = findGroupById(groups, id);
    if (!node) return;

    setGroups(prev => prev.map(g => {
      const updateSelected = (item: GroupItem): GroupItem => {
        const isSelected = item.id === id;
        const newItem = { ...item, selected: isSelected };
        if (newItem.children) {
          newItem.children = newItem.children.map(updateSelected);
        }
        return newItem;
      };
      return updateSelected(g);
    }));

    setNodeFormMode('edit');
    setNodeFormData({
      id: node.id,
      parentId: node.parentId || '',
      name: node.name,
      energyType: node.energyType || 'electric',
      nodeCode: node.nodeCode || '',
      sort: String(node.sort ?? 0),
      isIncoming: node.isIncoming ?? false,
      nodeAttribute: node.nodeAttribute || 'equipment',
      circuitName: node.circuitName || '',
      formula: node.formula || '',
    });
  };

  const handleAddNode = (parentId: string) => {
    setNodeFormMode('add');
    setNodeFormData({
      ...defaultNodeForm,
      parentId,
      sort: '0',
    });
  };

  const handleEditNode = (id: string) => {
    handleSelectNode(id);
  };

  const handleDeleteNode = (id: string) => {
    if (!confirm('确定要删除该节点吗？')) return;

    const removeNode = (items: GroupItem[]): GroupItem[] => {
      return items.filter(item => item.id !== id).map(item => ({
        ...item,
        children: item.children ? removeNode(item.children) : undefined,
      }));
    };

    setGroups(prev => removeNode(prev));

    if (nodeFormData.id === id) {
      setNodeFormMode(null);
      setNodeFormData(defaultNodeForm);
    }
  };

  const handleNodeFormChange = (field: keyof NodeFormData, value: string | boolean) => {
    setNodeFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNode = () => {
    if (!nodeFormData.name.trim()) {
      alert('请输入节点名称');
      return;
    }

    if (nodeFormMode === 'add') {
      const newNode: GroupItem = {
        id: `node_${Date.now()}`,
        name: nodeFormData.name,
        expanded: false,
        selected: false,
        parentId: nodeFormData.parentId,
        energyType: nodeFormData.energyType,
        nodeCode: nodeFormData.nodeCode,
        sort: Number(nodeFormData.sort) || 0,
        isIncoming: nodeFormData.isIncoming,
        nodeAttribute: nodeFormData.nodeAttribute,
        circuitName: nodeFormData.circuitName,
        formula: nodeFormData.formula,
      };

      const addToParent = (items: GroupItem[]): GroupItem[] => {
        return items.map(item => {
          if (item.id === nodeFormData.parentId) {
            return { ...item, children: [...(item.children || []), newNode], expanded: true };
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) };
          }
          return item;
        });
      };

      if (!nodeFormData.parentId) {
        setGroups(prev => [...prev, newNode]);
      } else {
        setGroups(prev => addToParent(prev));
      }
    } else {
      const updateNode = (items: GroupItem[]): GroupItem[] => {
        return items.map(item => {
          if (item.id === nodeFormData.id) {
            return {
              ...item,
              name: nodeFormData.name,
              energyType: nodeFormData.energyType,
              nodeCode: nodeFormData.nodeCode,
              sort: Number(nodeFormData.sort) || 0,
              isIncoming: nodeFormData.isIncoming,
              nodeAttribute: nodeFormData.nodeAttribute,
              circuitName: nodeFormData.circuitName,
              formula: nodeFormData.formula,
            };
          }
          if (item.children) {
            return { ...item, children: updateNode(item.children) };
          }
          return item;
        });
      };
      setGroups(prev => updateNode(prev));
    }

    setNodeFormMode(null);
    setNodeFormData(defaultNodeForm);
  };

  const handleCancelNode = () => {
    setNodeFormMode(null);
    setNodeFormData(defaultNodeForm);
  };

  const handleToggleGroup = useCallback((id: string) => {
    setGroups(prev => prev.map(group => {
      const toggle = (item: GroupItem): GroupItem => {
        if (item.id === id) return { ...item, expanded: !item.expanded };
        if (item.children) return { ...item, children: item.children.map(toggle) };
        return item;
      };
      return toggle(group);
    }));
  }, []);

  const renderGroup = (group: GroupItem, level: number = 0) => {
    const paddingLeft = level * 12;
    const hasChildren = group.children && group.children.length > 0;
    const isHovered = hoveredNodeId === group.id;
    const isSelected = group.selected;

    return (
      <div key={group.id}>
        <div
          className={`flex items-center gap-1 py-1.5 pr-2 cursor-pointer transition-colors ${
            isSelected ? 'bg-[#10469c]/10' : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft }}
          onMouseEnter={() => setHoveredNodeId(group.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); handleToggleGroup(group.id); }}>
              {group.expanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <div className="flex-1 flex items-center gap-1.5 min-w-0" onClick={() => handleSelectNode(group.id)}>
            <Folder className="w-4 h-4 text-[#10469c] shrink-0" />
            <span className="text-sm text-gray-700 truncate">{group.name}</span>
          </div>

          {/* 操作按钮 */}
          <div className={`flex items-center gap-0.5 shrink-0 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddNode(group.id); }}
              className="p-0.5 hover:bg-[#10469c]/10 rounded text-[#10469c]"
              title="新增子节点"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleEditNode(group.id); }}
              className="p-0.5 hover:bg-[#10469c]/10 rounded text-[#10469c]"
              title="编辑"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteNode(group.id); }}
              className="p-0.5 hover:bg-red-50 rounded text-red-500"
              title="删除"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        {hasChildren && group.expanded && group.children!.map(child => renderGroup(child, level + 1))}
      </div>
    );
  };

  // 设备列表相关
  const handleAddDevice = () => {
    setIsEditDevice(false);
    setDeviceFormData({ name: '', deviceCode: '', type: 'electric', attribute: 'equipment', power: '', sort: '', manager: '' });
    setModalVisible(true);
  };

  const handleEditDevice = (id: string) => {
    setIsEditDevice(true);
    setDeviceFormData({ name: '4007#1模组', deviceCode: 'D001', type: 'electric', attribute: 'equipment', power: '1000', sort: '0', manager: '' });
    setModalVisible(true);
  };

  const handleDeleteDevice = (id: string) => {
    console.log('删除设备', id);
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleSaveDevice = () => {
    console.log('保存设备', deviceFormData);
    setModalVisible(false);
  };

  const handlePointConfig = (id: string) => {
    setPointConfigVisible(true);
  };

  const handleClosePointConfig = () => setPointConfigVisible(false);

  const handleTagSearch = () => console.log('搜索标签', sensorName);
  const handleAddTag = () => setShowTagModal(true);
  const handleCloseTagModal = () => {
    setShowTagModal(false);
    setTagFormData({ tagId: '', tagName: '', tagDesc: '', sensorName: '', dataType: '浮点', unit: '', sort: '' });
  };
  const handleTagFormChange = (field: keyof TagFormData, value: string) => setTagFormData(prev => ({ ...prev, [field]: value }));
  const handleTagSubmit = () => { console.log('新增标签', tagFormData); handleCloseTagModal(); };
  const handleTagImport = () => console.log('导入标签');
  const handleTagExport = () => console.log('导出标签');
  const handleBatchDeleteTag = () => console.log('批量删除标签', selectedTagIds);
  const handleSelectTag = (id: string) => setSelectedTagIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleSelectAllTags = () => setSelectedTagIds(prev => prev.length === tagData.length ? [] : tagData.map(d => d.id));
  const handleEditTag = (id: string) => console.log('编辑标签', id);
  const handleDeleteTag = (id: string) => console.log('删除标签', id);

  const totalTagPages = Math.ceil(tagData.length / tagPageSize);
  const tagPages = Array.from({ length: Math.min(totalTagPages, 10) }, (_, i) => i + 1);

  const deviceTypes = energyTypes;

  // 生成上级区域选项
  const parentOptions = allNodes.map(node => ({
    value: node.id,
    label: node.name,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex">
            {/* 左侧树 */}
            <div className="w-[260px] border-r border-gray-200 p-4 flex flex-col">
              <div className="mb-3">
                <button
                  onClick={() => handleAddNode('')}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors w-full justify-center mb-3"
                >
                  <Plus className="w-4 h-4" />
                  新增根节点
                </button>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="请输入关键字查询"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {groups.map(group => renderGroup(group))}
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">{getNodeFormTitle()}</h3>

                <div className="max-w-xl space-y-5">
                    {/* 上级区域 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">上级区域</label>
                      <select
                        value={nodeFormData.parentId}
                        onChange={(e) => handleNodeFormChange('parentId', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                      >
                        <option value="">无</option>
                        {parentOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* 节点名称 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">
                        <span className="text-red-500 mr-1">*</span>节点名称
                      </label>
                      <input
                        type="text"
                        value={nodeFormData.name}
                        onChange={(e) => handleNodeFormChange('name', e.target.value)}
                        placeholder="请输入节点名称"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                      />
                    </div>

                    {/* 节点编号 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">节点编号</label>
                      <input
                        type="text"
                        value={nodeFormData.nodeCode}
                        onChange={(e) => handleNodeFormChange('nodeCode', e.target.value)}
                        placeholder="请输入节点编号"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                      />
                    </div>

                    {/* 节点属性 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">节点属性</label>
                      <select
                        value={nodeFormData.nodeAttribute}
                        onChange={(e) => handleNodeFormChange('nodeAttribute', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                      >
                        {nodeAttributeOptions.map(attr => (
                          <option key={attr.value} value={attr.value}>{attr.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* 能源类型 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">能源类型</label>
                      <select
                        value={nodeFormData.energyType}
                        onChange={(e) => handleNodeFormChange('energyType', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white"
                      >
                        {energyTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* 排序 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">排序</label>
                      <input
                        type="number"
                        value={nodeFormData.sort}
                        onChange={(e) => handleNodeFormChange('sort', e.target.value)}
                        placeholder="请输入排序"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                      />
                    </div>

                    {/* 回路名称 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">回路名称</label>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 min-h-[36px] flex items-center">
                          {nodeFormData.circuitName ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded text-sm text-gray-700">
                              {nodeFormData.circuitName}
                              <button
                                onClick={() => handleNodeFormChange('circuitName', '')}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">请选择回路</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleNodeFormChange('circuitName', '总表(k54219)')}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-[#10469c] hover:text-[#0d3a80] font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          编辑
                        </button>
                      </div>
                    </div>

                    {/* 工序编号 */}
                    <div className="flex items-center gap-4">
                      <label className="w-28 text-right text-sm font-medium text-gray-700">工序编号</label>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 min-h-[36px] flex items-center">
                          {nodeFormData.processCode ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded text-sm text-gray-700">
                              {nodeFormData.processCode}
                              <button
                                onClick={() => handleNodeFormChange('processCode', '')}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">请选择工序</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleNodeFormChange('processCode', 'P001')}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-[#10469c] hover:text-[#0d3a80] font-medium"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          编辑
                        </button>
                      </div>
                    </div>

                    {/* 自定义属性 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="w-28 text-right text-sm font-medium text-gray-700">自定义属性</label>
                        <button
                          onClick={() => setCustomAttributes([...customAttributes, { name: '', value: '' }])}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#10469c] hover:text-[#0d3a80] font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          新增属性
                        </button>
                      </div>
                      {customAttributes.map((attr, index) => (
                        <div key={index} className="flex items-center gap-3 pl-[112px]">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => {
                              const newAttrs = [...customAttributes];
                              newAttrs[index].name = e.target.value;
                              setCustomAttributes(newAttrs);
                            }}
                            placeholder="属性名称"
                            className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                          />
                          <span className="text-gray-400">=</span>
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => {
                              const newAttrs = [...customAttributes];
                              newAttrs[index].value = e.target.value;
                              setCustomAttributes(newAttrs);
                            }}
                            placeholder="属性值"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30"
                          />
                          <button
                            onClick={() => setCustomAttributes(customAttributes.filter((_, i) => i !== index))}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* 按钮 */}
                    <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                      <button
                        onClick={handleSaveNode}
                        className="px-8 py-2.5 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"
                      >
                        确认
                      </button>
                      <button
                        onClick={handleCancelNode}
                        className="px-8 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* 设备弹窗 */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{isEditDevice ? '编辑设备' : '新增设备'}</h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">设备编码</label>
                <input type="text" value={deviceFormData.deviceCode} onChange={(e) => setDeviceFormData(prev => ({ ...prev, deviceCode: e.target.value }))} placeholder="请输入设备编码" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700"><span className="text-red-500 mr-1">*</span>设备名称</label>
                <input type="text" value={deviceFormData.name} onChange={(e) => setDeviceFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="请输入设备名称" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">能源类型</label>
                <select value={deviceFormData.type} onChange={(e) => setDeviceFormData(prev => ({ ...prev, type: e.target.value }))} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  {deviceTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">设备属性</label>
                <select value={deviceFormData.attribute} onChange={(e) => setDeviceFormData(prev => ({ ...prev, attribute: e.target.value }))} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 bg-white">
                  {nodeAttributeOptions.map(attr => <option key={attr.value} value={attr.value}>{attr.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">额定功率</label>
                <div className="flex-1 flex items-center gap-2">
                  <input type="number" value={deviceFormData.power} onChange={(e) => setDeviceFormData(prev => ({ ...prev, power: e.target.value }))} placeholder="请输入额定功率" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
                  <span className="text-sm text-gray-500">kW</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">排序</label>
                <input type="number" value={deviceFormData.sort} onChange={(e) => setDeviceFormData(prev => ({ ...prev, sort: e.target.value }))} placeholder="请输入排序" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-36 text-right text-sm font-medium text-gray-700">设备负责人</label>
                <input type="text" value={deviceFormData.manager} onChange={(e) => setDeviceFormData(prev => ({ ...prev, manager: e.target.value }))} placeholder="请输入设备负责人" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200">
              <button onClick={handleCloseModal} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={handleSaveDevice} className="px-6 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors">确定</button>
            </div>
          </div>
        </div>
      )}

      {/* 测点配置弹窗 */}
      {pointConfigVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-[900px] max-h-[80vh] shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">测点配置</h3>
              <button onClick={handleClosePointConfig} className="p-1 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">名称:</span>
                  <input type="text" value={sensorName} onChange={(e) => setSensorName(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 w-[200px]" />
                  <button onClick={handleTagSearch} className="px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors">查询</button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleAddTag} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"><Plus className="w-4 h-4" />新增标签</button>
                  <button onClick={handleTagImport} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"><Upload className="w-4 h-4" />导入</button>
                  <button onClick={handleTagExport} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"><Download className="w-4 h-4" />导出</button>
                  <button onClick={handleBatchDeleteTag} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"><Trash2 className="w-4 h-4" />批量删除</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-center w-10"><input type="checkbox" checked={selectedTagIds.length === tagData.length} onChange={handleSelectAllTags} className="rounded border-gray-300" /></th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">标签ID</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">标签名称</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">标签描述</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">所属设备</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">数据类型</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">单位</th>
                      <th className="px-3 py-2 text-center font-semibold text-red-500">排序</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">创建时间</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">更新时间</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-center"><input type="checkbox" checked={selectedTagIds.includes(item.id)} onChange={() => handleSelectTag(item.id)} className="rounded border-gray-300" /></td>
                        <td className="px-3 py-2 text-center text-gray-800">{item.tagId}</td>
                        <td className="px-3 py-2 text-center text-gray-800">{item.tagName}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.tagDesc}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.sensorName}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.dataType}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.unit}</td>
                        <td className="px-3 py-2 text-center text-red-500">{item.sort}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.createTime}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{item.updateTime}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEditTag(item.id)} className="text-[#10469c] hover:text-[#0d3a80] text-xs font-medium">编辑</button>
                            <button onClick={() => handleDeleteTag(item.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentTagPage(p => Math.max(1, p - 1))} disabled={currentTagPage === 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                  {tagPages.map(page => (
                    <button key={page} onClick={() => setCurrentTagPage(page)} className={`min-w-[32px] h-[32px] flex items-center justify-center rounded text-sm font-medium ${currentTagPage === page ? 'bg-[#10469c] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentTagPage(p => Math.min(totalTagPages, p + 1))} disabled={currentTagPage === totalTagPages} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4 rotate-180" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <select value={tagPageSize} onChange={(e) => setTagPageSize(Number(e.target.value))} className="px-2 py-1 text-sm border border-gray-200 rounded">
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                  </select>
                  <span className="text-sm text-gray-500">跳至 <input type="text" defaultValue="5" className="w-12 px-2 py-1 text-sm border border-gray-200 rounded mx-1" /> 页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新增标签弹窗 */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">新增标签</h2>
              <button onClick={handleCloseTagModal} className="p-1.5 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">标签ID</span><input type="text" value={tagFormData.tagId} onChange={(e) => handleTagFormChange('tagId', e.target.value)} placeholder="请输入标签ID" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">标签名称</span><input type="text" value={tagFormData.tagName} onChange={(e) => handleTagFormChange('tagName', e.target.value)} placeholder="请输入标签名称" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">标签描述</span><input type="text" value={tagFormData.tagDesc} onChange={(e) => handleTagFormChange('tagDesc', e.target.value)} placeholder="请输入标签描述" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">所属设备</span><input type="text" value={tagFormData.sensorName} onChange={(e) => handleTagFormChange('sensorName', e.target.value)} placeholder="请输入所属设备" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">数据类型</span><select value={tagFormData.dataType} onChange={(e) => handleTagFormChange('dataType', e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30">
                <option value="浮点">浮点</option>
                <option value="整数">整数</option>
                <option value="字符串">字符串</option>
                <option value="布尔">布尔</option>
                <option value="日期">日期</option>
              </select></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">单位</span><input type="text" value={tagFormData.unit} onChange={(e) => handleTagFormChange('unit', e.target.value)} placeholder="请输入单位" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
              <div className="flex items-center gap-4"><span className="text-sm text-gray-600 w-24">排序</span><input type="number" value={tagFormData.sort} onChange={(e) => handleTagFormChange('sort', e.target.value)} placeholder="请输入排序" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={handleCloseTagModal} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">取消</button>
              <button onClick={handleTagSubmit} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#10469c] rounded-md hover:bg-[#0d3a80] transition-colors"><Save className="w-4 h-4" />保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}