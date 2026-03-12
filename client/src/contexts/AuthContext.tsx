// Healthcare Select Access — Auth Context
// Design: Secure Clarity | Federal Blue + Medical Teal

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AccountStatus } from '@/lib/types';

// API base URL for auth endpoints
const API_BASE = '/api/auth';

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

// Secure fetch wrapper with credentials and error handling
async function authFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);

  // Validate session on mount via server-side check
  useEffect(() => {
    authFetch('/me')
      .then((data) => {
        setUser(data.user);
        setAccountStatus(data.user.status);
      })
      .catch(() => {
        setUser(null);
        setAccountStatus(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return { requiresMfa: data.requiresMfa, userId: data.userId };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyMfa = useCallback(async (userId: string, code: string) => {
    setIsLoading(true);
    try {
      const data = await authFetch('/mfa/verify', {
        method: 'POST',
        body: JSON.stringify({ userId, code }),
      });
      setUser(data.user);
      setAccountStatus(data.user.status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authFetch('/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setAccountStatus(null);
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authFetch('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { userId: result.userId };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (userId: string, otp: string) => {
    setIsLoading(true);
    try {
      const data = await authFetch('/verify-email', {
        method: 'POST',
        body: JSON.stringify({ userId, otp }),
      });
      setAccountStatus(data.status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyIdentity = useCallback(async (data: IdentityData) => {
    setIsLoading(true);
    try {
      const result = await authFetch('/verify-identity', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setAccountStatus(result.status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupMfa = useCallback(async () => {
    const data = await authFetch('/mfa/setup', { method: 'POST' });
    return {
      secret: data.secret,
      uri: data.uri,
      qrDataUrl: data.qrDataUrl,
      backupCodes: data.backupCodes,
    };
  }, []);

  const confirmMfaSetup = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const data = await authFetch('/mfa/confirm', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setUser(data.user);
      setAccountStatus(data.user.status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (user) {
      try {
        const data = await authFetch('/me');
        setUser(data.user);
        setAccountStatus(data.user.status);
      } catch {
        setUser(null);
        setAccountStatus(null);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
