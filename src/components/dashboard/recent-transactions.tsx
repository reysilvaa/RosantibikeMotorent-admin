import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { StatusTransaksi, Transaksi } from "@/lib/transaksi";

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
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
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