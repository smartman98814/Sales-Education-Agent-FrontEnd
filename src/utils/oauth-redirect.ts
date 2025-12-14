/**
 * Utility functions for managing OAuth redirect state on mobile devices
 */

interface OAuthRedirectState {
  provider: string;
  returnUrl: string;
  timestamp: number;
  mode: 'login' | 'signup';
}

const OAUTH_STATE_KEY = 'oauth_redirect_state';
const STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Save OAuth state before redirecting to OAuth provider
 */
export const saveOAuthRedirectState = (
  provider: string,
  returnUrl: string,
  mode: 'login' | 'signup' = 'login',
): void => {
  const state: OAuthRedirectState = {
    provider,
    returnUrl,
    timestamp: Date.now(),
    mode,
  };

  try {
    localStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save OAuth state:', error);
  }
};

/**
 * Retrieve OAuth state after returning from OAuth provider
 * Returns null if state is expired or doesn't exist
 */
export const getOAuthRedirectState = (): OAuthRedirectState | null => {
  try {
    const stateJson = localStorage.getItem(OAUTH_STATE_KEY);
    if (!stateJson) return null;

    const state: OAuthRedirectState = JSON.parse(stateJson);

    // Check if state is expired
    if (Date.now() - state.timestamp > STATE_EXPIRY_MS) {
      clearOAuthRedirectState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to retrieve OAuth state:', error);
    return null;
  }
};

/**
 * Clear OAuth redirect state from localStorage
 */
export const clearOAuthRedirectState = (): void => {
  try {
    localStorage.removeItem(OAUTH_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear OAuth state:', error);
  }
};

/**
 * Check if current page load is from an OAuth redirect
 */
export const isOAuthRedirect = (): boolean => {
  // Check if we have OAuth state and if URL contains OAuth callback indicators
  const hasRedirectState = !!getOAuthRedirectState();
  const urlParams = new URLSearchParams(window.location.search);
  const hasCode = urlParams.has('code');
  const hasState = urlParams.has('state');

  return hasRedirectState || (hasCode && hasState);
};
