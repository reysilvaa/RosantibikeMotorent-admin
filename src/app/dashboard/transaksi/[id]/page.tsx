"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, User, Phone, MapPin, Tag, Calendar, CreditCard, Bike } from "lucide-react";
import { StatusTransaksi } from "@/lib/transaksi";
import { formatTanggal, formatTanggalWaktu, formatRupiah } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StatusMessage } from "@/components/ui/status-message";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { InfoCard } from "@/components/ui/info-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTransaksiDetailStore } from "@/lib/store/transaksi/transaksi-detail-store";

export default function DetailTransaksiPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    transaksi,
    loading,
    processing,
    error,
    success,
    fetchTransaksiDetail,
    handleSelesaikan,
    getStatusBadgeClass,
    safeDateFormat
  } = useTransaksiDetailStore();

  useEffect(() => {
    if (params.id) {
      fetchTransaksiDetail(params.id);
    }
  }, [params.id, fetchTransaksiDetail]);

  const handleBack = () => {
    router.push("/dashboard/transaksi");
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
  const status = transaksi?.status || defaultStatus;

  // Map status to variant
  const getStatusVariant = (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING: return "warning";
      case StatusTransaksi.BERJALAN: return "info";
      case StatusTransaksi.SELESAI: return "success";
      case StatusTransaksi.BATAL: return "neutral";
      case StatusTransaksi.OVERDUE: return "danger";
      default: return "neutral";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Detail Transaksi" 
          id={transaksi?.id || ""}
          showBackButton={true}
          backHref="/dashboard/transaksi"
          actionLabel={status === StatusTransaksi.BERJALAN ? "Selesaikan Transaksi" : undefined}
          actionIcon={status === StatusTransaksi.BERJALAN ? <ClipboardCheck className="mr-2 h-4 w-4" /> : undefined}
          actionHandler={status === StatusTransaksi.BERJALAN ? () => handleSelesaikan(params.id) : undefined}
          actionDisabled={processing}
          actionLoading={processing}
        />

        <StatusMessage error={error} success={success} />

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            title="Informasi Penyewa"
            items={[
              {
                icon: User,
                label: "Nama Penyewa",
                value: transaksi?.namaPenyewa || "-"
              },
              {
                icon: Phone,
                label: "Nomor Telepon",
                value: transaksi?.noWhatsapp || "-"
              },
              {
                icon: MapPin,
                label: "Alamat",
                value: transaksi?.alamat || "-"
              }
            ]}
          />

          <InfoCard
            title="Informasi Sewa"
            items={[
              {
                icon: Tag,
                label: "Status",
                value: <StatusBadge 
                  status={status} 
                  variant={getStatusVariant(status) as any}
                />
              },
              {
                icon: Calendar,
                label: "Tanggal Mulai",
                value: safeDateFormat(transaksi?.tanggalMulai, formatTanggal)
              },
              {
                icon: Calendar,
                label: "Tanggal Selesai",
                value: safeDateFormat(transaksi?.tanggalSelesai, formatTanggal)
              },
              {
                icon: CreditCard,
                label: "Total Harga",
                value: <span className="text-xl font-bold text-primary">
                  {formatRupiah(transaksi?.totalBiaya || 0)}
                </span>
              }
            ]}
          />
        </div>

        <InfoCard
          title="Unit Motor"
          items={transaksi?.unitMotor ? [
            {
              icon: Bike,
              label: "Jenis Motor",
              value: `${transaksi.unitMotor.jenis?.merk || "-"} (${transaksi.unitMotor.jenis?.cc || "-"} CC)`
            },
            {
              icon: Tag,
              label: "Plat Nomor",
              value: transaksi.unitMotor.platNomor || "-"
            },
            {
              icon: CreditCard,
              label: "Harga Sewa / hari",
              value: formatRupiah(transaksi.unitMotor.hargaSewa || 0)
            }
          ] : []}
          emptyMessage="Data unit motor tidak tersedia"
        />
        
        <InfoCard
          title="Fasilitas Tambahan"
          items={[
            ...(transaksi?.helm && transaksi.helm > 0 ? [{
              label: "Helm",
              value: `${transaksi.helm} unit`
            }] : []),
            ...(transaksi?.jasHujan && transaksi.jasHujan > 0 ? [{
              label: "Jas Hujan",
              value: `${transaksi.jasHujan} unit`
            }] : [])
          ]}
          emptyMessage="Tidak ada fasilitas tambahan"
        />

        <InfoCard
          title="Riwayat Transaksi"
          items={[
            {
              label: "Transaksi Dibuat",
              value: safeDateFormat(transaksi?.createdAt, formatTanggalWaktu)
            },
            ...(status === StatusTransaksi.SELESAI ? [{
              label: "Transaksi Selesai",
              value: safeDateFormat(transaksi?.updatedAt, formatTanggalWaktu)
            }] : []),
            ...(status === StatusTransaksi.OVERDUE ? [{
              label: "Transaksi Overdue",
              value: safeDateFormat(transaksi?.updatedAt, formatTanggalWaktu)
            }] : [])
          ]}
        />
      </div>
    </DashboardLayout>
  );
} 