'use client';

/**
 * Web3/Binance wallet support is disabled per user request.
 * This file now provides a no-op context to keep the app stable
 * without pulling in blockchain providers.
 */

import React, { createContext, useContext, useMemo } from 'react';

export interface BinanceWalletUser {
  address: string;
  balance?: string;
}

export interface BinanceWalletContextType {
  user: BinanceWalletUser | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  mintAgent: (metadata: any, agentId: string) => Promise<any>;
  refreshBalance: () => Promise<void>;
}

const BinanceWalletContext = createContext<BinanceWalletContextType | undefined>(undefined);

interface BinanceWalletProviderProps {
  children: React.ReactNode;
}

export const BinanceWalletProvider: React.FC<BinanceWalletProviderProps> = ({ children }) => {
  const value = useMemo<BinanceWalletContextType>(
    () => ({
      user: null,
      isConnected: false,
      isConnecting: false,
      error: 'Web3 features are disabled in this build.',
      connect: async () => {},
      disconnect: async () => {},
      mintAgent: async () => {
        throw new Error('Web3 features are disabled in this build.');
      },
      refreshBalance: async () => {},
    }),
    [],
  );

  return <BinanceWalletContext.Provider value={value}>{children}</BinanceWalletContext.Provider>;
};

export const useBinanceWallet = (): BinanceWalletContextType => {
  const context = useContext(BinanceWalletContext);
  if (context === undefined) {
    throw new Error('useBinanceWallet must be used within a BinanceWalletProvider');
  }
  return context;
};
