'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAuthStore } from '@/lib/store/auth/auth-store';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { isMobile, isSmallMobile } = useIsMobile();

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined') {
      const isLoggedIn = checkAuth();
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [router, checkAuth]);

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} />

      {}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'md:ml-60' : 'md:ml-16'
        )}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={cn(
            'w-full flex-1 overflow-hidden',
            isSmallMobile ? 'px-2 pt-2 pb-16' : 'px-3 pt-3 pb-16',
            'md:p-5 md:pb-6'
          )}
        >
          <div className="h-full w-full">{children}</div>
        </main>

        {isMobile && (
          <div className="fixed right-0 bottom-0 left-0 z-40 bg-white">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
