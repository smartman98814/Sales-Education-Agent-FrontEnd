import { createScopedLogger } from '@/utils';

const logger = createScopedLogger('config/auth');

export interface WalletAuthConfig {
  supportedChains: number[];
  defaultChain: number;
}

export const walletAuthConfig: WalletAuthConfig = {
  supportedChains: [97, 56], // BSC Testnet and Mainnet
  defaultChain: 97, // BSC Testnet
};

// Helper to get wallet address from localStorage
export const getStoredWalletAddress = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Thirdweb stores active wallet info in localStorage
    const walletData = localStorage.getItem('thirdweb:active-wallet');
    if (walletData) {
      const parsed = JSON.parse(walletData);
      return parsed?.address || null;
    }
  } catch (error) {
    logger.error('Error reading wallet data from localStorage:', error);
  }

  return null;
};

// Helper to check if wallet is connected
export const isWalletConnected = (): boolean => {
  return !!getStoredWalletAddress();
};
