"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Bell, Search, ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminData } from "@/lib/cookies";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface BreadcrumbItem {
  title: string;
  path: string;
}

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const admin = getAdminData();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const { isMobile, isSmallMobile } = useIsMobile();

  // Fungsi untuk mendapatkan judul halaman berdasarkan pathname
  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/dashboard/transaksi")) {
      if (path.includes("/tambah")) return "Tambah Transaksi";
      if (path.match(/\/dashboard\/transaksi\/[a-zA-Z0-9-]+$/)) return "Detail Transaksi";
      return "Transaksi";
    }
    if (path.includes("/dashboard/jenis-motor")) {
      if (path.includes("/tambah")) return "Tambah Jenis Motor";
      if (path.match(/\/dashboard\/jenis-motor\/[a-zA-Z0-9-]+$/)) return "Detail Jenis Motor";
      return "Jenis Motor";
    }
    if (path.includes("/dashboard/unit-motor")) {
      if (path.includes("/tambah")) return "Tambah Unit Motor";
      if (path.match(/\/dashboard\/unit-motor\/[a-zA-Z0-9-]+$/)) return "Detail Unit Motor";
      return "Unit Motor";
    }
    if (path.includes("/dashboard/blog")) {
      if (path.includes("/tambah")) return "Tambah Blog";
      if (path.includes("/edit")) return "Edit Blog";
      if (path.match(/\/dashboard\/blog\/[a-zA-Z0-9-]+$/)) return "Detail Blog";
      return "Blog";
    }
    if (path.includes("/dashboard/whatsapp")) return "WhatsApp";
    if (path.includes("/dashboard/admin")) {
      if (path.includes("/tambah")) return "Tambah Admin";
      if (path.includes("/edit")) return "Edit Admin";
      return "Admin";
    }
    if (path.includes("/dashboard/more")) return "Menu Lainnya";
    return "Dashboard";
  };

  // Fungsi untuk membuat breadcrumb dari pathname
  const generateBreadcrumbs = (path: string) => {
    // Selalu mulai dengan Dashboard
    const items: BreadcrumbItem[] = [
      { title: "Dashboard", path: "/dashboard" }
    ];

    // Jika sudah di dashboard, tidak perlu menambahkan item lain
    if (path === "/dashboard") {
      return items;
    }

    // Pisahkan path menjadi segmen
    const segments = path.split('/').filter(Boolean);
    
    // Buat path bertingkat
    let currentPath = "";
    
    segments.forEach((segment, index) => {
      if (segment === "dashboard" && index === 0) {
        // Dashboard sudah ditambahkan di atas
        currentPath = `/${segment}`;
        return;
      }
      
      currentPath = `${currentPath}/${segment}`;
      
      // Jika ini adalah ID (segment terakhir dan bukan tambah/edit)
      if (index === segments.length - 1 && !["tambah", "edit"].includes(segment)) {
        // Cek jika ini adalah ID (UUID atau angka)
        const isId = /^[a-zA-Z0-9-]+$/.test(segment);
        
        if (isId && index > 1) {
          // Jika ID, gunakan judul dari path
          items.push({
            title: getPageTitle(currentPath),
            path: currentPath
          });
          return;
        }
      }
      
      // Tambahkan item breadcrumb untuk segment yang bukan ID
      if (segment !== "edit" && segment !== "tambah") {
        items.push({
          title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path: currentPath
        });
      } else {
        // Untuk edit dan tambah, tambahkan dengan judul yang lebih deskriptif
        items.push({
          title: segment === "edit" ? "Edit" : "Tambah",
          path: currentPath
        });
      }
    });
    
    // Ganti judul terakhir dengan yang lebih deskriptif
    if (items.length > 0) {
      items[items.length - 1].title = getPageTitle(path);
    }
    
    return items;
  };

  // Fungsi untuk mendapatkan breadcrumb yang sesuai untuk tampilan mobile
  const getMobileBreadcrumbs = (items: BreadcrumbItem[]) => {
    if (items.length <= 2) {
      // Jika hanya ada Dashboard atau Dashboard + 1 item, tampilkan semua
      return items;
    }
    
    // Untuk mobile yang sangat kecil, tampilkan hanya item terakhir
    if (isSmallMobile) {
      return [items[items.length - 1]];
    }
    
    // Jika ada lebih dari 2 item, tampilkan item pertama (Dashboard) dan item terakhir
    return [
      items[0],
      { title: "...", path: "" }, // Item dummy untuk ellipsis
      items[items.length - 1] // Item terakhir
    ];
  };

  useEffect(() => {
    if (pathname) {
      const newBreadcrumbs = generateBreadcrumbs(pathname);
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [pathname]);

  // Pilih breadcrumb yang akan ditampilkan berdasarkan ukuran layar
  const displayedBreadcrumbs = isMobile ? getMobileBreadcrumbs(breadcrumbs) : breadcrumbs;

  return (
    <header className={cn(
      "sticky top-0 z-50 flex h-14 items-center border-b border-neutral-200 bg-white",
      isSmallMobile ? "px-2" : "px-3 md:px-4"
    )}>
      <div className="flex w-full items-center justify-between">
        {/* Bagian kiri: tombol menu dan breadcrumb */}
        <div className={cn(
          "flex items-center gap-1 md:gap-2 overflow-hidden",
          isSmallMobile ? "max-w-[calc(100%-80px)]" : "max-w-[calc(100%-100px)] sm:max-w-[calc(100%-150px)] md:max-w-[calc(100%-250px)]"
        )}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 flex-shrink-0 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 ease-in-out md:hidden",
              isSmallMobile ? "h-7 w-7" : "h-8 w-8 md:h-9 md:w-9"
            )}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={isSmallMobile ? 16 : 18} /> : <Menu size={isSmallMobile ? 16 : 18} />}
          </Button>

          <div className="flex items-center overflow-x-auto hide-scrollbar">
            <nav className={cn(
              "flex items-center space-x-1",
              isSmallMobile ? "text-[10px]" : "text-xs md:text-sm"
            )}>
              {displayedBreadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight size={isSmallMobile ? 10 : 12} className="mx-0.5 md:mx-1 flex-shrink-0 text-neutral-400" />
                  )}
                  {item.path ? (
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center whitespace-nowrap rounded transition-colors",
                        isSmallMobile ? "px-1 py-0.5" : "px-1.5 py-0.5 md:px-2 md:py-1",
                        index === displayedBreadcrumbs.length - 1
                          ? "font-semibold text-neutral-900 bg-neutral-100"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
                        index === 0 ? "flex-shrink-0" : "flex-shrink"
                      )}
                    >
                      {index === 0 && !isSmallMobile && <Home size={12} className="mr-1 md:mr-1.5 md:size-14" />}
                      <span className={cn(
                        index === displayedBreadcrumbs.length - 1 ? "" : "truncate",
                        isSmallMobile ? "max-w-[60px]" : "max-w-[80px] md:max-w-[150px]"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <span className="flex items-center px-0.5 md:px-1 flex-shrink-0">
                      <MoreHorizontal size={isSmallMobile ? 12 : 14} className="text-neutral-400" />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Bagian kanan: pencarian, notifikasi, dan profil */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
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
            className={cn(
              "relative flex-shrink-0 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 ease-in-out",
              isSmallMobile ? "h-7 w-7" : "h-8 w-8 md:h-9 md:w-9"
            )}
          >
            <Bell size={isSmallMobile ? 14 : 16} className="md:size-18" />
            <span className="absolute top-1 right-1 flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-red-500"></span>
            </span>
          </Button>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={cn(
              "flex items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 ease-in-out",
              isSmallMobile ? "h-7 w-7" : "h-8 w-8 md:h-9 md:w-9"
            )}>
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