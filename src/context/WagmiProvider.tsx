'use client';

/**
 * Web3/Wagmi support is disabled per user request.
 * This provider now simply renders children without initializing
 * any blockchain clients.
 */

import React from 'react';

interface WagmiProviderProps {
  children: React.ReactNode;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return <>{children}</>;
}
