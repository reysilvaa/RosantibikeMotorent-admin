'use client';

import React, { useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  LogOut,
  MessageSquare,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useWhatsAppStore } from '@/lib/store/whatsapp/whatsapp-store';

export default function WhatsappPage() {
  const {
    status,
    qrCode,
    qrError,
    qrLoading,
    loading,
    refreshing,
    qrLastUpdated,
    fetchStatus,
    handleRefresh,
    handleLogout,
    handleStart,
  } = useWhatsAppStore();

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getHelpMessage = () => {
    if (status.message && status.message.includes('Invalid response format')) {
      return (
        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          <h4 className="flex items-center font-medium">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Masalah dengan layanan WhatsApp
          </h4>
          <p className="mt-1">
            Server WhatsApp mengalami masalah format respons yang tidak valid.
            Ini biasanya terjadi ketika ada perubahan pada API WhatsApp atau
            masalah dengan layanan WhatsApp pihak ketiga.
          </p>
          <p className="mt-2">Solusi yang dapat dicoba:</p>
          <ul className="mt-1 list-disc pl-5">
            <li>Reset koneksi dan coba mulai sesi baru</li>
            <li>Pastikan layanan WhatsApp di server sedang berjalan</li>
            <li>Hubungi administrator sistem untuk memeriksa log backend</li>
          </ul>
        </div>
      );
    }

    if (status.state === 'RECONNECTING' || status.state === 'reconnecting') {
      return (
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          <h4 className="flex items-center font-medium">
            <Clock className="mr-2 h-4 w-4" />
            Sedang mencoba menghubungkan kembali
          </h4>
          <p className="mt-1">
            Sistem sedang mencoba menghubungkan kembali ke WhatsApp. Harap
            tunggu beberapa saat atau klik tombol &quot;Reset Koneksi&quot;
            untuk memulai sesi baru.
          </p>
        </div>
      );
    }

    if (!status.connected) {
      return (
        <div className="mt-2 text-sm text-yellow-600">
          <Info className="mr-1 inline-block h-4 w-4" />
          <span>
            Silakan klik tombol &quot;Mulai Sesi&quot; untuk memulai koneksi
            WhatsApp
          </span>
        </div>
      );
    }

    return null;
  };

  const getStatusBadge = () => {
    if (status.connected) {
      return (
        <div className="flex items-center">
          <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
          <span className="text-green-600">Terhubung</span>
        </div>
      );
    }

    if (status.state === 'CONNECTING' || status.state === 'connecting') {
      return (
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4 animate-pulse text-blue-500" />
          <span className="text-blue-600">Menghubungkan...</span>
        </div>
      );
    }

    if (status.state === 'RECONNECTING' || status.state === 'reconnecting') {
      return (
        <div className="flex items-center">
          <RefreshCcw className="mr-1 h-4 w-4 animate-spin text-amber-500" />
          <span className="text-amber-600">Menghubungkan kembali...</span>
        </div>
      );
    }

    if (status.state === 'ERROR' || status.state === 'error') {
      return (
        <div className="flex items-center">
          <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
          <span className="text-red-600">Error</span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <XCircle className="mr-1 h-4 w-4 text-red-500" />
        <span className="text-red-600">Terputus</span>
      </div>
    );
  };

  const getStatusDisplay = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <LoadingIndicator className="mr-2" />
          <span>Memuat status...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2 font-medium">Status:</span>
          {getStatusBadge()}
        </div>
        <div>
          <span className="mr-2 font-medium">State:</span>
          <span className="capitalize">{status.state.toLowerCase()}</span>
        </div>
        {status.message && (
          <div>
            <span className="mr-2 font-medium">Pesan:</span>
            <span>{status.message}</span>
          </div>
        )}
        {getHelpMessage()}
      </div>
    );
  };

  const getQrCodeContent = () => {
    if (status.connected) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h3 className="text-lg font-medium">WhatsApp Terhubung</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Anda sudah terhubung ke WhatsApp. Tidak perlu memindai QR code.
          </p>
        </div>
      );
    }

    if (qrLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <LoadingIndicator className="mb-4" />
          <p className="text-center text-sm">Memuat QR code...</p>
        </div>
      );
    }

    if (qrCode) {
      return (
        <div className="flex flex-col items-center">
          <div className="overflow-hidden rounded-md border p-1">
            <img
              src={qrCode}
              alt="WhatsApp QR Code"
              width={300}
              height={300}
              className="aspect-square h-auto w-full max-w-sm object-cover"
            />
          </div>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Pindai QR code ini dengan aplikasi WhatsApp di ponsel Anda
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        {status.state === 'CONNECTING' || status.state === 'connecting' ? (
          <>
            <Clock className="mb-4 h-16 w-16 animate-pulse text-blue-500" />
            <h3 className="text-lg font-medium">Menghubungkan...</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {qrError ||
                'Sedang mempersiapkan QR code. Harap tunggu sebentar...'}
            </p>
          </>
        ) : (
          <>
            <Info className="mb-4 h-16 w-16 text-yellow-500" />
            <h3 className="text-lg font-medium">QR Code Tidak Tersedia</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {qrError ||
                'QR code tidak dapat dimuat. Coba reset koneksi dan mulai sesi baru.'}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={handleStart}
              disabled={refreshing}
            >
              Mulai Sesi Baru
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">WhatsApp</h2>
        <p className="text-muted-foreground">
          Kelola koneksi dan pengaturan WhatsApp
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Koneksi</CardTitle>
            <CardDescription>Status koneksi WhatsApp saat ini</CardDescription>
          </CardHeader>
          <CardContent>{getStatusDisplay()}</CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <LoadingIndicator className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Reset Koneksi
            </Button>
            {status.connected ? (
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={refreshing}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleStart}
                disabled={refreshing}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Mulai Sesi
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>
              Scan QR code dengan WhatsApp di ponsel untuk menghubungkan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {getQrCodeContent()}
          </CardContent>
          {qrCode && (
            <CardFooter className="text-muted-foreground flex flex-col text-center text-sm">
              <div>
                QR code akan kedaluwarsa dalam beberapa menit. Jika kedaluwarsa,
                klik tombol Reset Koneksi.
              </div>
              {qrLastUpdated && (
                <div className="mt-2">
                  QR code terakhir diperbarui:{' '}
                  {qrLastUpdated.toLocaleTimeString()}
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
