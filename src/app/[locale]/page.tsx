import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CreateAgent } from '@/components/agent';
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

  const pathname = await getPathname({ href: { pathname: '/' }, locale });

  return generateMetadataTag({
    title: `Sales Education AI Agent | ${APP_NAME}`,
    description: t('landing.description'),
    pathname,
  });
}

export default function RootPage() {
  return <CreateAgent />;
}
