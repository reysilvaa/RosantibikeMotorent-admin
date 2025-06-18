"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bike,
  FileText,
  Menu,
  Plus,
} from "lucide-react";

interface BottomNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMain?: boolean;
}

const BottomNavItem = ({ href, icon, label, isMain = false }: BottomNavItemProps) => {
  const pathname = usePathname();
  const isActive = href === "/dashboard" 
    ? pathname === "/dashboard" || pathname === "/dashboard/" 
    : pathname.startsWith(`${href}/`) || pathname === href;
  const [isPressed, setIsPressed] = useState(false);

  // Jika ini adalah tombol utama (main action button)
  if (isMain) {
    return (
      <Link
        href={href}
        className="flex flex-col items-center justify-center relative -mt-5"
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-200 shadow-md",
          isPressed ? "scale-95 bg-blue-700 shadow-inner" : isActive ? "ring-4 ring-blue-100" : "hover:bg-blue-500"
        )}>
          {icon}
        </div>
        <span className="text-xs mt-1 font-medium text-blue-600">
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-1 relative",
        isActive
          ? "text-blue-600"
          : "text-neutral-500"
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
        isActive 
          ? "bg-blue-100 scale-110 shadow-sm" 
          : isPressed
            ? "bg-blue-50 scale-95"
            : "bg-transparent hover:bg-blue-50 hover:scale-105"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-0.5 font-medium transition-all duration-200",
        isActive ? "opacity-100" : "opacity-80"
      )}>
        {label}
      </span>
    </Link>
  );
};

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-neutral-100 bg-white/95 backdrop-blur-md shadow-[0_-1px_10px_rgba(0,0,0,0.04)] md:hidden">
      {/* Notch background - white curve */}
      <div className="absolute -top-5 left-1/2 h-10 w-20 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-t-full border-t border-l border-r border-neutral-100"></div>
      
      {/* Main content */}
      <div className="flex h-16 w-full max-w-md mx-auto items-end justify-between px-2 relative">
        <div className="flex-1 flex justify-around">
          <BottomNavItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} strokeWidth={2} className="stroke-current" />}
            label="Dashboard"
          />
          <BottomNavItem
            href="/dashboard/unit-motor"
            icon={<Bike size={20} strokeWidth={2} className="stroke-current" />}
            label="Unit"
          />
        </div>
        
        {/* Center space for main action */}
        <div className="w-20 flex justify-center">
          <BottomNavItem
            href="/dashboard/transaksi"
            icon={<Plus size={24} strokeWidth={2.5} />}
            label="Booking"
            isMain={true}
          />
        </div>
        
        <div className="flex-1 flex justify-around">
          <BottomNavItem
            href="/dashboard/blog"
            icon={<FileText size={20} strokeWidth={2} className="stroke-current" />}
            label="Blog"
          />
          <BottomNavItem
            href="/dashboard/more"
            icon={<Menu size={20} strokeWidth={2} className="stroke-current" />}
            label="Lainnya"
          />
        </div>
      </div>
    </div>
  );
} 