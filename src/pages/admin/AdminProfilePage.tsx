import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Shield,
  Building,
  Mail,
  Phone,
  Moon,
  Sun,
  LogOut,
  KeyRound,
  FileCheck2,
  Lock,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard')}
            className="p-2 rounded-lg border border-[#E8E1D2] dark:border-[#3F4A43] hover:bg-[#F4F1E9] dark:hover:bg-[#2B332E] text-[#66706A] dark:text-[#A8B2AA] transition-colors cursor-pointer"
            aria-label="Back to Admin Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-[#426B5A] dark:text-[#8FAF9A] uppercase tracking-wider block">
              Administrative Control
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#303530] dark:text-white tracking-tight">
              Administrator Profile & Credentials
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin-dashboard')}
          className="text-xs font-semibold cursor-pointer"
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Administrator Header Card */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#EEF3EF] dark:bg-[#23352B] border border-[#8FAF9A]/50 text-[#426B5A] dark:text-[#8FAF9A] flex items-center justify-center text-3xl font-bold shadow-xs">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-[#303530] dark:text-white">{user.name}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF3EF] text-[#426B5A] border border-[#8FAF9A]/50 dark:bg-[#23352B] dark:text-[#8FAF9A]">
                  <Shield className="w-3 h-3" />
                  Full Administrative Clearance
                </span>
              </div>
              <p className="text-xs font-semibold text-[#426B5A] dark:text-[#8FAF9A]">
                {user.designation || 'Controller of Legal Metrology / Directorate Administrator'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#66706A] dark:text-[#A8B2AA] pt-1">
                <span>
                  Role: <strong className="text-[#303530] dark:text-white font-mono uppercase">{user.role}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Personnel Code: <strong className="text-[#303530] dark:text-white font-mono">{user.badgeNumber || 'ADM-HQ-01'}</strong>
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Organizational & Administrative Details */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
        <CardHeader className="py-3 px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
          <h2 className="text-sm font-bold text-[#303530] dark:text-white">
            Administrative & Governance Authority
          </h2>
        </CardHeader>
        <CardBody className="p-5 space-y-3.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E8E1D2]/70 dark:border-[#3F4A43]/70 gap-1">
            <span className="text-[#66706A] dark:text-[#A8B2AA] flex items-center gap-2 font-medium">
              <Building className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" /> Governance Department
            </span>
            <span className="font-semibold text-[#303530] dark:text-white">
              Department of Consumer Affairs &bull; Legal Metrology Division
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E8E1D2]/70 dark:border-[#3F4A43]/70 gap-1">
            <span className="text-[#66706A] dark:text-[#A8B2AA] flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" /> Statutory Enforcement Scope
            </span>
            <span className="font-semibold text-[#303530] dark:text-white">
              Legal Metrology Act, 2009 & (Packaged Commodities) Rules, 2011
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E8E1D2]/70 dark:border-[#3F4A43]/70 gap-1">
            <span className="text-[#66706A] dark:text-[#A8B2AA] flex items-center gap-2 font-medium">
              <Mail className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" /> Official Contact Email
            </span>
            <span className="font-mono font-medium text-[#303530] dark:text-white">
              {user.email || 'controller.lm@gov.in'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E8E1D2]/70 dark:border-[#3F4A43]/70 gap-1">
            <span className="text-[#66706A] dark:text-[#A8B2AA] flex items-center gap-2 font-medium">
              <Phone className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" /> Official Directorate Landline
            </span>
            <span className="font-medium text-[#303530] dark:text-white">
              {user.phone || '+91 11 2338 1234'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
            <span className="text-[#66706A] dark:text-[#A8B2AA] flex items-center gap-2 font-medium">
              <FileText className="w-4 h-4 text-[#426B5A] dark:text-[#8FAF9A]" /> Headquarters Jurisdiction
            </span>
            <span className="font-medium text-[#303530] dark:text-white">
              Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Theme & Session Management */}
      <Card className="border-[#E8E1D2] dark:border-[#3F4A43]">
        <CardHeader className="py-3 px-5 border-b border-[#E8E1D2] dark:border-[#3F4A43]">
          <h2 className="text-sm font-bold text-[#303530] dark:text-white">
            Display Appearance & Active Session
          </h2>
        </CardHeader>
        <CardBody className="p-5 space-y-4">
          {/* Theme Switcher */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#303530] dark:text-white">
                Interface Color Scheme
              </p>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                Current setting: <strong className="text-[#303530] dark:text-white capitalize">{theme} Mode</strong> (Natural Trust Palette)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-[#426B5A]" />}
              className="text-xs font-semibold cursor-pointer"
            >
              {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            </Button>
          </div>

          {/* Session Logout Action */}
          <div className="pt-3 border-t border-[#E8E1D2] dark:border-[#3F4A43] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#8F4336] dark:text-[#F2C7BF]">
                Administrative Session Termination
              </p>
              <p className="text-[11px] text-[#66706A] dark:text-[#A8B2AA]">
                Safely sign out from the Directorate Headquarters terminal
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-xs font-semibold cursor-pointer"
            >
              Log Out Session
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
