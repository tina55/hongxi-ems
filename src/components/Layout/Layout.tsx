import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { SubMenu } from '@/components/SubMenu/SubMenu';
import { menuData } from '@/data/menuData';

export function Layout() {
  const location = useLocation();

  // 根据当前路径确定一级菜单ID
  const getCurrentMenuId = () => {
    const path = location.pathname;
    for (const menu of menuData) {
      if (menu.path === path || path.startsWith(menu.path + '/')) {
        return menu.id;
      }
    }
    return 'dashboard';
  };

  const currentMenuId = getCurrentMenuId();
  const currentMenu = menuData.find((m) => m.id === currentMenuId);
  const hasSubMenu = currentMenu?.children && currentMenu.children.length > 0;

  return (
    <div className="flex h-screen bg-[#f5f7fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasSubMenu && <SubMenu currentMenuId={currentMenuId} />}
        <main className="flex-1 overflow-auto bg-[#f5f7fa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}