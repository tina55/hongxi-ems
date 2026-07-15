import { create } from 'zustand';
import type { TreeState } from '@/types/tree';

export const useTreeStore = create<TreeState>()((set) => ({
  selectedNodeId: 'factory-1',
  expandedNodeIds: ['factory-1'],
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  toggleExpandNode: (id) =>
    set((state) => ({
      expandedNodeIds: state.expandedNodeIds.includes(id)
        ? state.expandedNodeIds.filter((item) => item !== id)
        : [...state.expandedNodeIds, id]
    }))
}));