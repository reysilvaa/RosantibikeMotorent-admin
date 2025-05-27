"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  RefreshCcw,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  ImageIcon,
} from "lucide-react";
import { getJenisMotor, deleteJenisMotor } from "@/lib/jenis-motor";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JenisMotorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jenisMotor, setJenisMotor] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchJenisMotor = async () => {
    try {
      setLoading(true);
      const response = await getJenisMotor();
      setJenisMotor(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Gagal mengambil data jenis motor:", error);
      setError("Gagal mengambil data jenis motor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenisMotor();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      setFilteredData(jenisMotor);
      return;
    }
    
    const filtered = jenisMotor.filter(
      (jenis) =>
        jenis.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jenis.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${jenis.merk} ${jenis.model}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredData(jenisMotor);
  };

  const confirmDelete = (id: string) => {
    setJenisToDelete(id);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!jenisToDelete) return;
    
    try {
      setLoading(true);
      await deleteJenisMotor(jenisToDelete);
      setSuccess("Jenis motor berhasil dihapus");
      fetchJenisMotor();
    } catch (error) {
      console.error("Gagal menghapus jenis motor:", error);
      setError("Gagal menghapus jenis motor");
    } finally {
      setLoading(false);
      setShowDialog(false);
      setJenisToDelete(null);
    }
  };

  const handleAdd = () => {
    router.push("/dashboard/jenis-motor/tambah");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/jenis-motor/edit/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Jenis Motor
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Kelola daftar jenis motor yang tersedia
            </p>
          </div>
          <Button className="hidden sm:flex" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jenis
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Jenis Motor</CardTitle>
              <form
                onSubmit={handleSearch}
                className="flex w-full items-center space-x-2 sm:w-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Cari merk atau model..."
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
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredData.length > 0 ? (
                  filteredData.map((jenis) => (
                    <Card key={jenis.id} className="overflow-hidden">
                      <div className="h-40 w-full relative bg-neutral-100 dark:bg-neutral-800">
                        {jenis.gambar ? (
                          <Image
                            src={jenis.gambar}
                            alt={jenis.nama}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{jenis.merk} {jenis.model}</h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {jenis.cc} CC
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(jenis.id)}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                            onClick={() => confirmDelete(jenis.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex h-96 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div>
                      <ImageIcon className="mx-auto h-10 w-10 text-neutral-400" />
                      <h3 className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        {searchQuery
                          ? "Tidak ada jenis motor yang sesuai dengan pencarian"
                          : "Belum ada data jenis motor"}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        {searchQuery
                          ? "Coba kata kunci lain atau reset pencarian"
                          : "Mulai dengan menambahkan jenis motor baru"}
                      </p>
                      {!searchQuery && (
                        <Button
                          onClick={handleAdd}
                          className="mt-4"
                          size="sm"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Tambah Jenis Motor
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
                  <h3 className="text-lg font-medium">Konfirmasi Hapus</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    Apakah Anda yakin ingin menghapus jenis motor ini? Tindakan ini
                    tidak dapat dibatalkan.
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDialog(false);
                        setJenisToDelete(null);
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}