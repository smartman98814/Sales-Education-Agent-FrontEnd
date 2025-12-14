// Authentication types for Thirdweb wallet-based authentication
import type { LoginPayload, VerifyLoginPayloadParams } from 'thirdweb/auth';

// User type
export interface User {
  address: string;
  displayName?: string;
  avatar?: string;
  username?: string;
  email?: string;
}

// Thirdweb-specific user type
export interface ThirdwebUser {
  address: string;
  displayName?: string;
  avatar?: string;
  email?: string;
  username?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Login response type
export interface ThirdwebLoginResponse {
  success: boolean;
  token: string;
  address: string;
}

// User info response from API
export interface UserInfoResponse {
  address: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  email?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Login status check response
export interface LoginStatusResponse {
  isLoggedIn: boolean;
  address: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  email?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Session type for compatibility
export interface Session {
  user: User | null;
  expires: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showSignInDialog: boolean;
  openSignInDialog: () => void;
  closeSignInDialog: () => void;
  signOut: () => Promise<void>;
  getSession: () => Promise<Session | null>;
  updateSession: (data?: any) => Promise<Session | null>;
  walletAddress?: string | null;
}

// Wallet-specific types
export interface WalletAuthState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance?: string;
}

export interface WalletSignMessage {
  message: string;
  signature?: string;
  timestamp: number;
}

// Type guards
export function isThirdwebUser(user: any): user is ThirdwebUser {
  return user && typeof user.address === 'string';
}

export function isLoginStatusResponse(response: any): response is LoginStatusResponse {
  return (
    response && typeof response.isLoggedIn === 'boolean' && typeof response.address === 'string'
  );
}

// Re-export Thirdweb types for convenience
export type { LoginPayload, VerifyLoginPayloadParams };
