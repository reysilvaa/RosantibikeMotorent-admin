"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bike,
  ReceiptText,
  FileText,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface BottomNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCenter?: boolean;
}

const BottomNavItem = ({ href, icon, label, isCenter = false }: BottomNavItemProps) => {
  const pathname = usePathname();
  const { isSmallMobile } = useIsMobile();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (isCenter) {
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center justify-center relative",
          "transition-colors duration-200",
          "-mt-6"
        )}
      >
        <div className={cn(
          "flex items-center justify-center rounded-full",
          "shadow-md border-4 border-white",
          isActive ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
          isSmallMobile ? "h-14 w-14" : "h-16 w-16"
        )}>
          {icon}
        </div>
        <span className={cn(
          "mt-1 text-center",
          isSmallMobile ? "text-[10px]" : "text-xs",
          isActive ? "text-blue-600" : "text-neutral-500"
        )}>
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center",
        "transition-colors duration-200",
        isActive ? "text-blue-600" : "text-neutral-500"
      )}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <span className={cn(
        "mt-1 text-center",
        isSmallMobile ? "text-[10px]" : "text-xs"
      )}>
        {label}
      </span>
    </Link>
  );
};

export function BottomNavigation() {
  const { isSmallMobile } = useIsMobile();
  const iconSize = isSmallMobile ? 18 : 20;
  const centerIconSize = isSmallMobile ? 24 : 28;

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
    { href: "/dashboard/unit-motor", icon: <Bike size={centerIconSize} />, label: "Unit Motor" },
    { href: "/dashboard/transaksi", icon: <ReceiptText size={iconSize} />, label: "Transaksi", isCenter: true },
    { href: "/dashboard/blog", icon: <FileText size={iconSize} />, label: "Blog" },
    { href: "/dashboard/more", icon: <Menu size={iconSize} />, label: "Lainnya" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200">
      <div className="grid grid-cols-5 h-16 pb-2">
        {navItems.map((item) => (
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