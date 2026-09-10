import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Scale,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth, DEMO_INSPECTOR, DEMO_ADMIN } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('inspector');
  const [username, setUsername] = useState('inspector.rajesh');
  const [password, setPassword] = useState('Inspect@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailOrBadge, setForgotEmailOrBadge] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValidationError(null);
    if (role === 'admin') {
      setUsername('admin.mehra');
      setPassword('AdminHQ@2026');
    } else {
      setUsername('inspector.rajesh');
      setPassword('Inspect@2026');
    }
  };

  const handleQuickFill = (role: UserRole) => {
    handleRoleSelect(role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!username.trim()) {
      setValidationError('Please provide your authorized Officer Username / Email ID.');
      return;
    }
    if (!password || password.length < 4) {
      setValidationError('Please provide your secure terminal password (minimum 4 characters).');
      return;
    }

    setIsLoading(true);

    // Mock authentication with realistic delay
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'admin') {
        loginAs('admin', {
          name: DEMO_ADMIN.name,
          badgeNumber: DEMO_ADMIN.badgeNumber,
          zone: DEMO_ADMIN.zone,
        });
        navigate('/admin-dashboard');
      } else {
        loginAs('inspector', {
          name: DEMO_INSPECTOR.name,
          badgeNumber: DEMO_INSPECTOR.badgeNumber,
          zone: DEMO_INSPECTOR.zone,
        });
        navigate('/compliance-dashboard');
      }
    }, 650);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrBadge.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmailOrBadge('');
    }, 2800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#FAF9F5] dark:bg-[#202622] text-[#303530] dark:text-[#F5F3EA] transition-colors">
      <div className="w-full max-w-md space-y-5">
        {/* Emblem & Natural Trust Branding Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#426B5A] text-[#FAF9F5] shadow-xs mb-3">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#303530] dark:text-[#F5F3EA]">
            LegalMetriX
          </h1>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D5E2D9] dark:bg-[#343D37] text-[#2C493D] dark:text-[#6F9B84] text-[11px] font-semibold tracking-wider uppercase mt-1">
            <span>Statutory Field Enforcement Terminal</span>
          </div>
          <p className="text-xs text-[#565D57] dark:text-[#D2CDC0] mt-2 max-w-sm mx-auto leading-relaxed">
            Legal Metrology (Packaged Commodities) Rules, 2011 — Inspectorate & Directorate Surveillance System.
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-sm border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#2B332E]">
          <CardBody className="p-6">
            {/* Role Selection Tabs */}
            <div className="space-y-1.5 mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A534B] dark:text-[#D4D0C5]">
                Select Authorized Role
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F4EFE6] dark:bg-[#343D37] rounded-xl">
                <button
                  type="button"
                  id="tab-role-inspector"
                  onClick={() => handleRoleSelect('inspector')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === 'inspector'
                      ? 'bg-[#FAF9F5] dark:bg-[#2B332E] text-[#2C493D] dark:text-[#6F9B84] shadow-xs border border-[#8FAF9A]/40 dark:border-[#4A6E59]'
                      : 'text-[#4A534B] dark:text-[#D4D0C5] hover:text-[#303530] dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#426B5A] dark:text-[#6F9B84]" />
                  <span>Inspector / Supervisor</span>
                </button>
                <button
                  type="button"
                  id="tab-role-admin"
                  onClick={() => handleRoleSelect('admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#FAF9F5] dark:bg-[#2B332E] text-[#2C493D] dark:text-[#6F9B84] shadow-xs border border-[#8FAF9A]/40 dark:border-[#4A6E59]'
                      : 'text-[#4A534B] dark:text-[#D4D0C5] hover:text-[#303530] dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#426B5A] dark:text-[#6F9B84]" />
                  <span>Directorate Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Chips */}
            <div className="flex items-center justify-between text-[11px] mb-4 pb-3 border-b border-[#E8E1D2] dark:border-[#3A443E]">
              <span className="text-[#4A534B] dark:text-[#D4D0C5]">Quick Demo Credentials:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('inspector')}
                  className="px-2 py-0.5 rounded bg-[#D5E2D9]/70 hover:bg-[#D5E2D9] text-[#2C493D] text-[10px] font-bold transition cursor-pointer"
                >
                  Fill Inspector
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin')}
                  className="px-2 py-0.5 rounded bg-[#E8E1D2] hover:bg-[#D8C79B] text-[#303530] text-[10px] font-bold transition cursor-pointer"
                >
                  Fill Admin
                </button>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-[#F6F0E4] dark:bg-[#3B3426] border border-[#D8C79B] dark:border-[#8E7C4F] text-xs text-[#6B4E23] dark:text-[#E8D5B0] flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#8A6730] dark:text-[#D8C79B]" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#303530] dark:text-[#F5F3EA] mb-1">
                  Officer Username / Official ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRole === 'inspector' ? 'e.g. inspector.rajesh' : 'e.g. admin.mehra'}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#426B5A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#303530] dark:text-[#F5F3EA]">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-[#426B5A] dark:text-[#8FAF9A] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    required
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#426B5A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full justify-center py-2.5 text-xs font-bold uppercase tracking-wider bg-[#426B5A] hover:bg-[#2C493D] text-[#FAF9F5] shadow-xs cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Enter {selectedRole === 'inspector' ? 'Field Terminal' : 'Apex Center'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Auxiliary Change Password Action */}
              <div className="pt-3 border-t border-[#E8E1D2] dark:border-[#3A443E] flex items-center justify-between text-xs">
                <span className="text-[#4A534B] dark:text-[#D4D0C5]">Need to reset terminal key?</span>
                <Link
                  to="/change-password"
                  className="font-bold text-[#426B5A] dark:text-[#8FAF9A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Government Authority Footer */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-[#4A534B] dark:text-[#D4D0C5]">
            Government of India &bull; Ministry of Consumer Affairs, Food & Public Distribution
          </p>
          <p className="text-[10px] text-[#4A534B] dark:text-[#D4D0C5]">
            Legal Metrology Directorate &bull; Natural Trust System Framework
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#2B332E] rounded-2xl border border-[#E8E1D2] dark:border-[#3A443E] shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E1D2] dark:border-[#3A443E] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#426B5A] dark:text-[#6F9B84]" />
                <h3 className="text-sm font-bold text-[#303530] dark:text-[#F5F3EA]">
                  Reset Security Passphrase
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#343D37] text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-[#EAF2ED] dark:bg-[#23352B] border border-[#8FAF9A]/60 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-[#426B5A] dark:text-[#8FAF9A] mx-auto" />
                <p className="text-xs font-bold text-[#2C493D] dark:text-[#C4E2D0]">
                  Temporary OTP Dispatched
                </p>
                <p className="text-[11px] text-[#2C493D]/80 dark:text-[#C4E2D0]/80">
                  Verification OTP has been sent to your registered NIC / Government mobile number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-[#565D57] dark:text-[#D2CDC0]">
                  Enter your official email or officer badge number to receive an encrypted reset token.
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-[#303530] dark:text-[#F5F3EA] mb-1">
                    Registered Email or Badge ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rajesh.sharma@gov.in or LM-DL-8821"
                    value={forgotEmailOrBadge}
                    onChange={(e) => setForgotEmailOrBadge(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E1D2] dark:border-[#3A443E] bg-white dark:bg-[#202622] text-[#303530] dark:text-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#426B5A]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold"
                  >
                    Request OTP
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

