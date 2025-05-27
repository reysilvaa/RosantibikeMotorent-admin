"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Plus,
  Search,
  RefreshCcw,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getUnitMotor, deleteUnitMotor, UnitMotor } from "@/lib/unit-motor";
import { formatRupiah } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Komponen badge status
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "TERSEDIA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "DISEWA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "DIPESAN":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
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

export default function UnitMotorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unitMotors, setUnitMotors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const limit = 10;

  const fetchUnitMotors = async (page = 1, filter: any = {}) => {
    try {
      setLoading(true);
      const params: any = {
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

      const response = await getUnitMotor(params);
      setUnitMotors(response.data);
      setTotalData(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Gagal mengambil data unit motor:", error);
      setError("Gagal mengambil data unit motor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitMotors(1);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnitMotors(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchUnitMotors(1, { status });
  };

  const handlePageChange = (page: number) => {
    fetchUnitMotors(page);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("");
    fetchUnitMotors(1, {});
  };

  const confirmDelete = (id: string) => {
    setUnitToDelete(id);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    
    try {
      setLoading(true);
      await deleteUnitMotor(unitToDelete);
      setSuccess("Unit motor berhasil dihapus");
      fetchUnitMotors(currentPage);
    } catch (error) {
      console.error("Gagal menghapus unit motor:", error);
      setError("Gagal menghapus unit motor");
    } finally {
      setLoading(false);
      setShowDialog(false);
      setUnitToDelete(null);
    }
  };

  const handleDetail = (id: string) => {
    router.push(`/dashboard/unit-motor/${id}`);
  };

  const handleAdd = () => {
    router.push("/dashboard/unit-motor/tambah");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Unit Motor
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Kelola semua unit motor yang tersedia
            </p>
          </div>
          <Button className="hidden sm:flex" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Unit
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Unit Motor</CardTitle>
              <form
                onSubmit={handleSearch}
                className="flex w-full items-center space-x-2 sm:w-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Cari plat atau jenis..."
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
            {error && (
              <div className="mb-4 flex items-center rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 flex items-center rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="mr-2 h-5 w-5" />
                {success}
              </div>
            )}
            
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("")}
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === "TERSEDIA" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("TERSEDIA")}
              >
                Tersedia
              </Button>
              <Button
                variant={statusFilter === "DISEWA" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("DISEWA")}
              >
                Disewa
              </Button>
              <Button
                variant={statusFilter === "DIPESAN" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("DIPESAN")}
              >
                Dipesan
              </Button>
              <Button
                variant={statusFilter === "OVERDUE" ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilterChange("OVERDUE")}
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
                        <th className="px-4 py-3">Plat</th>
                        <th className="px-4 py-3">Jenis Motor</th>
                        <th className="px-4 py-3">Tahun</th>
                        <th className="px-4 py-3">Harga Sewa</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitMotors.length > 0 ? (
                        unitMotors.map((unitMotor: UnitMotor) => (
                          <tr
                            key={unitMotor.id}
                            className="border-b text-sm dark:border-neutral-800"
                          >
                            <td className="px-4 py-3 font-medium">
                              {unitMotor.platNomor}
                            </td>
                            <td className="px-4 py-3">
                              {unitMotor.jenis?.merk || "-"} {unitMotor.jenis?.model || ""}
                            </td>
                            <td className="px-4 py-3">{unitMotor.tahunPembuatan}</td>
                            <td className="px-4 py-3">
                              {formatRupiah(unitMotor.hargaSewa)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={unitMotor.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDetail(unitMotor.id)}
                                >
                                  <Settings className="h-4 w-4" />
                                  <span className="sr-only">Detail</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                          >
                            {searchQuery || statusFilter
                              ? "Tidak ada unit motor yang sesuai dengan filter"
                              : "Belum ada data unit motor"}
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
                      {totalData} unit
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

                {showDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
                      <h3 className="text-lg font-medium">Konfirmasi Hapus</h3>
                      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Apakah Anda yakin ingin menghapus unit motor ini? Tindakan ini
                        tidak dapat dibatalkan.
                      </p>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDialog(false);
                            setUnitToDelete(null);
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Menghapus...
                            </>
                          ) : (
                            "Hapus"
                          )}
                        </Button>
                      </div>
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