'use client';

/**
 * Web3/Thirdweb support is disabled per user request.
 * This provider now simply renders children without initializing
 * any blockchain clients.
 */

import React from 'react';

export function ThirdwebProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
