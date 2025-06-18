"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Bell, Search, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminData } from "@/lib/cookies";

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

  useEffect(() => {
    if (pathname) {
      const newBreadcrumbs = generateBreadcrumbs(pathname);
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-neutral-200 bg-white px-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 ease-in-out md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="flex items-center overflow-x-auto hide-scrollbar pr-4">
            <nav className="flex items-center space-x-1 text-sm">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.path}>
                  {index > 0 && (
                    <ChevronRight size={16} className="mx-1 flex-shrink-0 text-neutral-400" />
                  )}
                  <Link
                    href={item.path}
                    className={`flex items-center whitespace-nowrap rounded px-2 py-1 transition-colors ${
                      index === breadcrumbs.length - 1
                        ? "font-semibold text-neutral-900 bg-neutral-100"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    {index === 0 && <Home size={14} className="mr-1.5" />}
                    {item.title}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
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