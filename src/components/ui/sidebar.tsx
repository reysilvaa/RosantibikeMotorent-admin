"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Bike,
  ShoppingCart,
  Users,
  FileText,
  Tags,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAdminData } from "@/lib/cookies";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
}

const SidebarNavItem = ({
  href,
  icon,
  title,
  isOpen,
}: SidebarNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg w-11 h-11 mx-auto justify-center transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-neutral-700 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <div className="text-base mx-auto">{icon}</div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="border border-neutral-200 bg-white text-neutral-800">
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
        "flex items-center gap-3 rounded-lg px-4 py-2.5 mx-2 transition-all duration-300 ease-in-out",
        isActive
          ? "bg-blue-600 text-white"
          : "text-neutral-700 hover:bg-blue-50 hover:text-blue-700"
      )}
    >
      <div className="text-base">{icon}</div>
      <span className="flex-1 font-medium text-sm">
        {title}
      </span>
      {isActive && (
        <ChevronRight size={15} className="ml-auto text-white" />
      )}
    </Link>
  );
};

export function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const admin = getAdminData();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, title: "Dashboard" },
    { href: "/dashboard/transaksi", icon: <ShoppingCart size={20} />, title: "Transaksi" },
    { href: "/dashboard/jenis-motor", icon: <Tags size={20} />, title: "Jenis Motor" },
    { href: "/dashboard/unit-motor", icon: <Bike size={20} />, title: "Unit Motor" },
    { href: "/dashboard/blog", icon: <FileText size={20} />, title: "Blog" },
    { href: "/dashboard/whatsapp", icon: <MessageSquare size={20} />, title: "WhatsApp" },
    { href: "/dashboard/admin", icon: <Users size={20} />, title: "Admin" },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out",
        isOpen 
          ? "w-60 translate-x-0 opacity-100" 
          : "w-16 translate-x-0 md:translate-x-0 -translate-x-full opacity-0 md:opacity-100"
      )}
    >
      <div className="flex items-center justify-center h-14 border-b border-neutral-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
          <LayoutDashboard size={18} />
        </div>
        {isOpen && (
          <span className="ml-2 font-bold text-base text-neutral-900">
            Rosantibike
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-auto py-3">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isOpen={isOpen}
          />
        ))}
      </div>

      <div className="border-t border-neutral-200 p-3">
        <div className={cn(
          "mb-2 flex items-center transition-all duration-300 ease-in-out",
          isOpen ? "gap-2" : "justify-center"
        )}>
          <div className={cn(
            "flex items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out",
            isOpen ? "h-9 w-9" : "h-9 w-9"
          )}>
            {admin?.nama?.charAt(0) || "A"}
          </div>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm text-neutral-900 truncate">
                {admin?.nama || "Admin"}
              </span>
              <span className="text-xs text-neutral-500 truncate">
                {admin?.username || "admin"}
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
                    "flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out cursor-pointer",
                    "mx-auto"
                  )}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="border border-neutral-200 bg-white text-neutral-800">
                Keluar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="flex w-full items-center gap-2 rounded-lg text-left text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">
              Keluar
            </span>
          </Button>
        )}
      </div>
    </aside>
  );
} 