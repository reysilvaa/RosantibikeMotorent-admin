import React from "react";
import { ShoppingCart, Bike, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "./stat-card";
import { formatRupiah } from "@/lib/helper";

interface DashboardStatsProps {
  totalTransaksi: number;
  pendapatanBulanIni: number;
  motorTersedia: number;
  transaksiPending: number;
}

export function DashboardStats({
  totalTransaksi,
  pendapatanBulanIni,
  motorTersedia,
  transaksiPending,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
      <StatCard
        title="Total Transaksi"
        value={totalTransaksi}
        icon={<ShoppingCart className="h-4 w-4" />}
        trend="up"
        trendValue="12% dari bulan lalu"
      />
      <StatCard
        title="Pendapatan Bulan Ini"
        value={formatRupiah(pendapatanBulanIni)}
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
        trendValue="8% dari bulan lalu"
      />
      <StatCard
        title="Motor Tersedia"
        value={motorTersedia}
        icon={<Bike className="h-4 w-4" />}
      />
      <StatCard
        title="Transaksi Pending"
        value={transaksiPending}
        icon={<Clock className="h-4 w-4" />}
        trend={transaksiPending > 5 ? "up" : "down"}
        trendValue={
          transaksiPending > 5
            ? "Perlu perhatian"
            : "Normal"
        }
      />
    </div>
  );
} 