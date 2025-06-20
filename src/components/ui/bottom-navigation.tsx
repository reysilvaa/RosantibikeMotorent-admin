'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bike,
  FileText,
  LayoutDashboard,
  Menu,
  ReceiptText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCenter?: boolean;
}

const BottomNavItem = ({
  href,
  icon,
  label,
  isCenter = false,
}: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (isCenter) {
    return (
      <Link
        href={href}
        className={cn(
          'relative flex flex-col items-center justify-center',
          'transition-colors duration-200',
          '-mt-4'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            'border-2 border-white shadow-md',
            isActive ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
            'h-10 w-10'
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            'mt-0.5 text-center text-[10px]',
            isActive ? 'text-blue-600' : 'text-neutral-500'
          )}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center',
        'transition-colors duration-200',
        isActive ? 'text-blue-600' : 'text-neutral-500'
      )}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="mt-0.5 text-center text-[10px]">{label}</span>
    </Link>
  );
};

export function BottomNavigation() {
  const iconSize = 18;
  const centerIconSize = 20;

  const navItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard size={iconSize} />,
      label: 'Dashboard',
    },
    {
      href: '/dashboard/unit-motor',
      icon: <Bike size={iconSize} />,
      label: 'Unit Motor',
    },
    {
      href: '/dashboard/transaksi',
      icon: <ReceiptText size={centerIconSize} />,
      label: 'Transaksi',
      isCenter: true,
    },
    {
      href: '/dashboard/blog',
      icon: <FileText size={iconSize} />,
      label: 'Blog',
    },
    {
      href: '/dashboard/more',
      icon: <Menu size={iconSize} />,
      label: 'Lainnya',
    },
  ];

  return (
    <div className="w-full border-t border-neutral-200 bg-white shadow-md">
      <div className="grid h-14 grid-cols-5">
        {navItems.map(item => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCenter={item.isCenter}
          />
        ))}
      </div>
    </div>
  );
}
