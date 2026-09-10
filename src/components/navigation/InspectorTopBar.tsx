import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  ArrowLeftRight,
  UserCheck,
  MoreVertical,
  BookOpen,
  History,
  User,
  Key,
  LayoutDashboard,
  ScanLine
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const InspectorTopBar: React.FC = () => {
  const { user, logout, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = () => {
    loginAs('admin');
    navigate('/admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#303530] text-[#303530] dark:text-[#F5F3EA] border-b border-[#E8E1D2] dark:border-[#252B27] transition-colors shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Brand & Emblem reference */}
        <div
          onClick={() => navigate('/compliance-dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-[#426B5A] text-[#FAF9F5] font-bold text-xs flex items-center justify-center shadow-xs shrink-0 tracking-tight">
            LM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-[#303530] dark:text-[#F5F3EA] tracking-tight">
                LegalMetriX
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#EEF3EF] dark:bg-[#3D4741] text-[#426B5A] dark:text-[#D8C79B] border border-[#8FAF9A]/30">
                PCR 2011
              </span>
            </div>
            <p className="text-[10px] text-[#5C6B61] dark:text-[#A0A8A2] leading-none uppercase tracking-wider font-semibold">
              INSPECTOR DESK &bull; NORTH ZONE
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Officer Duty Status Badge - subtle Sage-based treatment */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF3EF] dark:bg-[#2B332E] border border-[#8FAF9A]/40 text-[#2C493D] dark:text-[#C4E2D0] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#426B5A] dark:bg-[#8FAF9A] animate-pulse" />
            <span>{user?.name?.split(' ')[0]} (On-Duty)</span>
          </div>

          {/* Quick Role Switcher */}
          <button
            id="btn-switch-to-admin"
            onClick={handleRoleSwitch}
            title="Switch to Admin Role for testing"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-[#2B332E] hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] text-[#426B5A] dark:text-[#F5F3EA] border border-[#E8E1D2] dark:border-[#3F4A43] transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
            <span className="hidden xs:inline">To Apex Admin</span>
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-inspector-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title="Toggle Warehouse Dark Mode / Natural Trust Light"
            className="p-2 text-[#5C6B61] dark:text-[#D4D0C5] hover:text-[#303530] dark:hover:text-white hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D8C79B]" /> : <Moon className="w-4 h-4 text-[#426B5A]" />}
          </button>

          {/* Contextual Three-Dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              id="btn-inspector-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More options"
              className="p-2 text-[#5C6B61] dark:text-[#D4D0C5] hover:text-[#303530] dark:hover:text-white hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] rounded-lg transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] shadow-lg py-1 z-50 text-xs text-[#303530] dark:text-[#F5F3EA] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
                  <p className="font-bold text-[#303530] dark:text-[#F5F3EA] truncate">{user?.name}</p>
                  <p className="text-[10px] text-[#5C6B61] dark:text-[#C5C2B8] font-mono">Badge: {user?.badgeNumber}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('/compliance-dashboard');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>Compliance Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/live-package-scanner');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <ScanLine className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>Live Package Scanner</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/audit-history');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <History className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>Audit History Register</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/statutory-rulebook');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>PCR 2011 Rulebook</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/officer-profile');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <User className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>Officer Profile & Quota</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/change-password');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] flex items-center gap-2 cursor-pointer text-[#303530] dark:text-[#F5F3EA]"
                >
                  <Key className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
                  <span>Change Passphrase</span>
                </button>

                <div className="border-t border-[#E8E1D2] dark:border-[#3F4A43] my-1" />

                <button
                  onClick={() => {
                    logout();
                    navigate('/officer-login');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E4] dark:hover:bg-[#3E2926] text-[#8F4336] dark:text-[#E8B8B0] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
