"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bike,
  Menu,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface BottomNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMain?: boolean;
}

const BottomNavItem = ({ href, icon, label, isMain = false }: BottomNavItemProps) => {
  const pathname = usePathname();
  const { isSmallMobile } = useIsMobile();
  const isActive = href === "/dashboard" 
    ? pathname === "/dashboard" || pathname === "/dashboard/" 
    : pathname.startsWith(`${href}/`) || pathname === href;
  const [isPressed, setIsPressed] = useState(false);

  // Sesuaikan label untuk tampilan mobile
  const displayLabel = isSmallMobile ? 
    (label === "Dashboard" ? "Home" : 
     label === "Transaksi" ? "Trx" : label) : label;

  if (isMain) {
    return (
      <Link
        href={href}
        className="flex flex-col items-center justify-center relative -mt-3.5 sm:-mt-5 z-10 group"
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <div className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white transition-all duration-200",
          isSmallMobile ? "h-8 w-8" : "h-11 w-11 sm:h-14 sm:w-14",
          isPressed 
            ? "scale-95 shadow-inner from-blue-600 to-blue-800" 
            : isActive 
              ? "ring-2 ring-blue-100/80 shadow-lg shadow-blue-500/20" 
              : "shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 group-hover:from-blue-400 group-hover:to-blue-600"
        )}>
          <Plus 
            size={isSmallMobile ? 16 : 18} 
            strokeWidth={isSmallMobile ? 3 : 2.5} 
            className={isSmallMobile ? "translate-y-[1px]" : ""}
          />
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 top-0 w-full rounded-full bg-blue-400/10 blur-xl scale-110 opacity-0 group-hover:opacity-80 transition-opacity duration-700"></div>
        
        {!isSmallMobile && (
          <span className={cn(
            "font-medium text-blue-600 transition-all duration-300 whitespace-nowrap", 
            "text-[9px] sm:text-xs mt-0.5 sm:mt-1",
            isPressed ? "scale-95" : "scale-100"
          )}>
            {label}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-1 relative group",
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
        "flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
        isSmallMobile ? "h-6 w-6" : "h-7 w-7 sm:h-10 sm:w-10",
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-blue-100 scale-110 shadow-sm" 
          : isPressed
            ? "bg-blue-50/80 scale-95 shadow-inner"
            : "bg-transparent hover:bg-blue-50/70 hover:scale-105"
      )}>
        {icon}
      </div>
      <span className={cn(
        "font-medium transition-all duration-300 whitespace-nowrap overflow-hidden text-center",
        isSmallMobile ? "text-[7px] max-w-[32px] leading-tight" : "text-[9px] sm:text-xs mt-0.5 max-w-[48px] sm:max-w-[60px]",
        isActive 
          ? "opacity-100" 
          : isPressed 
            ? "opacity-100" 
            : "opacity-70 group-hover:opacity-100"
      )}>
        {displayLabel}
      </span>
      
      {/* Indicator dot for active item */}
      {isActive && (
        <span className={cn(
          "absolute rounded-full bg-blue-500",
          isSmallMobile ? "-bottom-0.5 h-0.5 w-4" : "-bottom-0.5 h-1 w-1"
        )}></span>
      )}
    </Link>
  );
};

export function BottomNavigation() {
  const { isSmallMobile } = useIsMobile();
  
  const iconSize = isSmallMobile ? 14 : 16;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-neutral-100 bg-white/95 backdrop-blur-md shadow-[0_-2px_15px_rgba(0,0,0,0.05)] md:hidden">
      {/* Notch background - white curve with subtle glow */}
      <div className="relative">
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-t-full border-t border-l border-r border-neutral-100 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]",
          isSmallMobile ? "-top-3 h-6 w-12" : "-top-4 sm:-top-6 h-8 sm:h-12 w-16 sm:w-24"
        )}></div>
        
        {/* Subtle gradient line above the notch */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent",
          isSmallMobile ? "-top-3 w-16" : "-top-4 sm:-top-6 w-20 sm:w-32"
        )}></div>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex w-full max-w-md mx-auto items-end justify-between relative",
        isSmallMobile ? "h-11 pb-1" : "h-12 sm:h-16 px-1 sm:px-2"
      )}>
        <div className="flex-1 flex justify-around">
          <BottomNavItem
            href="/dashboard"
            icon={<LayoutDashboard size={iconSize} strokeWidth={2} className="stroke-current" />}
            label="Dashboard"
          />
          <BottomNavItem
            href="/dashboard/unit-motor"
            icon={<Bike size={iconSize} strokeWidth={2} className="stroke-current" />}
            label="Unit"
          />
        </div>
        
        {/* Center space for main action */}
        <div className={cn(
          "flex justify-center",
          isSmallMobile ? "w-10" : "w-14 sm:w-20"
        )}>
          <BottomNavItem
            href="/dashboard/transaksi/tambah"
            icon={null}
            label="Booking"
            isMain={true}
          />
        </div>
        
        <div className="flex-1 flex justify-around">
          <BottomNavItem
            href="/dashboard/transaksi"
            icon={<ShoppingCart size={iconSize} strokeWidth={2} className="stroke-current" />}
            label="Transaksi"
          />
          <BottomNavItem
            href="/dashboard/more"
            icon={<Menu size={iconSize} strokeWidth={2} className="stroke-current" />}
            label="Lainnya"
          />
        </div>
      </div>
    </div>
  );
} 