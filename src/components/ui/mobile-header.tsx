"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { getAdminData } from "@/lib/cookies";

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title = "Dashboard" }: MobileHeaderProps) {
  const admin = getAdminData();

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm md:hidden">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-blue-600 p-1.5 text-white">
          <LayoutDashboard size={16} />
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          {admin?.nama?.charAt(0) || "A"}
        </div>
      </div>
    </div>
  );
} 