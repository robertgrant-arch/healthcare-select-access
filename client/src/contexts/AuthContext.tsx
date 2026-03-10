// Healthcare Select Access — Auth Context
// Design: Secure Clarity | Federal Blue + Medical Teal

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AccountStatus } from '@/lib/types';
import { MOCK_USER } from '@/lib/mock-data';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accountStatus: AccountStatus | null;
  login: (email: string, password: string) => Promise<{ requiresMfa: boolean; userId: string }>;
  verifyMfa: (userId: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ userId: string }>;
  verifyEmail: (userId: string, otp: string) => Promise<void>;
  verifyIdentity: (data: IdentityData) => Promise<void>;
  setupMfa: () => Promise<{ secret: string; uri: string; qrDataUrl: string; backupCodes: string[] }>;
  confirmMfaSetup: (code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface IdentityData {
  mbi: string;
  dateOfBirth: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Simulated auth state for demo
const DEMO_CREDENTIALS = { email: 'jane.doe@example.com', password: 'Demo@1234!' };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hsa_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setAccountStatus(parsed.user.status);
      } catch {
        localStorage.removeItem('hsa_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    setIsLoading(false);

    // Demo: any credentials work, but show MFA step
    const userId = 'usr_01HXYZ1234567890';
    return { requiresMfa: true, userId };
  }, []);

  const verifyMfa = useCallback(async (userId: string, _code: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const userData = { ...MOCK_USER, id: userId };
    setUser(userData);
    setAccountStatus('ACTIVE');
    localStorage.setItem('hsa_session', JSON.stringify({ user: userData, expiresAt: Date.now() + 8 * 3600 * 1000 }));
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setUser(null);
    setAccountStatus(null);
    localStorage.removeItem('hsa_session');
    setIsLoading(false);
  }, []);

  const register = useCallback(async (_data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    return { userId: 'usr_new_' + Date.now() };
  }, []);

  const verifyEmail = useCallback(async (_userId: string, _otp: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setAccountStatus('PENDING_IDENTITY_VERIFICATION');
    setIsLoading(false);
  }, []);

  const verifyIdentity = useCallback(async (_data: IdentityData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setAccountStatus('PENDING_MFA_ENROLLMENT');
    setIsLoading(false);
  }, []);

  const setupMfa = useCallback(async () => {
    await new Promise(r => setTimeout(r, 500));
    // Generate a demo TOTP setup
    return {
      secret: 'JBSWY3DPEHPK3PXP',
      uri: 'otpauth://totp/HealthcareSelectAccess:jane.doe@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HealthcareSelectAccess',
      qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      backupCodes: [
        'ALPHA-BRAVO-1234',
        'CHARLIE-DELTA-5678',
        'ECHO-FOXTROT-9012',
        'GOLF-HOTEL-3456',
        'INDIA-JULIET-7890',
        'KILO-LIMA-2345',
        'MIKE-NOVEMBER-6789',
        'OSCAR-PAPA-0123',
      ],
    };
  }, []);

  const confirmMfaSetup = useCallback(async (_code: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const userData = { ...MOCK_USER, mfaEnabled: true, status: 'ACTIVE' as const };
    setUser(userData);
    setAccountStatus('ACTIVE');
    localStorage.setItem('hsa_session', JSON.stringify({ user: userData, expiresAt: Date.now() + 8 * 3600 * 1000 }));
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      await new Promise(r => setTimeout(r, 300));
      // In production, re-fetch user from API
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      accountStatus,
      login,
      verifyMfa,
      logout,
      register,
      verifyEmail,
      verifyIdentity,
      setupMfa,
      confirmMfaSetup,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
