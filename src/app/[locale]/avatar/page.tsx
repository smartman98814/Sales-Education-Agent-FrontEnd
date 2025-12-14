import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AvatarGenerator } from '@/components/agent';
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

  const pathname = await getPathname({ href: { pathname: '/avatar' }, locale });

  return generateMetadataTag({
    title: `Generate Avatar - Create your AI agent avatar | ${APP_NAME}`,
    description: t('landing.description'),
    pathname,
  });
}

export default async function AvatarPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    prompt?: string; 
    assetId?: string; 
    agentId?: string;
    avatarId?: string;
    avatarUrl?: string;
  }>;
}) {
  const params = await searchParams;
  const prompt = params.prompt || '';
  const assetId = params.assetId;
  const agentId = params.agentId;
  const avatarId = params.avatarId;
  const avatarUrl = params.avatarUrl;

  return (
    <AvatarGenerator 
      prompt={prompt} 
      assetId={assetId} 
      agentId={agentId}
      avatarId={avatarId}
      avatarUrl={avatarUrl}
    />
  );
}
