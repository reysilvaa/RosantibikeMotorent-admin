"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { isMobile, isSmallMobile } = useIsMobile();

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
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 ease-in-out md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isSidebarOpen ? "md:ml-60" : "md:ml-16",
      )}>
        <Header 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className={cn(
          "flex-1 w-full overflow-hidden",
          isSmallMobile ? 
            "px-2 pt-2 pb-16" :
            "px-3 pt-3 pb-16",
          "md:p-5 md:pb-6"
        )}>
          <div className="w-full h-full">
          {children}
          </div>
        </main>
        
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
} 