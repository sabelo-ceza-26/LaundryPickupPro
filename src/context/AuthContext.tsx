import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { Role, User } from '../types';

type AuthContextValue = {
  isAuthenticated: boolean;
  role: Role | null;
  user: User | null;
  hasSignedInBefore: boolean;
  lastRole: Role | null;
  signIn: (role: Role, user: User) => void;
  signOut: () => void;
  updateUser: (patch: Partial<Omit<User, 'id' | 'role'>>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [hasSignedInBefore, setHasSignedInBefore] = useState(false);
  const [lastRole, setLastRole] = useState<Role | null>(null);

  const signIn = useCallback((nextRole: Role, nextUser: User) => {
    setRole(nextRole);
    setUser(nextUser);
    setHasSignedInBefore(true);
    setLastRole(nextRole);
  }, []);

  const signOut = useCallback(() => {
    setRole(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<Omit<User, 'id' | 'role'>>) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      role,
      user,
      hasSignedInBefore,
      lastRole,
      signIn,
      signOut,
      updateUser,
    }),
    [user, role, hasSignedInBefore, lastRole, signIn, signOut, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
