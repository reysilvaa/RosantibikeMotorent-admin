"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Table, Calendar } from "lucide-react";
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
import { TransaksiCalendar } from "@/components/transaksi/transaksi-calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransaksiPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  
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
      <div className="flex flex-col h-full space-y-4 pb-16 md:pb-0">
        <PageHeader 
          title="Daftar Transaksi" 
          description="Kelola semua transaksi rental motor"
          actionLabel="Tambah Transaksi"
          actionIcon={<ShoppingCart className="mr-2 h-4 w-4" />}
          actionHref="/dashboard/transaksi/tambah"
        />

        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onReset={handleResetFilter}
                placeholder="Cari nama atau nomor HP..."
                title="Transaksi"
                showTitle={true}
              />
              
              <Tabs 
                value={viewMode} 
                onValueChange={(value) => setViewMode(value as "table" | "calendar")}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="table">
                    <Table className="h-4 w-4 mr-2" />
                    Tabel
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    Kalender
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <FilterButtons
              options={filterOptions}
              currentValue={statusFilter}
              onChange={handleStatusFilterChange}
              className="mb-2"
            />

            <div className="flex-1 flex flex-col min-h-0">
              {viewMode === "table" && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {loading ? (
                    <LoadingIndicator />
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto">
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
                      </div>
                      
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalData={totalData}
                          limit={limit}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {viewMode === "calendar" && (
                <div className="flex-1 overflow-auto">
                  <TransaksiCalendar />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 