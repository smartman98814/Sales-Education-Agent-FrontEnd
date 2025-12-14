import { Metadata } from 'next';

import { APP_ENV, APP_NAME } from '@/configs';

export const generateMetadataTag = ({
  title,
  description = 'Non-Fungible Agents. Discover the new BAP578 token standard.',
  pathname = '',
  images = [`${APP_ENV.SITE_URL}/images/metadata/opengraph.png`],
}: {
  title: string;
  description?: string;
  pathname?: string;
  images?: string[];
}): Metadata => {
  return {
    title,
    description,
    applicationName: APP_NAME,
    authors: { name: 'NFA', url: `${APP_ENV.SITE_URL}${pathname}` },
    keywords: [
      'NFA',
      'Non-Fungible Agents',
      'Smart Agent',
      'Digital Assistant',
      'AI Persona',
      'Personalized Agent',
      'Tokenized Persona',
      'Smart Token',
      'Virtual Assistant',
      'AI with Vibe',
      'Digital Identity',
      'Web3 Agent',
      'Personalized Tech',
      'Digital Innovation',
      'Blockchain Persona',
    ],
    creator: APP_NAME,
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      url: `${APP_ENV.SITE_URL}${pathname}`,
      title,
      description,
      siteName: APP_NAME,
      images: images.map((x) => ({ url: x })),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@site',
      creator: '@nfaxyz',
      images: images && images.length > 0 ? images : undefined,
    },
  };
};
