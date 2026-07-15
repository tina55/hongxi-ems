export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  hasContent: boolean;
}

export interface MenuState {
  activeMenuId: string;
  activeSubMenuId: string | null;
  expandedMenuIds: string[];
  setActiveMenu: (id: string) => void;
  setActiveSubMenu: (id: string | null) => void;
  toggleExpandMenu: (id: string) => void;
}