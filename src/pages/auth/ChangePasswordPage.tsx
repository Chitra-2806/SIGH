import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle2, ArrowLeft, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New security passphrase must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Confirmation passphrase does not match.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 pt-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#F5F3EA] text-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back</span>
        </Button>
      </div>

      <Card className="border-[#E8E1D2] dark:border-[#3F4A43] shadow-sm bg-white dark:bg-[#2B332E]">
        <CardHeader className="py-4 px-6 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#426B5A] text-[#FAF9F5] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#303530] dark:text-[#F5F3EA]">
                Officer Terminal Passphrase Management
              </CardTitle>
              <p className="text-[11px] text-[#4A534B] dark:text-[#D4D0C5]">
                Badge: {user?.badgeNumber || 'LM-DL-8821'} &bull; {user?.name}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-6 space-y-4">
          {isSuccess ? (
            <div className="p-4 rounded-xl bg-[#EAF2ED] dark:bg-[#23352B] border border-[#8FAF9A]/60 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#426B5A] dark:text-[#8FAF9A] mx-auto" />
              <p className="text-sm font-bold text-[#2C493D] dark:text-[#C4E2D0]">
                Passphrase Successfully Updated
              </p>
              <p className="text-xs text-[#2C493D]/80 dark:text-[#C4E2D0]/80">
                Your credentials have been re-encrypted. Redirecting...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-[#F6F0E4] dark:bg-[#3B3426] border border-[#D8C79B] dark:border-[#8E7C4F] text-[#6B4E23] dark:text-[#E8D5B0]">
                  {errorMessage}
                </div>
              )}

              <Input
                id="input-current-password"
                type="password"
                label="Current Officer Passphrase"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <Input
                id="input-new-password"
                type="password"
                label="New Terminal Security Passphrase"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
              />

              <Input
                id="input-confirm-password"
                type="password"
                label="Re-enter New Passphrase"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#426B5A] hover:bg-[#2C493D] text-white font-bold py-2.5 text-xs shadow-sm cursor-pointer"
                >
                  Update Passphrase & Secure Device
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
