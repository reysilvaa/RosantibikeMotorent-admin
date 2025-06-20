'use client';

import React, { useEffect } from 'react';
import {
  Bike,
  Calendar,
  ClipboardCheck,
  CreditCard,
  MapPin,
  Phone,
  Tag,
  User,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { InfoCard } from '@/components/ui/info-card';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatusMessage } from '@/components/ui/status-message';
import { formatRupiah, formatTanggal, formatTanggalWaktu } from '@/lib/helper';
import { useTransaksiDetailStore } from '@/lib/store/transaksi/transaksi-detail-store';
import { StatusTransaksi } from '@/lib/transaksi';

export default function DetailTransaksiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {
    transaksi,
    loading,
    processing,
    error,
    success,
    fetchTransaksiDetail,
    handleSelesaikan,
    safeDateFormat,
  } = useTransaksiDetailStore();
  const { id } = React.use(params);

  useEffect(() => {
    if (id) {
      fetchTransaksiDetail(id);
    }
  }, [id, fetchTransaksiDetail]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingIndicator />
      </DashboardLayout>
    );
  }

  const defaultStatus = StatusTransaksi.BOOKING;
  const status = transaksi?.status || defaultStatus;

  const getStatusVariant = (status: StatusTransaksi) => {
    switch (status) {
      case StatusTransaksi.BOOKING:
        return 'warning';
      case StatusTransaksi.BERJALAN:
        return 'info';
      case StatusTransaksi.SELESAI:
        return 'success';
      case StatusTransaksi.BATAL:
        return 'neutral';
      case StatusTransaksi.OVERDUE:
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Detail Transaksi"
          id={transaksi?.id || ''}
          showBackButton={true}
          backHref="/dashboard/transaksi"
          actionLabel={
            status === StatusTransaksi.BERJALAN
              ? 'Selesaikan Transaksi'
              : undefined
          }
          actionIcon={
            status === StatusTransaksi.BERJALAN ? (
              <ClipboardCheck className="mr-2 h-4 w-4" />
            ) : undefined
          }
          actionHandler={
            status === StatusTransaksi.BERJALAN
              ? () => handleSelesaikan(React.use(params).id)
              : undefined
          }
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
                label: 'Nama Penyewa',
                value: transaksi?.namaPenyewa || '-',
              },
              {
                icon: Phone,
                label: 'Nomor Telepon',
                value: transaksi?.noWhatsapp || '-',
              },
              {
                icon: MapPin,
                label: 'Alamat',
                value: transaksi?.alamat || '-',
              },
            ]}
          />

          <InfoCard
            title="Informasi Sewa"
            items={[
              {
                icon: Tag,
                label: 'Status',
                value: (
                  <StatusBadge
                    status={status}
                    variant={getStatusVariant(status)}
                  />
                ),
              },
              {
                icon: Calendar,
                label: 'Tanggal Mulai',
                value: safeDateFormat(transaksi?.tanggalMulai, formatTanggal),
              },
              {
                icon: Calendar,
                label: 'Tanggal Selesai',
                value: safeDateFormat(transaksi?.tanggalSelesai, formatTanggal),
              },
              {
                icon: CreditCard,
                label: 'Total Harga',
                value: (
                  <span className="text-primary text-xl font-bold">
                    {formatRupiah(transaksi?.totalBiaya || 0)}
                  </span>
                ),
              },
            ]}
          />
        </div>

        <InfoCard
          title="Unit Motor"
          items={
            transaksi?.unitMotor
              ? [
                  {
                    icon: Bike,
                    label: 'Jenis Motor',
                    value: `${transaksi.unitMotor.jenis?.merk || '-'} (${transaksi.unitMotor.jenis?.cc || '-'} CC)`,
                  },
                  {
                    icon: Tag,
                    label: 'Plat Nomor',
                    value: transaksi.unitMotor.platNomor || '-',
                  },
                  {
                    icon: CreditCard,
                    label: 'Harga Sewa / hari',
                    value: formatRupiah(transaksi.unitMotor.hargaSewa || 0),
                  },
                ]
              : []
          }
          emptyMessage="Data unit motor tidak tersedia"
        />

        <InfoCard
          title="Fasilitas Tambahan"
          items={[
            ...(transaksi?.helm && transaksi.helm > 0
              ? [
                  {
                    label: 'Helm',
                    value: `${transaksi.helm} unit`,
                  },
                ]
              : []),
            ...(transaksi?.jasHujan && transaksi.jasHujan > 0
              ? [
                  {
                    label: 'Jas Hujan',
                    value: `${transaksi.jasHujan} unit`,
                  },
                ]
              : []),
          ]}
          emptyMessage="Tidak ada fasilitas tambahan"
        />

        <InfoCard
          title="Riwayat Transaksi"
          items={[
            {
              label: 'Transaksi Dibuat',
              value: safeDateFormat(transaksi?.createdAt, formatTanggalWaktu),
            },
            ...(status === StatusTransaksi.SELESAI
              ? [
                  {
                    label: 'Transaksi Selesai',
                    value: safeDateFormat(
                      transaksi?.updatedAt,
                      formatTanggalWaktu
                    ),
                  },
                ]
              : []),
            ...(status === StatusTransaksi.OVERDUE
              ? [
                  {
                    label: 'Transaksi Overdue',
                    value: safeDateFormat(
                      transaksi?.updatedAt,
                      formatTanggalWaktu
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
