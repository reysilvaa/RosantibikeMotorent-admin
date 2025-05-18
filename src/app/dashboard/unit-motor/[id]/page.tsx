"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { getUnitMotorDetail, updateUnitMotor, deleteUnitMotor } from "@/lib/unit-motor";
import { getJenisMotor, JenisMotor } from "@/lib/jenis-motor";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DetailUnitMotorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [unitMotor, setUnitMotor] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jenisMotorOptions, setJenisMotorOptions] = useState<JenisMotor[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form state
  const [plat, setPlat] = useState("");
  const [tahunPembuatan, setTahunPembuatan] = useState("");
  const [hargaSewa, setHargaSewa] = useState("");
  const [jenisMotorId, setJenisMotorId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUnitMotorDetail(params.id);
        setUnitMotor(data);
        
        // Siapkan state form dari data
        setPlat(data.plat);
        setTahunPembuatan(data.tahunPembuatan);
        setHargaSewa(data.hargaSewa.toString());
        setJenisMotorId(data.jenisMotorId);
        setStatus(data.status);
        
        // Ambil jenis motor untuk dropdown
        const jenisMotorData = await getJenisMotor();
        setJenisMotorOptions(jenisMotorData);
      } catch (error) {
        console.error("Gagal mengambil data unit motor:", error);
        setError("Gagal mengambil data unit motor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleToggleEdit = () => {
    setEditing(!editing);
    setError("");
    setSuccess("");
    
    // Reset form state jika batal edit
    if (editing) {
      setPlat(unitMotor.plat);
      setTahunPembuatan(unitMotor.tahunPembuatan);
      setHargaSewa(unitMotor.hargaSewa.toString());
      setJenisMotorId(unitMotor.jenisMotorId);
      setStatus(unitMotor.status);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError("");
      
      const updatedData = {
        plat,
        tahunPembuatan,
        hargaSewa: parseInt(hargaSewa),
        jenisMotorId,
        status,
      };
      
      const result = await updateUnitMotor(params.id, updatedData);
      setUnitMotor(result);
      setSuccess("Unit motor berhasil diperbarui");
      setEditing(false);
    } catch (error) {
      console.error("Gagal memperbarui unit motor:", error);
      setError("Gagal memperbarui unit motor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      setDeleting(true);
      await deleteUnitMotor(params.id);
      
      // Redirect ke halaman unit motor setelah berhasil hapus
      router.push("/dashboard/unit-motor");
    } catch (error) {
      console.error("Gagal menghapus unit motor:", error);
      setError("Gagal menghapus unit motor");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/unit-motor");
  };

  const statusOptions = [
    { value: "TERSEDIA", label: "Tersedia" },
    { value: "DISEWA", label: "Disewa" },
    { value: "PERBAIKAN", label: "Perbaikan" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 20 },
    (_, i) => (currentYear - i).toString()
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Memuat data...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Detail Unit Motor
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                {unitMotor?.plat || ""}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={editing ? "default" : "outline"}
              onClick={handleToggleEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {editing ? "Batal" : "Edit"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {confirmDelete ? "Konfirmasi Hapus?" : "Hapus"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-2 h-5 w-5" />
            {success}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informasi Unit Motor</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plat">Plat Nomor</Label>
                    <Input
                      id="plat"
                      value={plat}
                      onChange={(e) => setPlat(e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={setStatus}
                      disabled={saving}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Pilih status unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tahunPembuatan">Tahun Pembuatan</Label>
                    <Select
                      value={tahunPembuatan}
                      onValueChange={setTahunPembuatan}
                      disabled={saving}
                    >
                      <SelectTrigger id="tahunPembuatan">
                        <SelectValue placeholder="Pilih tahun pembuatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hargaSewa">Harga Sewa</Label>
                    <Input
                      id="hargaSewa"
                      value={hargaSewa}
                      onChange={(e) => setHargaSewa(e.target.value)}
                      disabled={saving}
                      type="number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenisMotor">Jenis Motor</Label>
                  <Select
                    value={jenisMotorId}
                    onValueChange={setJenisMotorId}
                    disabled={saving}
                  >
                    <SelectTrigger id="jenisMotor">
                      <SelectValue placeholder="Pilih jenis motor" />
                    </SelectTrigger>
                    <SelectContent>
                      {jenisMotorOptions.map((jenis) => (
                        <SelectItem key={jenis.id} value={jenis.id}>
                          {jenis.merk} {jenis.model} ({jenis.cc} CC)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleToggleEdit}
                    disabled={saving}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className={saving ? "opacity-70" : ""}
                  >
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Simpan
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Plat Nomor
                    </h3>
                    <p className="mt-1 text-lg font-semibold">{unitMotor?.plat}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Status
                    </h3>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          unitMotor?.status === "TERSEDIA"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : unitMotor?.status === "DISEWA"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {unitMotor?.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Jenis Motor
                    </h3>
                    <p className="mt-1 text-lg">
                      {unitMotor?.jenisMotor?.merk} {unitMotor?.jenisMotor?.model} ({unitMotor?.jenisMotor?.cc} CC)
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Tahun Pembuatan
                    </h3>
                    <p className="mt-1 text-lg">{unitMotor?.tahunPembuatan}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Harga Sewa
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-primary">
                      {formatRupiah(unitMotor?.hargaSewa)} / hari
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Tanggal Dibuat
                    </h3>
                    <p className="mt-1 text-lg">
                      {formatTanggal(unitMotor?.createdAt)}
                    </p>
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