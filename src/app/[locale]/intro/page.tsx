import { Metadata } from 'next';
import { headers } from 'next/headers';

import { Intro } from '@/components/agent';
import { APP_NAME } from '@/configs';
import { generateMetadataTag } from '@/utils';

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get('pathname') ?? '';

  return generateMetadataTag({
    title: `ChatAndBuild Agents introduction | ${APP_NAME}`,
    pathname,
  });
}

export default function CBIntroPage() {
  return <Intro />;
}
