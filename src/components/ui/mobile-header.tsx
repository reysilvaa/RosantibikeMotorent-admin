"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { getAdminData } from "@/lib/cookies";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title = "Dashboard" }: MobileHeaderProps) {
  const admin = getAdminData();

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 backdrop-blur-md px-4 shadow-sm md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 p-1.5 text-white shadow-sm">
          <LayoutDashboard size={18} />
        </div>
        <span className="font-bold text-lg">{title}</span>
      </div>
      
      <div className="flex items-center">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-sm"
        )}>
          {admin?.nama?.charAt(0) || "A"}
        </div>
      </div>
    </div>
  );
} 