'use client';

import { getDataStatusMotor } from '@/components/dashboard/chart/status-motor-chart';
import { getDataTransaksiBulan } from '@/components/dashboard/chart/transaction-chart';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { getTransaksi, StatusTransaksi, Transaksi } from '@/lib/transaksi';
import { StatistikData } from '@/lib/types/stats';
import { getUnitMotor, UnitMotor } from '@/lib/unit-motor';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data transaksi
        let transaksiData: Transaksi[] = [];
        try {
          const resTransaksi = await getTransaksi({ limit: 100 });
          transaksiData = Array.isArray(resTransaksi) ? resTransaksi : [];
          console.log('Data transaksi:', transaksiData.length);
        } catch (error) {
          console.error('Error mengambil data transaksi:', error);
          transaksiData = [];
        }
        
        // Ambil data unit motor
        let unitMotorData: UnitMotor[] = [];
        try {
          const resUnitMotor = await getUnitMotor({ limit: 100 });
          unitMotorData = Array.isArray(resUnitMotor) ? resUnitMotor : [];
          console.log('Data unit motor:', unitMotorData.length);
        } catch (error) {
          console.error('Error mengambil data unit motor:', error);
          unitMotorData = [];
        }

        const tanggalSekarang = new Date();
        const bulanIni = tanggalSekarang.getMonth();
        const tahunIni = tanggalSekarang.getFullYear();

        // Filter transaksi selesai bulan ini
        const transaksiSelesaiBulanIni = transaksiData.filter(transaksi => {
          if (!transaksi || !transaksi.updatedAt) return false;
          
          const tanggalTransaksi = new Date(transaksi.updatedAt);
          return (
            transaksi.status === StatusTransaksi.SELESAI &&
            tanggalTransaksi.getMonth() === bulanIni &&
            tanggalTransaksi.getFullYear() === tahunIni
          );
        });

        // Hitung pendapatan bulan ini
        const pendapatanBulanIni = transaksiSelesaiBulanIni.reduce(
          (total, transaksi) => total + Number(transaksi.totalBiaya || 0),
          0
        );

        // Hitung motor tersedia
        const motorTersedia = unitMotorData.filter(
          motor => motor && motor.status === 'TERSEDIA'
        ).length;

        // Hitung transaksi pending
        const transaksiPending = transaksiData.filter(
          transaksi =>
            transaksi &&
            (transaksi.status === StatusTransaksi.BOOKING ||
            transaksi.status === StatusTransaksi.BERJALAN ||
            transaksi.status === StatusTransaksi.AKTIF)
        ).length;

        // Update state statistik
        setStatistik({
          totalTransaksi: transaksiData.length,
          pendapatanBulanIni,
          motorTersedia,
          transaksiPending,
          dataTransaksi: transaksiData.slice(0, 5),
          dataTransaksiBulan: getDataTransaksiBulan(
            transaksiData,
            tahunIni
          ),
          dataStatusMotor: getDataStatusMotor(unitMotorData),
        });
        
        setError(null);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
        setError('Gagal memuat data dashboard. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 overflow-hidden pb-16 md:space-y-8 md:pb-20">
        <PageHeader
          description="Ringkasan dan statistik dari sistem rental motor"
          title="Dashboard"
        />

        {loading ? (
          <LoadingIndicator message="Memuat data..." />
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        ) : (
          <>
            <DashboardStats
              motorTersedia={statistik.motorTersedia}
              pendapatanBulanIni={statistik.pendapatanBulanIni}
              totalTransaksi={statistik.totalTransaksi}
              transaksiPending={statistik.transaksiPending}
            />

            <DashboardCharts
              dataStatusMotor={statistik.dataStatusMotor}
              dataTransaksiBulan={statistik.dataTransaksiBulan}
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
