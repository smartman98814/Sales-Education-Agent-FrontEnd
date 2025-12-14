import axios from 'axios';

import { APP_ENV } from '@/configs';

const BACKEND_API_URL = APP_ENV.BACKEND_API_URL;

/**
 * Upload knowledge files to the backend
 * @param files - Array of files to upload (PDF, DOC, DOCX, TXT)
 * @param uid - User ID
 * @returns Response data from the backend
 */
export const uploadKnowledgeFiles = async (files: File[], uid: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/knowledge/upload`;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('uid', uid);

    const { data } = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (error) {
    console.error('Error uploading knowledge files:', error);
    throw error;
  }
};

/**
 * Scrape content from URLs
 * @param urls - Array of URLs to scrape
 * @param uid - User ID
 * @returns Response data from the backend
 */
export const scrapeUrls = async (urls: string[], uid: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/knowledge/scrape-url`;

    const { data } = await axios.post(
      url,
      { urls, uid },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  } catch (error) {
    console.error('Error scraping URLs:', error);
    throw error;
  }
};

/**
 * Scrape content from knowledge base URLs
 * @param uid - User ID
 * @returns Response data from the backend
 */
export const scrape = async (uid: string, uploadedCharacterUrl: string) => {
  try {
    const url = `${BACKEND_API_URL}/api/knowledge/scrape`;

    const { data } = await axios.post(
      url,
      { uid, url: uploadedCharacterUrl },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  } catch (error) {
    console.error('Error scraping URLs:', error);
    throw error;
  }
};
