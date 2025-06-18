"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminData } from "@/lib/cookies";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const admin = getAdminData();

  // Fungsi untuk mendapatkan judul halaman berdasarkan pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/dashboard/transaksi")) return "Transaksi";
    if (pathname.includes("/dashboard/jenis-motor")) return "Jenis Motor";
    if (pathname.includes("/dashboard/unit-motor")) return "Unit Motor";
    if (pathname.includes("/dashboard/blog")) return "Blog";
    if (pathname.includes("/dashboard/whatsapp")) return "WhatsApp";
    if (pathname.includes("/dashboard/admin")) return "Admin";
    if (pathname.includes("/dashboard/more")) return "Menu Lainnya";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-neutral-200 bg-white px-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 ease-in-out md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="flex items-center">
            <h1 className="text-base font-bold text-neutral-900">
              {getPageTitle()}
            </h1>
            <ChevronRight size={18} className="mx-1 text-neutral-400" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-neutral-400" />
            </div>
            <input
              type="search"
              className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-3 py-2 transition-all duration-300 ease-in-out"
              placeholder="Cari..."
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 ease-in-out"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out">
              {admin?.nama?.charAt(0) || "A"}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-medium text-sm text-neutral-900">
                {admin?.nama || "Admin"}
              </span>
              <span className="text-xs text-neutral-500">
                {admin?.username || "admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 