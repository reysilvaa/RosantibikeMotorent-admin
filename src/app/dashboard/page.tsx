"use client";
import React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { getTransaksi, StatusTransaksi, Transaksi } from "@/lib/transaksi";
import { getUnitMotor } from "@/lib/unit-motor";
import { StatistikData } from "@/lib/types/stats";
import { getDataTransaksiBulan } from "@/components/dashboard/chart/transaction-chart";
import { getDataStatusMotor } from "@/components/dashboard/chart/status-motor-chart";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";

interface CustomStatistikData extends Omit<StatistikData, 'dataTransaksi'> {
  dataTransaksi: Transaksi[];
}

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
          dataTransaksi: resTransaksi.data.slice(0, 5) as Transaksi[],
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
            <DashboardStats 
              totalTransaksi={statistik.totalTransaksi}
              pendapatanBulanIni={statistik.pendapatanBulanIni}
              motorTersedia={statistik.motorTersedia}
              transaksiPending={statistik.transaksiPending}
            />
            
            <DashboardCharts 
              dataTransaksiBulan={statistik.dataTransaksiBulan}
              dataStatusMotor={statistik.dataStatusMotor}
            />
            
            <RecentTransactions 
              data={statistik.dataTransaksi}
              isLoading={loading}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 