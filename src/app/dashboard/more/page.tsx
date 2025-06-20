'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, MessageSquare, Tags, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAuthStore } from '@/lib/store/auth/auth-store';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const MenuItem = ({ href, icon, title, onClick }: MenuItemProps) => {
  const { isSmallMobile } = useIsMobile();

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-4',
        'transition-all duration-200 hover:bg-blue-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center rounded-lg bg-blue-100 text-blue-600',
            isSmallMobile ? 'p-2' : 'p-2.5'
          )}
        >
          {icon}
        </div>
        <span className="font-medium text-neutral-800">{title}</span>
      </div>
      <ChevronRight
        className="text-neutral-400"
        size={isSmallMobile ? 18 : 20}
      />
    </Link>
  );
};

export default function MorePage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { isSmallMobile } = useIsMobile();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const iconSize = isSmallMobile ? 18 : 20;

  const menuItems = [
    {
      href: '/dashboard/jenis-motor',
      icon: <Tags size={iconSize} />,
      title: 'Jenis Motor',
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
    <DashboardLayout>
      <div className="space-y-4">
        <div className="space-y-3">
          {menuItems.map(item => (
            <MenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-red-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 text-red-700">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-red-700">Keluar</span>
            </div>
            <ChevronRight className="text-red-400" size={20} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
