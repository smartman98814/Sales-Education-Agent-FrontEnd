import axios from 'axios';

import { APP_ENV, ApiUrls } from '@/configs';
import { AUTH_MESSAGES } from '@/constants';
import { createScopedLogger } from '@/utils';

const logger = createScopedLogger('api/auth');

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
    username?: string;
    avatar?: string;
  };
}

export interface UserInfo {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Register a new user
 */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  try {
    const url = BACKEND_API_URL + '/api/auth/register';

    const { data } = await axios.post<AuthResponse>(url, request, {
      withCredentials: true,
    });

    if (data.success) {
      logger.info('Registration successful');
    }

    return data;
  } catch (error) {
    logger.error('Error during registration:', error);
    throw error;
  }
}

/**
 * Login with email and password
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
  try {
    const url = BACKEND_API_URL + ApiUrls.auth.login;

    const { data } = await axios.post<AuthResponse>(url, request, {
      withCredentials: true,
    });

    if (data.success) {
      logger.info(AUTH_MESSAGES.LOGIN_SUCCESS);
    } else {
      logger.warn(AUTH_MESSAGES.LOGIN_FAILED);
    }

    return data;
  } catch (error) {
    logger.error('Error during login:', error);
    throw error;
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(): Promise<boolean> {
  try {
    const url = BACKEND_API_URL + ApiUrls.auth.isLoggedIn;

    const { data } = await axios.get<boolean>(url, {
      withCredentials: true,
    });
    return data === true;
  } catch (error) {
    logger.error('Error checking login status:', error);
    return false;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const url = BACKEND_API_URL + ApiUrls.auth.logout;

    await axios.post(
      url,
      {},
      {
        withCredentials: true,
      },
    );
    logger.info(AUTH_MESSAGES.LOGOUT_SUCCESS);
  } catch (error) {
    logger.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const url = BACKEND_API_URL + ApiUrls.auth.me;

    const { data } = await axios.get<UserInfo>(url, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    logger.error('Error getting current user:', error);
    return null;
  }
}
