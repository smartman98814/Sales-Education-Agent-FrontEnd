import axios from 'axios';

import { APP_ENV } from '@/configs';

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

// Get available elevenlabs voices
export const getAvailableVoices = async () => {
  try {
    const url = `${BACKEND_API_URL}/api/elevenlabs/voices`;
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    console.error('Error fetching voices:', error);
  }
};

// Create elevenlabs audio file
export const createAudioFile = async (voiceId: string, text: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/elevenlabs/tts`;
    const { data } = await axios.post(url, { voiceId, text });
    return data;
  } catch (error) {
    console.error('Error creating autio file:', error);
  }
};
