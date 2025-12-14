import { Metadata } from 'next';
import { headers } from 'next/headers';

import { Simulator } from '@/components/agent';
import { APP_NAME } from '@/configs';
import { generateMetadataTag } from '@/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const pathname = (await headers()).get('pathname') ?? '';

  return generateMetadataTag({
    title: `Chat with your Agent - Chat with your agent in real time — test, teach, and connect. | ${APP_NAME}`,
    pathname,
  });
}

export default async function SimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ agentId?: string }>;
}) {
  const params = await searchParams;
  return <Simulator agentId={params.agentId} />;
}
