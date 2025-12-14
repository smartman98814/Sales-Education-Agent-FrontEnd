'use client';

import { useEffect } from 'react';

import { useCbAgents } from '@/context';
import { usePathname, useRouter } from '@/i18n/navigation';

import { AuthModal } from '@/components/auth';
import { useAuth } from '@/context';

import { Footer } from './Footer';
import { Header } from './Header';
import { MainLayout } from './MainLayout';
import { Sidebar } from './Sidebar';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { completedIntro, isLoaded } = useCbAgents();
  const { showSignInDialog, closeSignInDialog, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to intro page if first time visit
  useEffect(() => {
    if (isLoaded && !completedIntro && pathname !== '/intro') {
      router.push('/intro');
    }
  }, [isLoaded, completedIntro, pathname, router]);

  // Don't render anything until we've loaded from localStorage
  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-black-light" />
      </MainLayout>
    );
  }

  // If on intro page, render without main layout
  if (pathname === '/intro') {
    return <>{children}</>;
  }

  return (
    <>
      {completedIntro && <Header />}
      {completedIntro && <Sidebar />}
      <MainLayout>{children}</MainLayout>
      {completedIntro && <Footer />}
      <AuthModal
        isOpen={showSignInDialog}
        onClose={closeSignInDialog}
        onSuccess={refreshUser}
      />
    </>
  );
};
