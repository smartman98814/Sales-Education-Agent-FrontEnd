import { type AxiosInstance, type AxiosRequestConfig, default as axios } from 'axios';
import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

import { createScopedLogger } from '@/utils';

import { APP_ENV } from './env';

const logger = createScopedLogger('config/axios');
const deviceUUID = uuidv4();

// Base axios configuration
const baseConfig: AxiosRequestConfig = {
  baseURL: APP_ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'nfa-xyz': 'nfa-xyz/webapp/package-version',
    device: deviceUUID,
  },
  timeout: APP_ENV.API_TIMEOUT,
};

// Base axios client (no auth)
export const axiosClient = axios.create(baseConfig);

// Create authenticated axios instance with token
export const createAuthenticatedAxios = (token: string): AxiosInstance => {
  const authenticatedAxios = axios.create({
    ...baseConfig,
    headers: {
      ...baseConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Add response interceptor for token refresh handling
  authenticatedAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        logger.warn('Received 401 response, token may be expired');
        // Let next-auth handle token refresh automatically
        if (typeof window !== 'undefined') {
          // Client-side: trigger session refresh
          const session = await getSession();
          const accessToken = session?.user?.accessToken;

          if (accessToken && error.config.headers.Authorization !== `Bearer ${accessToken}`) {
            logger.log('Retrying request with refreshed token');
            // Retry the request with new token
            error.config.headers.Authorization = `Bearer ${accessToken}`;

            return authenticatedAxios.request(error.config);
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return authenticatedAxios;
};

// Server-side authenticated axios
export const getServerAxios = async (): Promise<AxiosInstance> => {
  try {
    // For server-side, we'll need to implement auth() from NextAuth v5
    // For now, return base client as server-side auth needs more setup
    logger.warn('Server-side auth not implemented yet, using base client');
    return axiosClient;
  } catch (error) {
    logger.error('Error getting server token:', error);

    return axiosClient; // Fallback to base client
  }
};

// Client-side authenticated axios
export const getClientAxios = async (): Promise<AxiosInstance> => {
  try {
    const session = await getSession();

    if (!session) {
      logger.warn('No session found on client');

      return axiosClient; // Return base client without auth
    }

    // Access token from session.user which contains the JWT data
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
      logger.warn('No access token found in client session');
      return axiosClient; // Return base client without auth
    }

    return createAuthenticatedAxios(accessToken);
  } catch (error) {
    logger.error('Error getting wallet address:', error);
    return axiosClient; // Fallback to base client
  }
};

// Universal axios instance factory (context-aware)
export const getAxiosInstance = async (): Promise<AxiosInstance> => {
  if (typeof window === 'undefined') {
    // Server-side
    return await getServerAxios();
  } else {
    // Client-side
    return await getClientAxios();
  }
};

// Utility function to create abort controller
export const createAbortController = (): AbortController => {
  return new AbortController();
};
