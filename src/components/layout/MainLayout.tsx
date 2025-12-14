'use client';

import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { useCbAgents } from '@/context';
import { usePathname, useRouter } from '@/i18n/navigation';

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { completedIntro, isLoaded } = useCbAgents();

  // Redirect to intro if not completed and not already on intro page
  useEffect(() => {
    if (isLoaded && !completedIntro && pathname !== '/intro') {
      router.push('/intro');
    }
  }, [isLoaded, completedIntro, pathname, router]);

  return (
    <main
      className={twMerge(
        'relative',
        // Add left margin for sidebar when intro is completed (only on desktop)
        completedIntro && 'md:ml-16',
        pathname === '/simulator'
          ? completedIntro
            ? 'h-[calc(100dvh-64px)] bg-black-light'
            : 'h-screen bg-black-light'
          : /^\/(dashboard|intro)$/.test(pathname) || pathname === '/'
            ? 'min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black-light'
            : pathname === '/avatar'
              ? 'min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black-light'
              : 'min-h-screen bg-black pt-[94px] mt-[-94px] md:pt-[78px] md:mt-[-78px]',
      )}
    >
      {children}
    </main>
  );
};
