import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Droplets,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Shield,
  ChevronDown,
  ChevronRight,
  Folder,
  Server,
  Tag,
  MoreHorizontal,
  type LucideIcon
} from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { menuData } from '@/data/menuData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Zap,
  Droplets,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Shield,
  Folder,
  Server,
  Tag,
  MoreHorizontal,
  BarChart2: BarChart3,
  TrendingUp: BarChart3,
  Activity: Zap,
  LineChart: BarChart3,
  Users: Settings,
  Package: Settings,
  Cog: Settings,
  Edit3: Settings
};

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeMenuId, expandedMenuIds, setActiveMenu, toggleExpandMenu } = useMenuStore();

  const handleMenuClick = (menu: typeof menuData[0]) => {
    setActiveMenu(menu.id);
    if (menu.children && menu.children.length > 0) {
      toggleExpandMenu(menu.id);
      const firstChild = menu.children[0];
      if (firstChild.hasContent) {
        navigate(firstChild.path);
      }
    } else {
      navigate(menu.path);
    }
  };

  const handleSubMenuClick = (subMenu: NonNullable<typeof menuData[0]['children']>[0], parentId: string) => {
    setActiveMenu(parentId);
    if (subMenu.hasContent) {
      navigate(subMenu.path);
    }
  };

  return (
    <aside className="w-64 bg-[#10469c] flex flex-col h-screen">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">能耗监测系统</span>
        </div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {menuData.map((menu) => {
            const Icon = iconMap[menu.icon] || LayoutDashboard;
            const isExpanded = expandedMenuIds.includes(menu.id);
            const isActive = activeMenuId === menu.id || location.pathname.startsWith(menu.path);
            const hasChildren = menu.children && menu.children.length > 0;

            return (
              <li key={menu.id}>
                <button
                  onClick={() => handleMenuClick(menu)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-white/10 hover:text-white',
                    isActive
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-white/80'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-sm text-left">{menu.name}</span>
                  {hasChildren && (
                    <span className="transition-transform duration-200">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <ul className="mt-1 ml-2 space-y-0.5 border-l border-white/10 pl-2">
                    {menu.children!.map((subMenu) => {
                      const SubIcon = iconMap[subMenu.icon || ''] || LayoutDashboard;
                      const isSubMenuActive = location.pathname === subMenu.path;

                      return (
                        <li key={subMenu.id}>
                          <button
                            onClick={() => handleSubMenuClick(subMenu, menu.id)}
                            disabled={!subMenu.hasContent}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-sm',
                              'hover:bg-white/10',
                              isSubMenuActive
                                ? 'bg-white/15 text-white'
                                : subMenu.hasContent
                                  ? 'text-white/70'
                                  : 'text-white/40 cursor-not-allowed'
                            )}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span className="text-left">{subMenu.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="h-12 flex items-center justify-center border-t border-white/10">
        <span className="text-xs text-white/40">v1.0.0</span>
      </div>
    </aside>
  );
}
