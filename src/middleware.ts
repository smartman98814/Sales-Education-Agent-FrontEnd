import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { SUPPORTED_LOCALES } from './configs/app';
import { routing } from './i18n';

const nextIntlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const locale = SUPPORTED_LOCALES.find((loc) => pathname.startsWith(`/${loc}`));

  const realPathname = locale ? pathname.replace(`/${locale}`, '') : pathname;
  const realUrl = locale ? request.url.replace(`/${locale}`, '') : request.url;

  const response = nextIntlMiddleware(request);

  response.headers.set('url', realUrl);
  response.headers.set('urlWithLocale', request.url);
  response.headers.set('pathname', pathname === '/' ? '' : realPathname);
  response.headers.set('pathnameWithLocale', pathname === '/' ? '' : pathname);

  // Add authentication context headers for client-side use
  // Since we're using dialog-based auth, we don't redirect here
  // The client-side components will handle showing the signin dialog

  return response;
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
};
