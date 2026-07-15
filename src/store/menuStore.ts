import { create } from 'zustand';
import type { MenuState } from '@/types/menu';

export const useMenuStore = create<MenuState>()((set) => ({
  activeMenuId: 'dashboard',
  activeSubMenuId: null,
  expandedMenuIds: ['dashboard'],
  setActiveMenu: (id) => set({ activeMenuId: id, activeSubMenuId: null }),
  setActiveSubMenu: (id) => set({ activeSubMenuId: id }),
  toggleExpandMenu: (id) =>
    set((state) => ({
      expandedMenuIds: state.expandedMenuIds.includes(id)
        ? state.expandedMenuIds.filter((item) => item !== id)
        : [...state.expandedMenuIds, id]
    }))
}));