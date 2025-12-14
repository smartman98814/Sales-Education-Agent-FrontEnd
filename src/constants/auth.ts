// Thirdweb Authentication Constants

export const AUTH_COOKIE_NAME = 'jwt' as const;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const SUPPORTED_CHAINS = {
  BSC_TESTNET: 97,
  BSC_MAINNET: 56,
} as const;

export const WALLET_PROVIDERS = {
  IN_APP: 'inApp',
  METAMASK: 'io.metamask',
  COINBASE: 'com.coinbase.wallet',
  RAINBOW: 'me.rainbow',
  RABBY: 'io.rabby',
  ZERION: 'io.zerion.wallet',
} as const;

export const SOCIAL_LOGIN_PROVIDERS = {
  GOOGLE: 'google',
  DISCORD: 'discord',
  TELEGRAM: 'telegram',
  EMAIL: 'email',
  X: 'x', // Twitter
  PHONE: 'phone',
  PASSKEY: 'passkey',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_SUCCESS: 'Successfully logged out',
  SESSION_EXPIRED: 'Session expired, please login again',
  UNAUTHORIZED: 'Unauthorized access',
} as const;
