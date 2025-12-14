// import { makeProxyRequest } from "./proxyService";
import axios from 'axios';

import { APP_ENV } from '@/configs';

const HEDRA_V2_AI_VIDEO_MODEL_ID = APP_ENV.HEDRA_V2_AI_VIDEO_MODEL_ID;
const HEDRA_V2_AI_VIDEO_IMAGE_ID = APP_ENV.HEDEA_V2_AI_IMAGE_MODEL_ID;

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

// Create hedra asset V2
export const createAsset = async (type: string, name: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/assets`;
    const { data } = await axios.post(url, {
      name,
      type,
    });
    return data.data;
  } catch (error) {
    console.error('Error creating asset file:', error);
  }
};

// Upload asset V2
export const uploadAsset = async (id: string, name: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/assets/upload`;
    const { data } = await axios.post(url, {
      name,
      id,
    });
    return data.data;
  } catch (error) {
    console.error('Error uploading asset file:', error);
  }
};

// Get asset details by ID
export const getAsset = async (id: string, type: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/assets/${id}/${type}`;
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    console.error('Error getting asset:', error);
  }
};

// Upload file
export const uploadFile = async (file: File, type: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/upload/file`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const { data } = await axios.post(url, formData);
    return data;
  } catch (error) {
    console.error('Error creating portrait:', error);
  }
};

// Create a video
export const generateVideo = async (start_keyframe_id: string, audio_id: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/generate`;
    const body = {
      type: 'video',
      ai_model_id: HEDRA_V2_AI_VIDEO_MODEL_ID,
      start_keyframe_id,
      audio_id,
      generated_video_inputs: {
        text_prompt: '',
        resolution: '540p',
        aspect_ratio: '9:16',
      },
    };

    const { data } = await axios.post(url, body);
    return data.data;
  } catch (error) {
    console.error('Error generating video:', error);
  }
};

// Create an image
export const generateImage = async (text_prompt: string, start_keyframe_id?: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/hedra/generate`;
    const body = {
      type: 'image',
      ai_model_id: HEDRA_V2_AI_VIDEO_IMAGE_ID,
      text_prompt,
      aspect_ratio: '1:1',
      resolution: '540p',
      start_keyframe_id,
    };

    const { data } = await axios.post(url, body);
    return data.data;
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

// poll generation status
export const pollGenerationStatus = async (id: string) => {
  while (true) {
    try {
      const url = `${BACKEND_API_URL}/api/hedra/generate/${id}`;
      const { data } = await axios.get(url);
      if (data.data.status === 'complete') {
        return data.data;
      } else if (data.data.status === 'error') {
        throw new Error('character generation failed');
      }

      // Wait 5 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error('Error polling character status:', error);
      throw error;
    }
  }
};
