import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { InspectorTopBar } from '../components/navigation/InspectorTopBar';
import { InspectorBottomNav } from '../components/navigation/InspectorBottomNav';
import { LayoutDashboard, Camera, History, BookOpen, User } from 'lucide-react';

export const InspectorLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col font-sans transition-colors">
      <InspectorTopBar />

      {/* Secondary Navigation Bar (Stitch Light Style) */}
      <div className="hidden md:block bg-white dark:bg-[#202622] border-b border-[#E8E1D2] dark:border-[#3A443E]">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 py-2 overflow-x-auto">
          <NavLink
            to="/compliance-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                isActive
                  ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/50 font-bold'
                  : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5] dark:hover:bg-[#2B332E]'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/live-package-scanner"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                isActive
                  ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/50 font-bold'
                  : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5] dark:hover:bg-[#2B332E]'
              }`
            }
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Scan</span>
          </NavLink>

          <NavLink
            to="/audit-history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                isActive
                  ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/50 font-bold'
                  : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5] dark:hover:bg-[#2B332E]'
              }`
            }
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </NavLink>

          <NavLink
            to="/statutory-rulebook"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                isActive
                  ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/50 font-bold'
                  : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5] dark:hover:bg-[#2B332E]'
              }`
            }
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PCR 2011 Rulebook</span>
          </NavLink>

          <NavLink
            to="/officer-profile"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                isActive
                  ? 'bg-[#EEF3EF] text-[#426B5A] dark:bg-[#23352B] dark:text-[#8FAF9A] border border-[#8FAF9A]/50 font-bold'
                  : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-[#FAF9F5] dark:hover:bg-[#2B332E]'
              }`
            }
          >
            <User className="w-3.5 h-3.5" />
            <span>Officer Profile</span>
          </NavLink>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile-first Bottom Navigation */}
      <div className="md:hidden">
        <InspectorBottomNav />
      </div>
    </div>
  );
};
