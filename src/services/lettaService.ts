// This uses the backend API endpoints for Letta functionality
import { APP_ENV } from '@/configs';
import { MemoryBlock } from '@/types';

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

// Helper function to handle API errors
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message || 'Unknown error'}`);
};

// Helper function to make backend API requests
const makeBackendRequest = async (endpoint: string, method: string = 'GET', body?: any) => {
  const url = `${BACKEND_API_URL}/api/letta${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Backend API request failed');
  }

  return result.data;
};

// Retrieve Agent Context Window using backend API
export const getContextWindow = async () => {
  try {
    const data = await makeBackendRequest('/context');
    return data;
  } catch (error) {
    console.error('Error fetching context window', error);
    throw error;
    // return {
    //   contextWindowSizeCurrent: 1000,
    //   contextWindowSizeMax: 10000,
    // };
  }
};

// Get agent information using backend API
export const getAgentInfo = async () => {
  try {
    return await makeBackendRequest('/agent');
  } catch (error) {
    console.error('Error fetching agent info:', error);
    throw error;
  }
};

// Retrieve agent messages using backend API
export const getMessages = async (limit: number = 10, before?: string) => {
  try {
    let endpoint = `/messages?limit=${limit}`;
    if (before) {
      endpoint += `&before=${before}`;
    }

    const data = await makeBackendRequest(endpoint);
    // The backend already filters messages, so we can return them directly
    return data;
  } catch (error) {
    console.error('Error fetching agent messages:', error);
    // Return empty array if there's an error
    return [];
  }
};

// Post a new message using backend API
export const sendMessage = async (content: string) => {
  try {
    const body = { content };
    const data = await makeBackendRequest('/messages', 'POST', body);
    // The backend already filters messages, so we can return them directly
    return data;
  } catch (error) {
    return handleApiError(error, 'Error creating message');
  }
};

// List llm models using backend API
export const listLlmModels = async () => {
  try {
    const data = await makeBackendRequest('/models');
    return data || [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};

// Update agent using backend API
export const updateAgent = async (settings: unknown) => {
  try {
    const data = await makeBackendRequest('/agent', 'PATCH', settings);
    return data || [];
  } catch (error) {
    console.error('Error updating agent:', error);
    return [];
  }
};

// Update memory block using backend API
export const updateBlock = async (block: MemoryBlock) => {
  try {
    const data = await makeBackendRequest(`/memory/blocks/${block.label}`, 'PATCH', block);
    return data || [];
  } catch (error) {
    console.error('Error updating memory block:', error);
    return [];
  }
};
