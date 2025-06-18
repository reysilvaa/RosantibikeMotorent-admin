"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Bike,
  ShoppingCart,
  Users,
  Menu,
  X,
  FileText,
  Tags,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getAdminData } from "@/lib/cookies";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { MobileHeader } from "@/components/ui/mobile-header";

interface SidebarNavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
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
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out",
        isActive
          ? "bg-blue-700 text-white"
          : "text-neutral-700 hover:bg-blue-100 dark:text-neutral-300 dark:hover:bg-blue-900/50 dark:hover:text-white"
      )}
    >
      <div className="text-lg">{icon}</div>
      <span className={cn("transition-all duration-200", isOpen ? "opacity-100" : "opacity-0 hidden md:block")}>
        {title}
      </span>
    </Link>
  );
};

const SidebarNav = ({ isOpen, toggleSidebar }: SidebarNavProps) => {
  const router = useRouter();
  const admin = getAdminData();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-neutral-900",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-600 p-1 text-white">
            <LayoutDashboard size={18} />
          </div>
          <span
            className={cn(
              "font-semibold transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-0 hidden"
            )}
          >
            Rosantibike Admin
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-auto p-3">
        <SidebarNavItem
          href="/dashboard"
          icon={<LayoutDashboard />}
          title="Dashboard"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/transaksi"
          icon={<ShoppingCart />}
          title="Transaksi"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/jenis-motor"
          icon={<Tags />}
          title="Jenis Motor"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/unit-motor"
          icon={<Bike />}
          title="Unit Motor"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/blog"
          icon={<FileText />}
          title="Blog"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/whatsapp"
          icon={<MessageSquare />}
          title="WhatsApp"
          isOpen={isOpen}
        />
        <SidebarNavItem
          href="/dashboard/admin"
          icon={<Users />}
          title="Admin"
          isOpen={isOpen}
        />
      </div>

      <div className="border-t border-neutral-200 px-3 py-4 dark:border-neutral-800">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            {admin?.nama?.charAt(0) || "A"}
          </div>
          <div
            className={cn(
              "flex flex-col transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-0 hidden"
            )}
          >
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {admin?.nama || "Admin"}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {admin?.username || "admin"}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center gap-2 text-left text-neutral-700 hover:bg-red-100 hover:text-red-600 dark:text-neutral-300 dark:hover:bg-red-900/30 dark:hover:text-red-500",
            !isOpen && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {isOpen && <span>Keluar</span>}
        </Button>
      </div>
    </aside>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { isMobile } = useIsMobile();

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

  useEffect(() => {
    setIsMounted(true);
    
    // Periksa autentikasi
    if (typeof window !== "undefined") {
      const isLoggedIn = checkAuth();
      if (!isLoggedIn) {
        router.push("/auth/login");
      }
    }
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [router, checkAuth]);

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {!isMobile && (
        <SidebarNav
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}
      
      <main
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          !isMobile && isSidebarOpen ? "md:pl-60" : !isMobile ? "md:pl-16" : "",
          isMobile ? "pb-16" : ""
        )}
      >
        {isMobile && <MobileHeader title={getPageTitle()} />}
        <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</div>
      </main>
      {isMobile && <BottomNavigation />}
    </div>
  );
} 