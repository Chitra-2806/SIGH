import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  MapPin,
  Mail,
  Phone,
  Radio,
  Moon,
  Sun,
  LogOut,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusPill } from '../../components/common/StatusPill';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const InspectorProfilePage: React.FC = () => {
  const { user, logout, updateUserStatus } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Officer Identity Card */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#426B5A] text-[#FAF9F5] flex items-center justify-center text-2xl font-bold shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-[#303530] dark:text-[#F5F3EA]">{user.name}</h2>
                <StatusPill status={user.dutyStatus || 'on-duty'} size="sm" />
              </div>
              <p className="text-xs font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
                {user.designation}
              </p>
              <p className="text-xs text-[#4A534B] dark:text-[#D4D0C5]">
                Badge No:{' '}
                <span className="font-mono font-bold text-[#303530] dark:text-[#FAF9F5]">
                  {user.badgeNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Duty Status Switcher (Light Segmented Control) */}
          <div className="mt-6 pt-5 border-t border-[#E8E1D2] dark:border-[#3F4A43]">
            <label className="block text-xs font-semibold text-[#303530] dark:text-[#FAF9F5] mb-2">
              Update Current Field Duty Status
            </label>
            <div className="p-1 rounded-xl bg-[#F4F1E9] dark:bg-[#202622] border border-[#E8E1D2] dark:border-[#3F4A43] grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => updateUserStatus('on-duty')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  user.dutyStatus === 'on-duty'
                    ? 'bg-white text-[#426B5A] shadow-xs border border-[#8FAF9A]/60 font-bold dark:bg-[#2B332E] dark:text-[#8FAF9A] dark:border-[#4A6E59]'
                    : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-white/50 dark:hover:bg-[#2B332E]'
                }`}
              >
                On Duty (Active)
              </button>
              <button
                type="button"
                onClick={() => updateUserStatus('off-duty')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  user.dutyStatus === 'off-duty'
                    ? 'bg-white text-[#565E57] shadow-xs border border-[#D2CBC0] font-bold dark:bg-[#2B332E] dark:text-[#D2CDC0] dark:border-[#545D56]'
                    : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-white/50 dark:hover:bg-[#2B332E]'
                }`}
              >
                Off Duty
              </button>
              <button
                type="button"
                onClick={() => updateUserStatus('on-leave')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  user.dutyStatus === 'on-leave'
                    ? 'bg-white text-[#6B4E23] shadow-xs border border-[#D8C79B] font-bold dark:bg-[#2B332E] dark:text-[#E8D5B0] dark:border-[#8E7C4F]'
                    : 'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] hover:bg-white/50 dark:hover:bg-[#2B332E]'
                }`}
              >
                On Leave
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Official Jurisdiction & Contact Information */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
        <CardHeader className="py-3 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
          <h3 className="text-sm font-semibold text-[#303530] dark:text-[#F5F3EA]">
            Deployment & Jurisdiction
          </h3>
        </CardHeader>
        <CardBody className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
            <span className="text-[#4A534B] dark:text-[#D4D0C5] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" /> Assigned Zone / Circle
            </span>
            <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">{user.zone}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
            <span className="text-[#4A534B] dark:text-[#D4D0C5] flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" /> Base Station / Office
            </span>
            <span className="font-semibold text-[#303530] dark:text-[#F5F3EA]">
              {user.assignedStation || 'Regional Metrology Station'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
            <span className="text-[#4A534B] dark:text-[#D4D0C5] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" /> Official Email
            </span>
            <span className="font-mono text-[#303530] dark:text-[#F5F3EA]">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-[#4A534B] dark:text-[#D4D0C5] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#426B5A] dark:text-[#8FAF9A]" /> Contact Phone
            </span>
            <span className="text-[#303530] dark:text-[#F5F3EA]">{user.phone}</span>
          </div>
        </CardBody>
      </Card>

      {/* Application Settings & Appearance */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E]">
        <CardHeader className="py-3 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
          <h3 className="text-sm font-semibold text-[#303530] dark:text-[#F5F3EA]">
            App Settings & Preferences
          </h3>
        </CardHeader>
        <CardBody className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#303530] dark:text-[#F5F3EA]">
                Interface Color Scheme
              </p>
              <p className="text-[11px] text-[#4A534B] dark:text-[#D4D0C5]">
                Currently set to {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </div>

          <div className="pt-2 border-t border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B4E23] dark:text-[#E8D5B0]">End Active Session</p>
              <p className="text-[11px] text-[#4A534B] dark:text-[#D4D0C5]">
                Log out of the LegalMetriX terminal
              </p>
            </div>
            <Button
              id="btn-profile-logout"
              variant="secondary"
              size="sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-[#6B4E23] dark:text-[#E8D5B0] hover:bg-[#F6F0E4] dark:hover:bg-[#3B3426] border-[#D8C79B]"
            >
              Log Out
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
