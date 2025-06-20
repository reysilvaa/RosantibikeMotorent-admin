'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bike,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShoppingCart,
  Tags,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getAdminData } from '@/lib/cookies';
import { useAuthStore } from '@/lib/store/auth/auth-store';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
}

const SidebarNavItem = ({ href, icon, title, isOpen }: SidebarNavItemProps) => {
  const pathname = usePathname();
  const { isMobile, isSmallMobile } = useIsMobile();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Link
              href={href}
              className={cn(
                'mx-auto flex items-center justify-center gap-3 rounded-lg transition-all duration-300 ease-in-out',
                isSmallMobile ? 'h-9 w-9' : 'h-11 w-11',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700'
              )}
            >
              <div className="mx-auto text-base">{icon}</div>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="border border-neutral-200 bg-white text-neutral-800"
          >
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg transition-all duration-300 ease-in-out',
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700',
        isSmallMobile
          ? 'mx-1 px-2 py-1.5'
          : isMobile
            ? 'mx-1.5 px-3 py-2'
            : 'mx-2 px-4 py-2.5'
      )}
    >
      <div className="text-base">{icon}</div>
      <span className="flex-1 text-sm font-medium">{title}</span>
      {isActive && <ChevronRight size={16} className="ml-auto text-white" />}
    </Link>
  );
};

export function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const admin = getAdminData();
  const { logout } = useAuthStore();
  const { isSmallMobile } = useIsMobile();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const iconSize = isSmallMobile ? 18 : 20;

  const navItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={iconSize} />,
      title: 'Dashboard',
    },
    {
      href: '/dashboard/transaksi',
      icon: <ShoppingCart size={iconSize} />,
      title: 'Transaksi',
    },
    {
      href: '/dashboard/jenis-motor',
      icon: <Tags size={iconSize} />,
      title: 'Jenis Motor',
    },
    {
      href: '/dashboard/unit-motor',
      icon: <Bike size={iconSize} />,
      title: 'Unit Motor',
    },
    {
      href: '/dashboard/blog',
      icon: <FileText size={iconSize} />,
      title: 'Blog',
    },
    {
      href: '/dashboard/whatsapp',
      icon: <MessageSquare size={iconSize} />,
      title: 'WhatsApp',
    },
    {
      href: '/dashboard/admin',
      icon: <Users size={iconSize} />,
      title: 'Admin',
    },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out',
        isOpen
          ? 'w-60 translate-x-0 opacity-100'
          : 'w-16 -translate-x-full translate-x-0 opacity-0 md:translate-x-0 md:opacity-100'
      )}
    >
      <div className="flex h-14 items-center justify-center border-b border-neutral-200">
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-blue-600 text-white',
            isSmallMobile ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
          )}
        >
          <LayoutDashboard size={isSmallMobile ? 18 : 20} />
        </div>
        {isOpen && (
          <span
            className={cn(
              'ml-2 font-bold text-neutral-900',
              isSmallMobile ? 'text-xs' : 'text-sm md:text-base'
            )}
          >
            Rosantibike
          </span>
        )}
      </div>

      <div className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-auto py-2 md:py-3">
        {navItems.map(item => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isOpen={isOpen}
          />
        ))}
      </div>

      <div className="border-t border-neutral-200 p-2 md:p-3">
        <div
          className={cn(
            'mb-2 flex items-center transition-all duration-300 ease-in-out',
            isOpen ? 'gap-2' : 'justify-center'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out',
              isSmallMobile ? 'h-7 w-7' : 'h-8 w-8 md:h-9 md:w-9'
            )}
          >
            {admin?.nama?.charAt(0) || 'A'}
          </div>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span
                className={cn(
                  'truncate font-semibold text-neutral-900',
                  isSmallMobile ? 'text-xs' : 'text-sm'
                )}
              >
                {admin?.nama || 'Admin'}
              </span>
              <span className="truncate text-xs text-neutral-500">
                {admin?.username || 'admin'}
              </span>
            </div>
          )}
        </div>
        {!isOpen ? (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <div
                  className={cn(
                    'flex cursor-pointer items-center justify-center rounded-lg p-2 text-neutral-600 transition-all duration-300 ease-in-out hover:bg-red-50 hover:text-red-600',
                    'mx-auto'
                  )}
                  onClick={handleLogout}
                >
                  <LogOut size={isSmallMobile ? 18 : 20} />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="border border-neutral-200 bg-white text-neutral-800"
              >
                Keluar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="flex w-full items-center gap-2 rounded-lg text-left text-neutral-600 transition-all duration-300 ease-in-out hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut size={isSmallMobile ? 18 : 20} />
            <span
              className={cn(
                'font-medium',
                isSmallMobile ? 'text-xs' : 'text-sm'
              )}
            >
              Keluar
            </span>
          </Button>
        )}
      </div>
    </aside>
  );
}
