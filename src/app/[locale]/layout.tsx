import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { Geist_Mono, JetBrains_Mono, Nunito_Sans, Space_Grotesk, Tektur } from 'next/font/google';

import { LayoutWrapper, Providers } from '@/components/layout';
import { APP_ENV } from '@/configs';

import '../globals.css';
import '../tailwind.config.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const tektur = Tektur({
  variable: '--font-tektur',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${spaceGrotesk.className} ${spaceGrotesk.variable} ${tektur.variable} ${geistMono.variable} ${nunitoSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Providers>
          <GoogleAnalytics gaId={APP_ENV.GTAG} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
