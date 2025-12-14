'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Link, usePathname } from '@/i18n/navigation';

import { Motion } from '../common';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'agents',
    label: 'My Agents',
    icon: 'lucide:bot',
    href: '/agents',
  },
  {
    id: 'nfas',
    label: 'NFAs',
    icon: 'lucide:package',
    href: '/nfas',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Motion.div
      className={twMerge(
        'fixed left-0 top-[64px] h-[calc(100dvh-64px)] bg-gradient-to-b from-slate-800/95 via-gray-900/95 to-black-light/95 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 z-40',
        'hidden md:block',
        isCollapsed ? 'md:w-16' : 'md:w-64',
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h2 className="font-tektur font-semibold text-sm uppercase text-gray-350">Menu</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon
            icon={isCollapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'}
            className="w-5 h-5 text-gray-350"
          />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="p-2 space-y-1">
        {sidebarItems.map((item, index) => (
          <Motion.div key={item.id} delay={index * 0.05}>
            <Link
              href={item.href || '#'}
              className={twMerge(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                pathname === item.href
                  ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                  : 'text-gray-350 hover:bg-gray-800 hover:text-white border border-transparent',
                isCollapsed && 'justify-center',
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon icon={item.icon} className="w-5 h-5 min-w-5" />
              {!isCollapsed && (
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          </Motion.div>
        ))}
      </nav>
    </Motion.div>
  );
};
