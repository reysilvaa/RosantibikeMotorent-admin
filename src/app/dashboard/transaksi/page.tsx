"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ShoppingCart,
  Search,
  RefreshCcw,
  CheckCircle2,
  ExternalLink,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getTransaksi, StatusTransaksi, FilterTransaksi, Transaksi } from "@/lib/transaksi";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

// Komponen badge status
const StatusBadge = ({ status }: { status: StatusTransaksi }) => {
  const getStatusStyle = () => {
    switch (status) {
      case StatusTransaksi.SELESAI:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case StatusTransaksi.BERJALAN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case StatusTransaksi.BOOKING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case StatusTransaksi.BATAL:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case StatusTransaksi.OVERDUE:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};

export default function TransaksiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTransaksi | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 10;

  const fetchTransaksi = async (page = 1, filter: FilterTransaksi = {}) => {
    try {
      setLoading(true);
      const params: FilterTransaksi = {
        page,
        limit,
        ...filter,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await getTransaksi(params);
      setTransaksi(response.data);
      setTotalData(response.meta.total);
      setTotalPages(Math.ceil(response.meta.total / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi(1);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransaksi(1);
  };

  const handleStatusFilterChange = (status: StatusTransaksi | "") => {
    setStatusFilter(status);
    fetchTransaksi(1, { status: status || undefined });
  };

  const handlePageChange = (page: number) => {
    fetchTransaksi(page);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("");
    fetchTransaksi(1, {});
  };

  const handleDetailClick = (id: string) => {
    router.push(`/dashboard/transaksi/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Daftar Transaksi
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Kelola semua transaksi rental motor
            </p>
          </div>
          <Button
            className="hidden sm:flex"
            onClick={() => router.push("/dashboard/transaksi/tambah")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Transaksi</CardTitle>
              <form
                onSubmit={handleSearch}
                className="flex w-full items-center space-x-2 sm:w-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Cari nama atau nomor HP..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="default">
                  Cari
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilter}
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Reset</span>
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("")}
              >
                Semua
              </Button>
              <Button
                variant={
                  statusFilter === StatusTransaksi.BOOKING ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleStatusFilterChange(StatusTransaksi.BOOKING)}
              >
                Booking
              </Button>
              <Button
                variant={
                  statusFilter === StatusTransaksi.BERJALAN
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  handleStatusFilterChange(StatusTransaksi.BERJALAN)
                }
              >
                Berjalan
              </Button>
              <Button
                variant={
                  statusFilter === StatusTransaksi.SELESAI ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleStatusFilterChange(StatusTransaksi.SELESAI)}
              >
                Selesai
              </Button>
              <Button
                variant={
                  statusFilter === StatusTransaksi.BATAL ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleStatusFilterChange(StatusTransaksi.BATAL)}
              >
                Batal
              </Button>
              <Button
                variant={
                  statusFilter === StatusTransaksi.OVERDUE ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleStatusFilterChange(StatusTransaksi.OVERDUE)}
              >
                Overdue
              </Button>
            </div>

            {loading ? (
              <div className="grid h-96 place-items-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-lg font-medium">Memuat data...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left">
                    <thead>
                      <tr className="border-b text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                        <th className="px-4 py-3">
                          <div className="flex items-center">
                            Penyewa
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                        <th className="px-4 py-3">Motor</th>
                        <th className="px-4 py-3">Mulai</th>
                        <th className="px-4 py-3">Selesai</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaksi.length > 0 ? (
                        transaksi.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b text-sm dark:border-neutral-800"
                          >
                            <td className="px-4 py-3 font-medium">
                              {item.namaPenyewa}
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.noHP}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {item.unitMotor?.JenisMotor?.nama || "-"}
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.unitMotor?.plat || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {formatTanggal(item.tanggalMulai)}
                            </td>
                            <td className="px-4 py-3">
                              {formatTanggal(item.tanggalSelesai)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {formatRupiah(item.totalHarga)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDetailClick(item.id)}
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Detail</span>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                          >
                            {searchQuery || statusFilter
                              ? "Tidak ada transaksi yang sesuai dengan filter"
                              : "Belum ada data transaksi"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between border-t pt-4 dark:border-neutral-800">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Menampilkan {(currentPage - 1) * limit + 1}-
                      {Math.min(currentPage * limit, totalData)} dari{" "}
                      {totalData} transaksi
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Sebelumnya
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, i, arr) => (
                          <React.Fragment key={page}>
                            {i > 0 && arr[i - 1] !== page - 1 && (
                              <Button variant="outline" size="sm" disabled>
                                ...
                              </Button>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 