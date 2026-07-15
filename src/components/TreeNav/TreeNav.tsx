import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Building2, Search } from 'lucide-react';
import { useTreeStore } from '@/store/treeStore';
import { treeData } from '@/data/treeData';
import type { TreeNode } from '@/types/tree';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

function getNodeCount(node: TreeNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((count, child) => count + getNodeCount(child), 0);
}

function TreeNodeItem({ node, level = 0, searchTerm }: { node: TreeNode; level?: number; searchTerm: string }) {
  const { selectedNodeId, expandedNodeIds, setSelectedNode, toggleExpandNode } = useTreeStore();
  const isSelected = selectedNodeId === node.id;
  const isExpanded = expandedNodeIds.includes(node.id);
  const hasChildren = node.children.length > 0;

  const isMatch = useMemo(() => {
    if (!searchTerm) return true;
    return node.name.toLowerCase().includes(searchTerm.toLowerCase());
  }, [node.name, searchTerm]);

  const hasMatchingDescendant = useMemo(() => {
    if (!searchTerm) return true;
    const checkChildren = (n: TreeNode): boolean => {
      if (n.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      return n.children.some(checkChildren);
    };
    return checkChildren(node);
  }, [node, searchTerm]);

  if (searchTerm && !hasMatchingDescendant) return null;

  const childCount = getNodeCount(node);

  return (
    <div>
      <button
        onClick={() => {
          setSelectedNode(node.id);
          if (hasChildren) {
            toggleExpandNode(node.id);
          }
        }}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors text-sm',
          'hover:bg-blue-50',
          isSelected ? 'bg-blue-50 text-[#10469c]' : 'text-gray-700'
        )}
        style={{ paddingLeft: `${level * 14 + 6}px` }}
      >
        {hasChildren && (
          <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <Building2 className={cn(
          'w-3.5 h-3.5',
          isSelected ? 'text-[#10469c]' : 'text-gray-400'
        )} />
        <span className="flex-1 truncate text-left">{node.name}</span>
        {level === 0 && (
          <span className="text-xs text-gray-400">{childCount}</span>
        )}
      </button>

      {hasChildren && (isExpanded || searchTerm) && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <TreeNodeItem key={child.id} node={child} level={level + 1} searchTerm={searchTerm} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeNavProps {
  width?: number;
}

export function TreeNav({ width = 280 }: TreeNavProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 flex flex-col h-full shadow-sm"
      style={{ width: `${width}px` }}
    >
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="输入关键字搜索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#10469c] focus:ring-1 focus:ring-[#10469c]/30 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {treeData.map((node) => (
          <TreeNodeItem key={node.id} node={node} searchTerm={searchTerm} />
        ))}
      </div>
    </div>
  );
}
