import axios from 'axios';

import { APP_ENV } from '@/configs';

const PINATA_API_KEY = APP_ENV.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = APP_ENV.PINATA_SECRET_API_KEY;
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

export const uploadToPinata = async (file: File | Blob, filename?: string): Promise<string> => {
  if (!PINATA_API_KEY) {
    throw new Error('Pinata API credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file, filename);

  const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
    maxBodyLength: Infinity,
  });

  if (response?.data?.IpfsHash) return PINATA_GATEWAY + `/${response.data.IpfsHash}`;
  throw new Error('Failed to upload file to IPFS');
};
