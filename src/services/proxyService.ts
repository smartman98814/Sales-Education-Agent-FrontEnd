import axios from 'axios';

import { APP_ENV } from '@/configs';

const PROXY_SERVER_URL = 'https://proxy.chatandbuild.com/proxy';
const PROXY_ACCESS_TOKEN =
  APP_ENV.PROXY_SERVER_ACCESS_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXRhbmRidWlsZCIsImlhdCI6MTc0NDI1MjY2NH0.V_KQsztTe_7TeEGREF3ERuTEPvOxFjlvov80kb8uNK4';

// Helper function to make proxy requests
export const makeProxyRequest = async (url: string, method: string, headers?: any, body?: any) => {
  try {
    const proxyRequestBody = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers here
        ...headers,
      },
      body: body ?? '{}',
    };

    const data = await axios.post(PROXY_SERVER_URL, proxyRequestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PROXY_ACCESS_TOKEN}`,
      },
    });

    return await data;
  } catch (error) {
    throw error;
  }
};
