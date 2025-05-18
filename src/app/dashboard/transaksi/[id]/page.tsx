"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  Tag,
  Bike,
  ClipboardCheck,
  Clock8,
} from "lucide-react";
import { getTransaksiDetail, selesaikanTransaksi } from "@/lib/transaksi";
import { formatRupiah, formatTanggal, formatTanggalWaktu } from "@/lib/utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DetailTransaksiPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transaksi, setTransaksi] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTransaksiDetail(params.id);
        setTransaksi(data);
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        setError("Gagal mengambil data transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleBack = () => {
    router.push("/dashboard/transaksi");
  };

  const handleSelesaikan = async () => {
    try {
      setProcessing(true);
      await selesaikanTransaksi(params.id);
      // Refresh data
      const data = await getTransaksiDetail(params.id);
      setTransaksi(data);
      setSuccess("Transaksi berhasil diselesaikan");
    } catch (error) {
      console.error("Gagal menyelesaikan transaksi:", error);
      setError("Gagal menyelesaikan transaksi");
    } finally {
      setProcessing(false);
    }
  };

  // Fungsi untuk mendapatkan badge warna berdasarkan status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "BOOKING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "BERJALAN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "SELESAI":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "BATAL":
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400";
    }
  };

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
                Detail Transaksi
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                ID: {transaksi?.id}
              </p>
            </div>
          </div>
          {transaksi?.status === "BERJALAN" && (
            <Button
              variant="default"
              onClick={handleSelesaikan}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck className="mr-2 h-4 w-4" />
              )}
              Selesaikan Transaksi
            </Button>
          )}
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Penyewa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <User className="mr-2 h-4 w-4" />
                  <span>Nama Penyewa</span>
                </div>
                <p className="text-lg font-medium">{transaksi?.namaPenyewa}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Nomor Telepon</span>
                </div>
                <p className="text-lg font-medium">{transaksi?.noHP}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Alamat</span>
                </div>
                <p className="text-lg font-medium">{transaksi?.alamat}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Sewa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      transaksi?.status
                    )}`}
                  >
                    {transaksi?.status}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Tanggal Mulai</span>
                </div>
                <p className="text-lg font-medium">
                  {formatTanggal(transaksi?.tanggalMulai)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Tanggal Selesai</span>
                </div>
                <p className="text-lg font-medium">
                  {formatTanggal(transaksi?.tanggalSelesai)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Total Harga</span>
                </div>
                <p className="text-xl font-bold text-primary">
                  {formatRupiah(transaksi?.totalHarga)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unit Motor</CardTitle>
          </CardHeader>
          <CardContent>
            {transaksi?.unitMotor ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                      <Bike className="mr-2 h-4 w-4" />
                      <span>Jenis Motor</span>
                    </div>
                    <p className="text-lg font-medium">
                      {transaksi?.unitMotor?.jenisMotor?.merk}{" "}
                      {transaksi?.unitMotor?.jenisMotor?.model} (
                      {transaksi?.unitMotor?.jenisMotor?.cc} CC)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Plat Nomor</span>
                    </div>
                    <p className="text-lg font-medium">
                      {transaksi?.unitMotor?.plat}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Harga Sewa / hari</span>
                    </div>
                    <p className="text-lg font-medium">
                      {formatRupiah(transaksi?.unitMotor?.hargaSewa)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-500 dark:text-neutral-400">
                Data unit motor tidak tersedia
              </p>
            )}
          </CardContent>
        </Card>

        {transaksi?.fasilitas && transaksi.fasilitas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fasilitas Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transaksi.fasilitas.map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span>{item.nama}</span>
                    <span className="font-medium text-primary">
                      {formatRupiah(item.harga)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Transaksi Dibuat</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatTanggalWaktu(transaksi?.createdAt)}
                  </p>
                </div>
              </div>

              {transaksi?.status === "SELESAI" && (
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                    <ClipboardCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Transaksi Selesai</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatTanggalWaktu(transaksi?.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              {transaksi?.status === "OVERDUE" && (
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                    <Clock8 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">Transaksi Overdue</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatTanggalWaktu(transaksi?.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 