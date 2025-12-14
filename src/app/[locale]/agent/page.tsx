import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { EditAgent } from '@/components/agent';
import { APP_NAME } from '@/configs';
import { getPathname } from '@/i18n/navigation';
import { generateMetadataTag } from '@/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const pathname = await getPathname({ href: { pathname: '/agent' }, locale });

  return generateMetadataTag({
    title: `Edit Agent - Configure your AI agent | ${APP_NAME}`,
    description: t('landing.description'),
    pathname,
  });
}

export default async function AgentPage({
  searchParams,
}: {
  searchParams: Promise<{ agentId?: string; avatar?: string; prompt?: string }>;
}) {
  const params = await searchParams;
  const agentId = params.agentId;
  const avatar = params.avatar;
  const initialPrompt = params.prompt;

  return <EditAgent agentId={agentId} avatar={avatar} initialPrompt={initialPrompt} />;
}
