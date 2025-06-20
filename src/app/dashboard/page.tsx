'use client';

import React, { useEffect, useState } from 'react';
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
import { getUnitMotor } from '@/lib/unit-motor';

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

        const transaksiSelesaiBulanIni = resTransaksi.data.filter(transaksi => {
          const tanggalTransaksi = new Date(transaksi.updatedAt);
          return (
            transaksi.status === StatusTransaksi.SELESAI &&
            tanggalTransaksi.getMonth() === bulanIni &&
            tanggalTransaksi.getFullYear() === tahunIni
          );
        });

        const pendapatanBulanIni = transaksiSelesaiBulanIni.reduce(
          (total, transaksi) => total + Number(transaksi.totalBiaya),
          0
        );

        const motorTersedia = resUnitMotor.data.filter(
          motor => motor.status === 'TERSEDIA'
        ).length;

        const transaksiPending = resTransaksi.data.filter(
          transaksi =>
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
          dataTransaksiBulan: getDataTransaksiBulan(
            resTransaksi.data,
            tahunIni
          ),
          dataStatusMotor: getDataStatusMotor(resUnitMotor.data),
        });
      } catch (error) {
        console.error('Gagal mengambil data:', error);
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
