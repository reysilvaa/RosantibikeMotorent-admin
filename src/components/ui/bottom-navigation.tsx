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
          "-mt-4"
        )}
      >
        <div className={cn(
          "flex items-center justify-center rounded-full",
          "shadow-md border-2 border-white",
          isActive ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
          "h-10 w-10"
        )}>
          {icon}
        </div>
        <span className={cn(
          "mt-0.5 text-center text-[10px]",
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
      <span className="mt-0.5 text-center text-[10px]">
        {label}
      </span>
    </Link>
  );
};

export function BottomNavigation() {
  const iconSize = 18;
  const centerIconSize = 20;

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={iconSize} />, label: "Dashboard" },
    { href: "/dashboard/unit-motor", icon: <Bike size={iconSize} />, label: "Unit Motor" },
    { href: "/dashboard/transaksi", icon: <ReceiptText size={centerIconSize} />, label: "Transaksi", isCenter: true },
    { href: "/dashboard/blog", icon: <FileText size={iconSize} />, label: "Blog" },
    { href: "/dashboard/more", icon: <Menu size={iconSize} />, label: "Lainnya" },
  ];

  return (
    <div className="w-full bg-white border-t border-neutral-200 shadow-md">
      <div className="grid grid-cols-5 h-14">
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