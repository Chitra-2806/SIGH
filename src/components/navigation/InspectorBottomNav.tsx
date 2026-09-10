import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, QrCode, FileText, User } from 'lucide-react';

export const InspectorBottomNav: React.FC = () => {
  const navItems = [
    {
      to: '/compliance-dashboard',
      label: 'Home',
      icon: Home,
      id: 'nav-item-home',
    },
    {
      to: '/audit-history',
      label: 'History',
      icon: Clock,
      id: 'nav-item-history',
    },
    {
      to: '/live-package-scanner',
      label: 'Scan',
      icon: QrCode,
      id: 'nav-item-scan',
      highlight: true,
    },
    {
      to: '/compliance-reports',
      label: 'Reports',
      icon: FileText,
      id: 'nav-item-reports',
    },
    {
      to: '/officer-profile',
      label: 'Profile',
      icon: User,
      id: 'nav-item-profile',
    },
  ];

  return (
    <nav
      id="inspector-bottom-nav"
      aria-label="Inspector Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#202622]/95 backdrop-blur-md border-t border-[#E8E1D2] dark:border-[#3A443E] transition-colors"
    >
      <div className="max-w-md mx-auto px-2 sm:px-4 flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={item.id}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#426B5A] dark:text-[#8FAF9A] font-bold'
                    : 'text-[#66706A] hover:text-[#303530] dark:text-[#D4D0C5] dark:hover:text-[#F5F3EA]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1.5 rounded-xl transition-transform ${
                      isActive
                        ? 'text-[#426B5A] dark:text-[#8FAF9A]'
                        : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

