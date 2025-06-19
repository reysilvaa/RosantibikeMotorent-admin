import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatRupiah, formatTanggal } from "@/lib/helper";
import { Transaksi } from "@/lib/transaksi";
import { StatusBadge } from "@/components/ui/status-badge";

interface RecentTransactionsProps {
  data: Transaksi[];
  isLoading?: boolean;
}

export function RecentTransactions({ data, isLoading = false }: RecentTransactionsProps) {
  const transaksiColumns = [
    {
      header: "Penyewa",
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
      header: "Motor",
      cell: (transaksi: Transaksi) => (
        <div>
          {transaksi.unitMotor?.jenis ? `${transaksi.unitMotor.jenis.merk} ${transaksi.unitMotor.jenis.model}` : "-"}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {transaksi.unitMotor?.platNomor || "-"}
          </div>
        </div>
      ),
    },
    {
      header: "Mulai",
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
      header: "Selesai",
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
      header: "Status",
      cell: (transaksi: Transaksi) => <StatusBadge status={transaksi.status} />,
    },
    {
      header: "Total",
      cell: (transaksi: Transaksi) => (
        <span className="font-medium">{formatRupiah(Number(transaksi.totalBiaya))}</span>
      ),
    },
  ];

  const handleTransaksiClick = (transaksi: Transaksi) => {
    window.location.href = `/dashboard/transaksi/${transaksi.id}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3 px-4 py-4 md:px-6">
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-6">
        <DataTable
          data={data}
          columns={transaksiColumns}
          keyField="id"
          onRowClick={handleTransaksiClick}
          emptyMessage="Belum ada data transaksi"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
} 