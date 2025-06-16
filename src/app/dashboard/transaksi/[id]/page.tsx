"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransaksiDetail, selesaikanTransaksi, Transaksi, StatusTransaksi } from "@/lib/transaksi";
import { formatTanggal, formatTanggalWaktu } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DetailHeader } from "@/components/transaksi/detail-header";
import { NotificationMessage } from "@/components/transaksi/notification-message";
import { PenyewaInfo } from "@/components/transaksi/penyewa-info";
import { SewaInfo } from "@/components/transaksi/sewa-info";
import { UnitMotorInfo } from "@/components/transaksi/unit-motor-info";
import { FasilitasTambahan } from "@/components/transaksi/fasilitas-tambahan";
import { RiwayatTransaksi } from "@/components/transaksi/riwayat-transaksi";
import { LoadingIndicator } from "@/components/transaksi/loading-indicator";

export default function DetailTransaksiPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transaksiId, setTransaksiId] = useState("");

  useEffect(() => {
    if (params.id) {
      setTransaksiId(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (!transaksiId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTransaksiDetail(transaksiId);
        setTransaksi(data);
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        setError("Gagal mengambil data transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transaksiId]);

  const handleBack = () => {
    router.push("/dashboard/transaksi");
  };

  const handleSelesaikan = async () => {
    if (!transaksiId) return;
    
    try {
      setProcessing(true);
      await selesaikanTransaksi(transaksiId);
      // Refresh data
      const data = await getTransaksiDetail(transaksiId);
      setTransaksi(data);
      setSuccess("Transaksi berhasil diselesaikan");
    } catch (error) {
      console.error("Gagal menyelesaikan transaksi:", error);
      setError("Gagal menyelesaikan transaksi");
    } finally {
      setProcessing(false);
    }
  };

  // Fungsi untuk mendapatkan badge warna berdasarkan status
  const getStatusBadgeClass = (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case StatusTransaksi.BERJALAN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case StatusTransaksi.SELESAI:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case StatusTransaksi.BATAL:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
      case StatusTransaksi.OVERDUE:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

  // Fungsi untuk memformat tanggal dengan aman
  const safeDateFormat = (dateString: string | null | undefined, formatter: Function) => {
    if (!dateString) return "-";
    try {
      return formatter(dateString);
    } catch (error) {
      console.error("Format tanggal error:", error);
      return "-";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingIndicator />
      </DashboardLayout>
    );
  }

  // Default status jika transaksi null
  const defaultStatus = StatusTransaksi.BOOKING;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DetailHeader 
          id={transaksi?.id || ""}
          status={transaksi?.status || defaultStatus}
          processing={processing}
          handleBack={handleBack}
          handleSelesaikan={handleSelesaikan}
        />

        <NotificationMessage error={error} success={success} />

        <div className="grid gap-6 md:grid-cols-2">
          <PenyewaInfo 
            namaPenyewa={transaksi?.namaPenyewa || ""}
            noWhatsapp={transaksi?.noWhatsapp || ""}
            alamat={transaksi?.alamat}
          />

          <SewaInfo
            status={transaksi?.status || defaultStatus}
            tanggalMulai={transaksi?.tanggalMulai || ""}
            tanggalSelesai={transaksi?.tanggalSelesai || ""}
            totalBiaya={transaksi?.totalBiaya || 0}
            getStatusBadgeClass={getStatusBadgeClass}
            formatTanggal={(date) => safeDateFormat(date, formatTanggal)}
          />
        </div>

        <UnitMotorInfo unitMotor={transaksi?.unitMotor} />
        
        <FasilitasTambahan helm={transaksi?.helm} jasHujan={transaksi?.jasHujan} />

        <RiwayatTransaksi
          status={transaksi?.status || defaultStatus}
          createdAt={transaksi?.createdAt || ""}
          updatedAt={transaksi?.updatedAt || ""}
          formatTanggalWaktu={(date) => safeDateFormat(date, formatTanggalWaktu)}
        />
      </div>
    </DashboardLayout>
  );
} 