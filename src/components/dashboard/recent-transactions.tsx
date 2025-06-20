import React from 'react';
import { Bike, Clock, CreditCard, Tag, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { StatusBadge } from '@/components/ui/status-badge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { formatRupiah, formatTanggal } from '@/lib/helper';
import { Transaksi } from '@/lib/transaksi';

interface RecentTransactionsProps {
  data: Transaksi[];
  isLoading?: boolean;
}

export function RecentTransactions({
  data,
  isLoading = false,
}: RecentTransactionsProps) {
  const { isMobile } = useIsMobile();

  const transaksiColumns = [
    {
      header: 'Penyewa',
      cell: (transaksi: Transaksi) => (
        <div>
          {transaksi.namaPenyewa}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.noWhatsapp}
          </div>
        </div>
      ),
    },
    {
      header: 'Motor',
      cell: (transaksi: Transaksi) => (
        <div>
          {transaksi.unitMotor?.jenis
            ? `${transaksi.unitMotor.jenis.merk} ${transaksi.unitMotor.jenis.model}`
            : '-'}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.unitMotor?.platNomor || '-'}
          </div>
        </div>
      ),
    },
    {
      header: 'Mulai',
      cell: (transaksi: Transaksi) => (
        <div>
          {formatTanggal(transaksi.tanggalMulai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.jamMulai}
          </div>
        </div>
      ),
    },
    {
      header: 'Selesai',
      cell: (transaksi: Transaksi) => (
        <div>
          {formatTanggal(transaksi.tanggalSelesai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.jamSelesai}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (transaksi: Transaksi) => <StatusBadge status={transaksi.status} />,
    },
    {
      header: 'Total',
      cell: (transaksi: Transaksi) => (
        <span className="font-medium">
          {formatRupiah(Number(transaksi.totalBiaya))}
        </span>
      ),
    },
  ];

  const mobileColumns = [
    {
      header: 'Penyewa',
      accessorKey: 'namaPenyewa' as const,
      isMainField: true,
      cell: (transaksi: Transaksi) => (
        <div>
          <div className="font-medium">{transaksi.namaPenyewa}</div>
          <div className="text-xs text-neutral-500">{transaksi.noWhatsapp}</div>
        </div>
      ),
      icon: <User className="h-3 w-3" />,
    },
    {
      header: 'Motor',
      cell: (transaksi: Transaksi) => (
        <div>
          <div>
            {transaksi.unitMotor?.jenis
              ? `${transaksi.unitMotor.jenis.merk} ${transaksi.unitMotor.jenis.model}`
              : '-'}
          </div>
          <div className="text-xs text-neutral-500">
            {transaksi.unitMotor?.platNomor || '-'}
          </div>
        </div>
      ),
      icon: <Bike className="h-3 w-3" />,
    },
    {
      header: 'Waktu Sewa',
      cell: (transaksi: Transaksi) => (
        <div>
          <div>
            {formatTanggal(transaksi.tanggalMulai)}, {transaksi.jamMulai}
          </div>
          <div className="text-xs text-neutral-500">
            s/d {formatTanggal(transaksi.tanggalSelesai)},{' '}
            {transaksi.jamSelesai}
          </div>
        </div>
      ),
      icon: <Clock className="h-3 w-3" />,
    },
    {
      header: 'Status',
      cell: (transaksi: Transaksi) => <StatusBadge status={transaksi.status} />,
      icon: <Tag className="h-3 w-3" />,
    },
    {
      header: 'Total',
      cell: (transaksi: Transaksi) => (
        <span className="font-medium">
          {formatRupiah(Number(transaksi.totalBiaya))}
        </span>
      ),
      icon: <CreditCard className="h-3 w-3" />,
    },
  ];

  const handleTransaksiClick = (transaksi: Transaksi) => {
    window.location.href = `/dashboard/transaksi/${transaksi.id}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-4 pb-3 md:px-5">
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-5">
        {isMobile ? (
          <MobileDataList
            data={data}
            columns={mobileColumns}
            keyField="id"
            onItemClick={handleTransaksiClick}
            emptyMessage="Belum ada data transaksi"
            isLoading={isLoading}
          />
        ) : (
          <div className="w-full overflow-hidden">
            <DataTable
              data={data}
              columns={transaksiColumns}
              keyField="id"
              onRowClick={handleTransaksiClick}
              emptyMessage="Belum ada data transaksi"
              isLoading={isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
