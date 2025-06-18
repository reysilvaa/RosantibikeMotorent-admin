"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bike,
  ShoppingCart,
  FileText,
  Menu,
} from "lucide-react";

interface BottomNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const BottomNavItem = ({ href, icon, label }: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2",
        isActive
          ? "text-blue-700"
          : "text-neutral-600 hover:text-blue-600"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full",
        isActive ? "bg-blue-100" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full border-t border-neutral-200 bg-white shadow-lg md:hidden">
      <BottomNavItem
        href="/dashboard"
        icon={<LayoutDashboard size={20} />}
        label="Dashboard"
      />
      <BottomNavItem
        href="/dashboard/transaksi"
        icon={<ShoppingCart size={20} />}
        label="Transaksi"
      />
      <BottomNavItem
        href="/dashboard/unit-motor"
        icon={<Bike size={20} />}
        label="Unit"
      />
      <BottomNavItem
        href="/dashboard/blog"
        icon={<FileText size={20} />}
        label="Blog"
      />
      <BottomNavItem
        href="/dashboard/more"
        icon={<Menu size={20} />}
        label="Lainnya"
      />
    </div>
  );
} 