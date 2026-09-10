import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Radio,
  FileCheck2,
  Settings,
  UserCheck,
  LogOut,
  ArrowLeftRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, loginAs, user } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToInspector = () => {
    loginAs('inspector');
    navigate('/compliance-dashboard');
  };

  const navLinks = [
    {
      to: '/admin-dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      id: 'admin-nav-dashboard',
    },
    {
      to: '/supervisor-dossier',
      label: 'Supervisor Dossier',
      icon: Users,
      id: 'admin-nav-supervisor-dossier',
    },
    {
      to: '/admin-profile',
      label: 'Admin Profile',
      icon: UserCheck,
      id: 'admin-nav-profile',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#202622] text-[#303530] dark:text-[#F5F3EA] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#E8E1D2] dark:border-[#3A443E]`}
      >
        {/* Header Branding */}
        <div className="p-4 flex items-center justify-between border-b border-[#E8E1D2] dark:border-[#3A443E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#426B5A] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#FAF9F5]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#303530] dark:text-white block">
                LegalMetriX Apex
              </span>
              <span className="text-[10px] text-[#426B5A] dark:text-[#8FAF9A] font-semibold uppercase tracking-wider block">
                Directorate Command
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5C6B61] dark:text-[#9BA39D] hover:text-[#303530] dark:hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Admin Tag */}
        <div className="px-4 py-3 bg-[#FAF9F5] dark:bg-[#1A201C] border-b border-[#E8E1D2] dark:border-[#3A443E] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#426B5A]/15 dark:bg-[#426B5A]/40 text-[#426B5A] dark:text-[#D5E2D9] font-bold text-xs flex items-center justify-center border border-[#8FAF9A]/30">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#303530] dark:text-white truncate">{user?.name || 'Controller Admin'}</p>
            <p className="text-[10px] text-[#5C6B61] dark:text-[#9BA39D] truncate">{user?.designation || 'Directorate HQ'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#5C6B61] dark:text-[#9BA39D] uppercase">
            National Surveillance
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                id={item.id}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EEF3EF] text-[#426B5A] font-bold border border-[#8FAF9A]/50 dark:bg-[#426B5A] dark:text-white shadow-xs'
                      : 'text-[#5C6B61] dark:text-[#D2CDC0] hover:bg-[#F4F1E9] dark:hover:bg-[#2B332E] hover:text-[#303530] dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#426B5A] dark:text-[#8FAF9A]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Role Switcher & Bottom Actions */}
        <div className="p-3 border-t border-[#E8E1D2] dark:border-[#3A443E] space-y-2">
          {/* Quick switcher for testing */}
          <button
            id="btn-switch-to-inspector"
            onClick={handleSwitchToInspector}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-[#FAF9F5] dark:bg-[#2B332E] hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] text-[#303530] dark:text-[#FAF9F5] border border-[#E8E1D2] dark:border-[#3A443E] transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" />
            <span>Switch to Field Inspector</span>
          </button>

          <button
            id="btn-admin-logout"
            onClick={() => {
              logout();
              navigate('/officer-login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-[#8F4336] hover:bg-[#F6F0E4] dark:text-[#F2C7BF] dark:hover:bg-[#3E2926] border border-[#E8E1D2] dark:border-[#854E46]/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
