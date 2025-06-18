"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Bike,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { getTransaksi, StatusTransaksi, Transaksi } from "@/lib/transaksi";
import { getUnitMotor } from "@/lib/unit-motor";
import { StatistikData } from "@/lib/types/stats";
import { TransactionChart, getDataTransaksiBulan } from "@/components/dashboard/transaction-chart";
import { StatusMotorChart, getDataStatusMotor } from "@/components/dashboard/status-motor-chart";
import { DataTable } from "@/components/ui/data-table";


interface CustomStatistikData extends Omit<StatistikData, 'dataTransaksi'> {
  dataTransaksi: Transaksi[];
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {title}
      </CardTitle>
      <div className="rounded-full bg-neutral-100 p-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && trendValue && (
        <p
          className={`mt-1 flex items-center text-xs ${
            trend === "up"
              ? "text-green-600 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="mr-1 h-3 w-3" />
          ) : (
            <ArrowUpRight className="mr-1 h-3 w-3 rotate-90" />
          )}
          {trendValue}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statistik, setStatistik] = useState<CustomStatistikData>({
    totalTransaksi: 0,
    pendapatanBulanIni: 0,
    motorTersedia: 0,
    transaksiPending: 0,
    dataTransaksi: [],
    dataTransaksiBulan: [],
    dataStatusMotor: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resTransaksi = await getTransaksi({ limit: 100 });
        const resUnitMotor = await getUnitMotor({ limit: 100 });
        const tanggalSekarang = new Date();
        const bulanIni = tanggalSekarang.getMonth();
        const tahunIni = tanggalSekarang.getFullYear();
        
        const transaksiSelesaiBulanIni = resTransaksi.data.filter(
          (transaksi) => {
            const tanggalTransaksi = new Date(transaksi.updatedAt);
            return (
              transaksi.status === StatusTransaksi.SELESAI &&
              tanggalTransaksi.getMonth() === bulanIni &&
              tanggalTransaksi.getFullYear() === tahunIni
            );
          }
        );
        
        const pendapatanBulanIni = transaksiSelesaiBulanIni.reduce(
          (total, transaksi) => total + Number(transaksi.totalBiaya),
          0
        );
        
        const motorTersedia = resUnitMotor.data.filter(
          (motor) => motor.status === "TERSEDIA"
        ).length;
        const transaksiPending = resTransaksi.data.filter(
          (transaksi) =>
            transaksi.status === StatusTransaksi.BOOKING ||
            transaksi.status === StatusTransaksi.BERJALAN ||
            transaksi.status === StatusTransaksi.AKTIF
        ).length;
        
        setStatistik({
          totalTransaksi: resTransaksi.meta.totalItems,
          pendapatanBulanIni,
          motorTersedia,
          transaksiPending,
          dataTransaksi : resTransaksi.data.slice(0, 5) as Transaksi[],
          dataTransaksiBulan: getDataTransaksiBulan(resTransaksi.data, tahunIni),
          dataStatusMotor: getDataStatusMotor(resUnitMotor.data),
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const transaksiColumns = [
    {
      header: "Penyewa",
      cell: (transaksi: Transaksi) => (
        <div>
          <div className="font-medium">{transaksi.namaPenyewa}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.noWhatsapp}
          </div>
        </div>
      ),
    },
    {
      header: "Motor",
      cell: (transaksi: Transaksi) => (
        <div>
          <div>{transaksi.unitMotor?.jenis ? `${transaksi.unitMotor.jenis.merk} ${transaksi.unitMotor.jenis.model}` : "-"}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.unitMotor?.platNomor || "-"}
          </div>
        </div>
      ),
    },
    {
      header: "Mulai",
      cell: (transaksi: Transaksi) => formatTanggal(transaksi.tanggalMulai),
    },
    {
      header: "Selesai",
      cell: (transaksi: Transaksi) => formatTanggal(transaksi.tanggalSelesai),
    },
    {
      header: "Status",
      cell: (transaksi: Transaksi) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            transaksi.status === StatusTransaksi.SELESAI
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : transaksi.status === StatusTransaksi.BERJALAN
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : transaksi.status === StatusTransaksi.BOOKING
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : transaksi.status === StatusTransaksi.BATAL
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              : transaksi.status === StatusTransaksi.OVERDUE
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" 
              : "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400"
          }`}
        >
          {transaksi.status}
        </span>
      ),
    },
    {
      header: "Total",
      cell: (transaksi: Transaksi) => (
        <div className="font-medium">{formatRupiah(Number(transaksi.totalBiaya))}</div>
      ),
      className: "text-right",
    },
  ];

  const handleTransaksiClick = (transaksi: Transaksi) => {
    window.location.href = `/dashboard/transaksi/${transaksi.id}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Ringkasan dan statistik dari sistem rental motor
          </p>
        </div>
        
        {loading ? (
          <div className="grid h-96 place-items-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-lg font-medium">Memuat data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Transaksi"
                value={statistik.totalTransaksi}
                icon={<ShoppingCart className="h-4 w-4" />}
                trend="up"
                trendValue="12% dari bulan lalu"
              />
              <StatCard
                title="Pendapatan Bulan Ini"
                value={formatRupiah(statistik.pendapatanBulanIni)}
                icon={<TrendingUp className="h-4 w-4" />}
                trend="up"
                trendValue="8% dari bulan lalu"
              />
              <StatCard
                title="Motor Tersedia"
                value={statistik.motorTersedia}
                icon={<Bike className="h-4 w-4" />}
              />
              <StatCard
                title="Transaksi Pending"
                value={statistik.transaksiPending}
                icon={<Clock className="h-4 w-4" />}
                trend={statistik.transaksiPending > 5 ? "up" : "down"}
                trendValue={
                  statistik.transaksiPending > 5
                    ? "Perlu perhatian"
                    : "Normal"
                }
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Transaksi per Bulan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <TransactionChart data={statistik.dataTransaksiBulan} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Status Motor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <StatusMotorChart data={statistik.dataStatusMotor} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={statistik.dataTransaksi}
                  columns={transaksiColumns}
                  keyField="id"
                  onRowClick={handleTransaksiClick}
                  emptyMessage="Belum ada data transaksi"
                  isLoading={loading}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 