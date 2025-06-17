"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getAdmins, deleteAdmin } from "@/lib/auth";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Admin } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setCurrentAdmin(useAuthStore.getState().user);
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAdmins();
      setAdmins(response);
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
      setError("Gagal mengambil data admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      fetchAdmins();
      return;
    }
    
    const filtered = admins.filter(
      (admin) =>
        admin.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAdmins(filtered);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    fetchAdmins();
  };

  const confirmDelete = (id: string) => {
    setAdminToDelete(id);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    
    try {
      setLoading(true);
      await deleteAdmin(adminToDelete);
      setSuccess("Admin berhasil dihapus");
      fetchAdmins();
    } catch (error) {
      console.error("Gagal menghapus admin:", error);
      setError("Gagal menghapus admin");
    } finally {
      setLoading(false);
      setShowDialog(false);
      setAdminToDelete(null);
    }
  };

  const handleAddAdmin = () => {
    router.push("/dashboard/admin/tambah");
  };

  const handleEditAdmin = (id: string) => {
    router.push(`/dashboard/admin/edit/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Manajemen Admin
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Kelola admin dan hak akses sistem
            </p>
          </div>
          <Button className="hidden sm:flex" onClick={handleAddAdmin}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Admin
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Admin</CardTitle>
              <form
                onSubmit={handleSearch}
                className="flex w-full items-center space-x-2 sm:w-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Cari nama atau username..."
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
                  onClick={handleResetSearch}
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
            
            {loading ? (
              <div className="grid h-96 place-items-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-lg font-medium">Memuat data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-left">
                  <thead>
                    <tr className="border-b text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Tanggal Dibuat</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr
                          key={admin.id}
                          className="border-b text-sm dark:border-neutral-800"
                        >
                          <td className="px-4 py-3 font-medium">
                            {admin.nama}
                            {currentAdmin?.id === admin.id && (
                              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Anda
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">{admin.username}</td>
                          <td className="px-4 py-3">
                            {new Date(admin.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditAdmin(admin.id)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                onClick={() => confirmDelete(admin.id)}
                                disabled={currentAdmin?.id === admin.id}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                        >
                          {searchQuery
                            ? "Tidak ada admin yang sesuai dengan pencarian"
                            : "Belum ada data admin"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {showDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
                      <h3 className="text-lg font-medium">Konfirmasi Hapus</h3>
                      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Apakah Anda yakin ingin menghapus admin ini? Tindakan ini
                        tidak dapat dibatalkan.
                      </p>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDialog(false);
                            setAdminToDelete(null);
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 