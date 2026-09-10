import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService, API_CONFIG, clearAuthToken } from '../services/api';

export const DEMO_INSPECTOR: User = {
  id: 'INSP-DEL-041',
  name: 'Rajesh Sharma',
  badgeNumber: 'LM-DL-8821',
  role: 'inspector',
  designation: 'Senior Legal Metrology Inspector',
  zone: 'North Delhi Zone',
  district: 'Central District',
  state: 'Delhi (NCT)',
  email: 'rajesh.sharma@lm.delhi.gov.in',
  phone: '+91 98112 34567',
  dutyStatus: 'on-duty',
  assignedStation: 'Civil Lines LM Office, Delhi',
  lastActive: 'Just now',
};

export const DEMO_ADMIN: User = {
  id: 'ADMIN-HQ-001',
  name: 'Dr. Arvind Mehra',
  badgeNumber: 'LM-DIR-009',
  role: 'admin',
  designation: 'Joint Controller of Legal Metrology',
  zone: 'National Headquarters',
  district: 'New Delhi',
  state: 'Govt. of India',
  email: 'arvind.mehra@gov.in',
  phone: '+91 11 2338 4122',
  dutyStatus: 'on-duty',
  assignedStation: 'Krishi Bhawan, Dept. of Consumer Affairs',
  lastActive: 'Active',
};

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole, customUser?: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUserStatus: (status: 'on-duty' | 'off-duty' | 'on-leave') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'legalmetrix_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Error loading stored auth user', e);
    }
    // Default to inspector for convenient hackathon testing
    return DEMO_INSPECTOR;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error persisting auth state', e);
    }
  }, [user]);

  const loginAs = async (role: UserRole, customUser?: Partial<User>) => {
    try {
      const result = await apiService.login({
        badgeNumber:
          customUser?.badgeNumber || (role === 'admin' ? DEMO_ADMIN.badgeNumber : DEMO_INSPECTOR.badgeNumber),
        role,
      });
      setUser({ ...result.user, ...customUser });
    } catch (e) {
      console.warn('API login fallback to local profile', e);
      if (role === 'admin') {
        setUser({ ...DEMO_ADMIN, ...customUser });
      } else {
        setUser({ ...DEMO_INSPECTOR, ...customUser });
      }
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthToken();
  };

  const updateUserStatus = async (status: 'on-duty' | 'off-duty' | 'on-leave') => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, dutyStatus: status } : null));
      try {
        if (!API_CONFIG.USE_MOCK) {
          await apiService.updateInspectorDutyStatus(status);
        }
      } catch (e) {
        console.warn('Failed to sync officer duty status with backend', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        loginAs,
        logout,
        updateUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
