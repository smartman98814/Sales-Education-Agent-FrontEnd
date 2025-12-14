const APP_ENV = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',

  SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nfa.xyz') as string,
  API_URL: (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.chatandbuild.com/') as string,
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '30000'),
  DISCORD_JOIN_URL: (process.env.NEXT_PUBLIC_NFA_DISCORD_JOIN_URL ??
    'http://discord.gg/chatandbuild') as string,
  JOIN_WAITLIST_FORM_URL: (process.env.NEXT_PUBLIC_JOIN_WAITLIST_FORM_URL ??
    'https://forms.gle/____') as string,
  INTERNAL_API_SECRET: (process.env.INTERNAL_API_SECRET ?? '') as string,

  GTAG: (process.env.NEXT_PUBLIC_GTAG ?? 'G-XYZ') as string,

  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE ?? ''),
  SESSION_UPDATE_AGE: parseInt(process.env.SESSION_UPDATE_AGE ?? ''),

  HEDRA_V2_AI_VIDEO_MODEL_ID: (process.env.NEXT_PUBLIC_HEDRA_V2_AI_VIDEO_MODEL_ID ?? '') as string,
  HEDEA_V2_AI_IMAGE_MODEL_ID: (process.env.NEXT_PUBLIC_HEDEA_V2_AI_IMAGE_MODEL_ID ?? '') as string,
  HEDRA_V1_API_KEY: (process.env.NEXT_PUBLIC_HEDRA_V1_API_KEY ?? '') as string,

  PROXY_SERVER_URL: (process.env.NEXT_PUBLIC_PROXY_SERVER_URL ?? '') as string,
  PROXY_SERVER_ACCESS_TOKEN: (process.env.NEXT_PUBLIC_PROXY_SERVER_ACCESS_TOKEN ?? '') as string,

  LETTA_API_SERVER_URL: (process.env.NEXT_PUBLIC_LETTA_API_SERVER_URL ?? '') as string,
  AGENT_ID: (process.env.NEXT_PUBLIC_AGENT_ID ?? '') as string,

  BACKEND_API_URL: (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? '') as string,

  PINATA_API_KEY: (process.env.NEXT_PUBLIC_PINATA_API_KEY ?? '') as string,
  PINATA_SECRET_API_KEY: (process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY ?? '') as string,

  NEXT_PUBLIC_STATSIG_CLIENT_KEY: (process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY ?? '') as string,
};

export { APP_ENV };
