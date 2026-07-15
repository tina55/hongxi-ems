import { useLocation, useNavigate } from 'react-router-dom';
import { menuData } from '@/data/menuData';
import { useMenuStore } from '@/store/menuStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface SubMenuProps {
  currentMenuId: string;
}

export function SubMenu({ currentMenuId }: SubMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveMenu, setActiveSubMenu } = useMenuStore();

  const currentMenu = menuData.find((m) => m.id === currentMenuId);
  const subMenus = currentMenu?.children || [];

  if (subMenus.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">
      <div className="flex items-center gap-1">
        {subMenus.map((subMenu) => {
          const isActive = location.pathname === subMenu.path;
          const hasContent = subMenu.hasContent;

          return (
            <button
              key={subMenu.id}
              onClick={() => {
                if (hasContent) {
                  setActiveMenu(currentMenuId);
                  setActiveSubMenu(subMenu.id);
                  navigate(subMenu.path);
                }
              }}
              disabled={!hasContent}
              className={cn(
                'px-5 py-2.5 text-sm font-medium transition-all duration-200 relative',
                isActive
                  ? 'text-[#10469c]'
                  : hasContent
                    ? 'text-gray-600 hover:text-[#10469c]'
                    : 'text-gray-300 cursor-not-allowed'
              )}
            >
              {subMenu.name}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#10469c] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
