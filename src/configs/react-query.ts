import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered stale after 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 2,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: (failureCount, error) => {
        // Don't retry on 404 (chat doesn't exist)
        if ((error as AxiosError)?.response?.status === 404) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});
