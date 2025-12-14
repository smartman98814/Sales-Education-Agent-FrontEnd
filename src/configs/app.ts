export const APP_NAME = 'SEAI';

export const MAX_TITLE_LEN = 24;

export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'zh'];

export const ApiUrls = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    isLoggedIn: '/api/auth/isLoggedIn',
    me: '/api/auth/me',
  },
  agents: {
    save: '/api/agents/save',
    agents: '/api/agents',
    agent: (agentId: string) => `/api/agents/${agentId}`,
    character: '/api/agents/character',
  },
} as const;
