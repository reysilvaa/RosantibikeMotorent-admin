"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bike, ArrowLeft, Loader2 } from "lucide-react";
import { createUnitMotor } from "@/lib/unit-motor";
import { getJenisMotor, JenisMotor } from "@/lib/jenis-motor";
import { formatRupiah, formatRupiahInput } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function TambahUnitMotorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jenisMotorOptions, setJenisMotorOptions] = useState<JenisMotor[]>([]);
  const [loadingJenisMotor, setLoadingJenisMotor] = useState(true);

  // Form state
  const [plat, setPlat] = useState("");
  const [tahunPembuatan, setTahunPembuatan] = useState("");
  const [hargaSewa, setHargaSewa] = useState("");
  const [jenisMotorId, setJenisMotorId] = useState("");

  useEffect(() => {
    const fetchJenisMotor = async () => {
      try {
        setLoadingJenisMotor(true);
        const data = await getJenisMotor();
        setJenisMotorOptions(data);
      } catch (error) {
        console.error("Gagal mengambil data jenis motor:", error);
        setError("Gagal mengambil data jenis motor");
      } finally {
        setLoadingJenisMotor(false);
      }
    };

    fetchJenisMotor();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!plat.trim()) {
      setError("Plat nomor harus diisi");
      return;
    }
    
    if (!tahunPembuatan.trim()) {
      setError("Tahun pembuatan harus diisi");
      return;
    }
    
    if (!hargaSewa.trim()) {
      setError("Harga sewa harus diisi");
      return;
    }
    
    if (!jenisMotorId) {
      setError("Jenis motor harus dipilih");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const hargaSewaNumber = parseInt(hargaSewa.replace(/\D/g, ""));
      
      await createUnitMotor({
        plat,
        tahunPembuatan,
        hargaSewa: hargaSewaNumber,
        jenisMotorId,
      });

      setSuccess("Unit motor berhasil ditambahkan");
      
      // Reset form
      setPlat("");
      setTahunPembuatan("");
      setHargaSewa("");
      setJenisMotorId("");
      
      // Redirect setelah 2 detik
      setTimeout(() => {
        router.push("/dashboard/unit-motor");
      }, 2000);
    } catch (error) {
      console.error("Gagal membuat unit motor:", error);
      setError("Gagal membuat unit motor baru");
    } finally {
      setLoading(false);
    }
  };

  const handleHargaSewaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setHargaSewa(formatRupiahInput(parseInt(value)));
    } else {
      setHargaSewa("");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/unit-motor");
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 20 },
    (_, i) => (currentYear - i).toString()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
              Tambah Unit Motor
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Tambahkan unit motor baru ke dalam sistem
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Unit Motor</CardTitle>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="plat">Plat Nomor</Label>
                  <Input
                    id="plat"
                    placeholder="Contoh: KB 1234 XX"
                    value={plat}
                    onChange={(e) => setPlat(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tahunPembuatan">Tahun Pembuatan</Label>
                  <Select
                    value={tahunPembuatan}
                    onValueChange={setTahunPembuatan}
                    disabled={loading}
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hargaSewa">Harga Sewa</Label>
                  <Input
                    id="hargaSewa"
                    placeholder="Contoh: Rp 100.000"
                    value={hargaSewa}
                    onChange={handleHargaSewaChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenisMotor">Jenis Motor</Label>
                  <Select
                    value={jenisMotorId}
                    onValueChange={setJenisMotorId}
                    disabled={loading || loadingJenisMotor}
                  >
                    <SelectTrigger id="jenisMotor">
                      <SelectValue placeholder="Pilih jenis motor" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingJenisMotor ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Memuat...</span>
                        </div>
                      ) : (
                        jenisMotorOptions.map((jenis) => (
                          <SelectItem key={jenis.id} value={jenis.id}>
                            {jenis.merk} ({jenis.cc} CC)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className={loading ? "opacity-70" : ""}
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 