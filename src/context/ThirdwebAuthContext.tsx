'use client';

/**
 * Web3/Thirdweb auth is disabled per user request.
 * This context now handles email/password authentication.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getCurrentUser, isLoggedIn, logout as apiLogout } from '@/api/auth';
import type { ThirdwebUser } from '@/types/auth';

export interface ThirdwebAuthContextType {
  user: ThirdwebUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showSignInDialog: boolean;
  openSignInDialog: () => void;
  closeSignInDialog: () => void;
  signOut: () => Promise<void>;
  walletAddress: string | null;
  getSession: () => Promise<any>;
  updateSession: () => Promise<any>;
  refreshUser: () => Promise<void>;
}

const ThirdwebAuthContext = createContext<ThirdwebAuthContextType | undefined>(undefined);

interface ThirdwebAuthProviderProps {
  children: React.ReactNode;
}

export const ThirdwebAuthProvider: React.FC<ThirdwebAuthProviderProps> = ({ children }) => {
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [user, setUser] = useState<ThirdwebUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = await isLoggedIn();
        if (loggedIn) {
          const userInfo = await getCurrentUser();
          if (userInfo) {
            setUser({
              address: userInfo.id,
              displayName: userInfo.displayName || userInfo.email || 'User',
            });
          }
        } else {
          setUser({
            address: 'guest',
            displayName: 'Guest',
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser({
          address: 'guest',
          displayName: 'Guest',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await apiLogout();
      setUser({
        address: 'guest',
        displayName: 'Guest',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const userInfo = await getCurrentUser();
        if (userInfo) {
          setUser({
            address: userInfo.id,
            displayName: userInfo.displayName || userInfo.email || 'User',
          });
        }
      } else {
        setUser({
          address: 'guest',
          displayName: 'Guest',
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = useMemo<ThirdwebAuthContextType>(
    () => ({
      user: user || {
        address: 'guest',
        displayName: 'Guest',
      },
      isAuthenticated: user?.address !== 'guest',
      isLoading,
      showSignInDialog,
      openSignInDialog: () => setShowSignInDialog(true),
      closeSignInDialog: () => setShowSignInDialog(false),
      signOut: handleSignOut,
      walletAddress: null,
      getSession: async () => null,
      updateSession: async () => null,
      refreshUser,
    }),
    [showSignInDialog, user, isLoading],
  );

  return <ThirdwebAuthContext.Provider value={value}>{children}</ThirdwebAuthContext.Provider>;
};

export const useThirdwebAuth = (): ThirdwebAuthContextType => {
  const context = useContext(ThirdwebAuthContext);
  if (context === undefined) {
    throw new Error('useThirdwebAuth must be used within a ThirdwebAuthProvider');
  }
  return context;
};

