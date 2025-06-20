'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  Home,
  Menu,
  MoreHorizontal,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getAdminData } from '@/lib/cookies';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface BreadcrumbItem {
  title: string;
  path: string;
}

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const admin = getAdminData();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const { isMobile, isSmallMobile } = useIsMobile();

  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/dashboard/transaksi')) {
      if (path.includes('/tambah')) return 'Tambah Transaksi';
      if (path.match(/\/dashboard\/transaksi\/[a-zA-Z0-9-]+$/))
        return 'Detail Transaksi';
      return 'Transaksi';
    }
    if (path.includes('/dashboard/jenis-motor')) {
      if (path.includes('/tambah')) return 'Tambah Jenis Motor';
      if (path.match(/\/dashboard\/jenis-motor\/[a-zA-Z0-9-]+$/))
        return 'Detail Jenis Motor';
      return 'Jenis Motor';
    }
    if (path.includes('/dashboard/unit-motor')) {
      if (path.includes('/tambah')) return 'Tambah Unit Motor';
      if (path.match(/\/dashboard\/unit-motor\/[a-zA-Z0-9-]+$/))
        return 'Detail Unit Motor';
      return 'Unit Motor';
    }
    if (path.includes('/dashboard/blog')) {
      if (path.includes('/tambah')) return 'Tambah Blog';
      if (path.includes('/edit')) return 'Edit Blog';
      if (path.match(/\/dashboard\/blog\/[a-zA-Z0-9-]+$/)) return 'Detail Blog';
      return 'Blog';
    }
    if (path.includes('/dashboard/whatsapp')) return 'WhatsApp';
    if (path.includes('/dashboard/admin')) {
      if (path.includes('/tambah')) return 'Tambah Admin';
      if (path.includes('/edit')) return 'Edit Admin';
      return 'Admin';
    }
    if (path.includes('/dashboard/more')) return 'Menu Lainnya';
    return 'Dashboard';
  };

  const generateBreadcrumbs = (path: string) => {
    const items: BreadcrumbItem[] = [
      { title: 'Dashboard', path: '/dashboard' },
    ];

    if (path === '/dashboard') {
      return items;
    }

    const segments = path.split('/').filter(Boolean);

    let currentPath = '';

    segments.forEach((segment, index) => {
      if (segment === 'dashboard' && index === 0) {
        currentPath = `/${segment}`;
        return;
      }

      currentPath = `${currentPath}/${segment}`;

      if (
        index === segments.length - 1 &&
        !['tambah', 'edit'].includes(segment)
      ) {
        const isId = /^[a-zA-Z0-9-]+$/.test(segment);

        if (isId && index > 1) {
          items.push({
            title: getPageTitle(currentPath),
            path: currentPath,
          });
          return;
        }
      }

      if (segment !== 'edit' && segment !== 'tambah') {
        items.push({
          title:
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, ' '),
          path: currentPath,
        });
      } else {
        items.push({
          title: segment === 'edit' ? 'Edit' : 'Tambah',
          path: currentPath,
        });
      }
    });

    if (items.length > 0) {
      items[items.length - 1].title = getPageTitle(path);
    }

    return items;
  };

  const getMobileBreadcrumbs = (items: BreadcrumbItem[]) => {
    if (items.length <= 2) {
      return items;
    }

    if (isSmallMobile) {
      return [items[items.length - 1]];
    }

    return [items[0], { title: '...', path: '' }, items[items.length - 1]];
  };

  useEffect(() => {
    if (pathname) {
      const newBreadcrumbs = generateBreadcrumbs(pathname);
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [pathname]);

  const displayedBreadcrumbs = isMobile
    ? getMobileBreadcrumbs(breadcrumbs)
    : breadcrumbs;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center border-b border-neutral-200 bg-white',
        isSmallMobile ? 'px-2' : 'px-3 md:px-4'
      )}
    >
      <div className="flex w-full items-center justify-between">
        {}
        <div
          className={cn(
            'flex items-center gap-1 overflow-hidden md:gap-2',
            isSmallMobile
              ? 'max-w-[calc(100%-80px)]'
              : 'max-w-[calc(100%-100px)] sm:max-w-[calc(100%-150px)] md:max-w-[calc(100%-250px)]'
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex flex-shrink-0 items-center justify-center p-0 text-neutral-600 transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-neutral-900 md:hidden',
              isSmallMobile ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
            )}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <X size={isSmallMobile ? 18 : 20} />
            ) : (
              <Menu size={isSmallMobile ? 18 : 20} />
            )}
          </Button>

          <div className="hide-scrollbar flex items-center overflow-x-auto">
            <nav
              className={cn(
                'flex items-center space-x-1',
                isSmallMobile ? 'text-[10px]' : 'text-xs md:text-sm'
              )}
            >
              {displayedBreadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight
                      size={isSmallMobile ? 14 : 16}
                      className="mx-0.5 flex-shrink-0 text-neutral-400 md:mx-1"
                    />
                  )}
                  {item.path ? (
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center rounded whitespace-nowrap transition-colors',
                        isSmallMobile
                          ? 'px-1 py-0.5'
                          : 'px-1.5 py-0.5 md:px-2 md:py-1',
                        index === displayedBreadcrumbs.length - 1
                          ? 'bg-neutral-100 font-semibold text-neutral-900'
                          : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
                        index === 0 ? 'flex-shrink-0' : 'flex-shrink'
                      )}
                    >
                      {index === 0 && !isSmallMobile && (
                        <Home size={14} className="mr-1 md:mr-1.5" />
                      )}
                      <span
                        className={cn(
                          index === displayedBreadcrumbs.length - 1
                            ? ''
                            : 'truncate',
                          isSmallMobile
                            ? 'max-w-[60px]'
                            : 'max-w-[80px] md:max-w-[150px]'
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <span className="flex flex-shrink-0 items-center px-0.5 md:px-1">
                      <MoreHorizontal
                        size={isSmallMobile ? 14 : 16}
                        className="text-neutral-400"
                      />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {}
        <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
          <div className="relative hidden md:flex">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-3 pl-9 text-sm text-neutral-900 transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
              placeholder="Cari..."
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative flex-shrink-0 text-neutral-600 transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-neutral-900',
              isSmallMobile ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
            )}
          >
            <Bell size={isSmallMobile ? 18 : 20} />
            <span className="absolute top-1 right-1 flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500 md:h-2 md:w-2"></span>
            </span>
          </Button>

          <div className="flex flex-shrink-0 items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out',
                isSmallMobile ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
              )}
            >
              {admin?.nama?.charAt(0) || 'A'}
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-medium text-neutral-900">
                {admin?.nama || 'Admin'}
              </span>
              <span className="text-xs text-neutral-500">
                {admin?.username || 'admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
