"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { DataTable } from "@/components/ui/data-table";
import { FilterButtons, FilterOption } from "@/components/ui/filter-buttons";
import { useTransaksiListStore } from "@/lib/store/transaksi/transaksi-store";
import { formatRupiah, formatTanggal } from "@/lib/helper";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { StatusTransaksi, Transaksi } from "@/lib/transaksi";

export default function TransaksiPage() {
  const router = useRouter();
  const {
    transaksi,
    loading,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    totalData,
    limit,
    fetchTransaksi,
    setSearchQuery,
    handleStatusFilterChange,
    handlePageChange,
    handleResetFilter
  } = useTransaksiListStore();

  useEffect(() => {
    fetchTransaksi(1);
  }, [fetchTransaksi]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransaksi(1);
  };

  const handleDetailClick = (id: string) => {
    router.push(`/dashboard/transaksi/${id}`);
  };

  // Filter options untuk FilterButtons
  const filterOptions: FilterOption<StatusTransaksi | "">[] = [
    { value: "", label: "Semua" },
    { value: StatusTransaksi.BOOKING, label: "Booking" },
    { value: StatusTransaksi.AKTIF, label: "Aktif" },
    { value: StatusTransaksi.SELESAI, label: "Selesai" },
    { value: StatusTransaksi.BATAL, label: "Batal" },
    { value: StatusTransaksi.OVERDUE, label: "Overdue" }
  ];

  // Columns untuk DataTable
  const columns = [
    {
      header: "Penyewa",
      accessorKey: "namaPenyewa" as const,
      cell: (item: Transaksi) => (
        <div>
          {item.namaPenyewa}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.noWhatsapp}
          </div>
        </div>
      )
    },
    {
      header: "Motor",
      cell: (item: Transaksi) => (
        <div>
          {item.unitMotor?.jenis?.merk || "-"} {item.unitMotor?.jenis?.model || ""}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.unitMotor?.platNomor || "-"}
          </div>
        </div>
      )
    },
    {
      header: "Mulai",
      cell: (item: Transaksi) => (
        <div>
          {formatTanggal(item.tanggalMulai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.jamMulai}
          </div>
        </div>
      )
    },
    {
      header: "Selesai",
      cell: (item: Transaksi) => (
        <div>
          {formatTanggal(item.tanggalSelesai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.jamSelesai}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      cell: (item: Transaksi) => <StatusBadge status={item.status} />
    },
    {
      header: "Total",
      cell: (item: Transaksi) => (
        <span className="font-medium">{formatRupiah(item.totalBiaya)}</span>
      )
    }
  ];

  const handleRowClick = (item: Transaksi) => {
    handleDetailClick(item.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Daftar Transaksi" 
          description="Kelola semua transaksi rental motor"
          actionLabel="Tambah Transaksi"
          actionIcon={<ShoppingCart className="mr-2 h-4 w-4" />}
          actionHref="/dashboard/transaksi/tambah"
        />

        <Card>
          <CardHeader className="pb-3">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onReset={handleResetFilter}
              placeholder="Cari nama atau nomor HP..."
              title="Transaksi"
              showTitle={true}
            />
          </CardHeader>
          <CardContent>
            <FilterButtons
              options={filterOptions}
              currentValue={statusFilter}
              onChange={handleStatusFilterChange}
            />

            {loading ? (
              <LoadingIndicator />
            ) : (
              <>
                <DataTable
                  data={transaksi}
                  columns={columns}
                  keyField="id"
                  onRowClick={handleRowClick}
                  emptyMessage={
                    searchQuery || statusFilter
                      ? "Tidak ada transaksi yang sesuai dengan filter"
                      : "Belum ada data transaksi"
                  }
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalData={totalData}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 