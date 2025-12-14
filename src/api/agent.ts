import axios from 'axios';

import { APP_ENV, ApiUrls } from '@/configs';

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

export interface Agent {
  id: string;
  characterUrl: string;
  agentNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveAgentRequest {
  id: string;
  characterUrl: string;
}

export interface UpdateCharacterUrlRequest {
  id: string;
  characterUrl: string;
}

/**
 * Save a new agent with walletAddress and characterUrl
 */
export async function saveAgent(request: SaveAgentRequest): Promise<Agent> {
  try {
    const url = BACKEND_API_URL + ApiUrls.agents.save;

    const { data } = await axios.post(url, request, {
      withCredentials: true,
    });

    return data.data;
  } catch (error) {
    console.error('Error saving agent:', error);
    throw error;
  }
}

/**
 * Get all agents for the authenticated user's wallet address
 * Returns array of agents (for now, only one agent per user's wallet address)
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const url = BACKEND_API_URL + ApiUrls.agents.agents;

    const { data } = await axios.get(url, {
      withCredentials: true,
    });

    return data.data.agents || [];
  } catch (error) {
    console.error('Error getting agents:', error);
    throw error;
  }
}

/**
 * Get a specific agent by agentId
 */
export async function getAgentById(id: string): Promise<Agent> {
  try {
    const url = BACKEND_API_URL + ApiUrls.agents.agent(id);

    const { data } = await axios.get(url, {
      withCredentials: true,
    });

    return data.data;
  } catch (error) {
    console.error('Error getting agent by ID:', error);
    throw error;
  }
}

/**
 * Update character URL for an agent by agentId
 */
export async function updateCharacterUrl(request: UpdateCharacterUrlRequest): Promise<Agent> {
  try {
    const url = BACKEND_API_URL + ApiUrls.agents.character;

    const { data } = await axios.patch(url, request, {
      withCredentials: true,
    });

    return data.data;
  } catch (error) {
    console.error('Error updating character URL:', error);
    throw error;
  }
}
