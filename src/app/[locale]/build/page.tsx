import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CharacterGenerator } from '@/components/agent';
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

  const pathname = await getPathname({ href: { pathname: '/build' }, locale });

  return generateMetadataTag({
    title: `Build Your Agent - Design your real-time agent's look, voice, and personality | ${APP_NAME}`,
    description: t('landing.description'),
    pathname,
  });
}

export default async function BuildPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ agentId?: string; mode?: string; avatar?: string; prompt?: string }>;
}) {
  const { agentId, mode, avatar, prompt } = await searchParams;

  // If mode is 'prompt', pass avatar and prompt to CharacterGenerator (no agentId)
  if (mode === 'prompt') {
    return <CharacterGenerator avatar={avatar} initialPrompt={prompt} />;
  }

  // Default behavior (mode='advanced' or no mode)
  return <CharacterGenerator agentId={agentId} />;
}
