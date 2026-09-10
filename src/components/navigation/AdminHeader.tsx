import React from 'react';
import { Menu, Moon, Sun, Bell, Shield, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#202622]/95 backdrop-blur-md border-b border-[#E8E1D2] dark:border-[#3A443E] transition-colors">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1.5 rounded-lg text-[#5C6B61] hover:text-[#303530] dark:text-slate-400 dark:hover:text-white lg:hidden cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#426B5A] dark:text-[#8FAF9A] uppercase tracking-wider">
                Legal Metrology Directorate Oversight
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#E8E1D2] dark:bg-slate-600" />
              <span className="hidden sm:inline text-xs text-[#5C6B61] dark:text-slate-400">
                Ministry of Consumer Affairs &bull; SIH26034
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#303530] dark:text-white leading-tight">
              Apex Surveillance & Enforcement Command
            </h1>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher */}
          <button
            onClick={() => {
              loginAs('inspector');
              navigate('/compliance-dashboard');
            }}
            title="Switch to Field Inspector Terminal"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-[#EEF3EF] hover:bg-[#D5E2D9] text-[#2C493D] dark:bg-[#426B5A]/40 dark:text-[#D5E2D9] border border-[#8FAF9A]/40 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
            <span>Field Inspector View</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-admin-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-[#5C6B61] hover:text-[#303530] dark:text-slate-400 dark:hover:text-slate-200 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#426B5A]" />}
          </button>

          {/* User badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#E8E1D2] dark:border-[#3A443E]">
            <div className="w-7 h-7 rounded-full bg-[#426B5A]/15 dark:bg-[#426B5A]/40 text-[#426B5A] dark:text-[#8FAF9A] font-bold text-xs flex items-center justify-center border border-[#8FAF9A]/30">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-[#303530] dark:text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-[#5C6B61] dark:text-slate-400 font-mono">{user?.role?.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

