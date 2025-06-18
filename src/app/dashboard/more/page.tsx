"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Tags,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const MenuItem = ({ href, icon, title, onClick }: MenuItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:bg-neutral-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2 text-blue-700">{icon}</div>
        <span className="font-medium">{title}</span>
      </div>
      <ChevronRight className="text-neutral-400" size={20} />
    </Link>
  );
};

export default function MorePage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="space-y-3">
          <MenuItem
            href="/dashboard/jenis-motor"
            icon={<Tags size={18} />}
            title="Jenis Motor"
          />
          <MenuItem
            href="/dashboard/whatsapp"
            icon={<MessageSquare size={18} />}
            title="WhatsApp"
          />
          <MenuItem
            href="/dashboard/admin"
            icon={<Users size={18} />}
            title="Admin"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-red-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 text-red-700">
                <LogOut size={18} />
              </div>
              <span className="font-medium text-red-700">Keluar</span>
            </div>
            <ChevronRight className="text-red-400" size={20} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 