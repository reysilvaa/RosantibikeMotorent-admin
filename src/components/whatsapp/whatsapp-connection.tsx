'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Loader2,
  LogOut,
  MessageSquare,
  RefreshCcw,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { StatusBadge } from '@/components/ui/status-badge';
import { useWhatsAppStore } from '@/lib/store/whatsapp/whatsapp-store';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface WhatsAppConnectionProps {
  className?: string;
}

export function WhatsAppConnection({ className = '' }: WhatsAppConnectionProps) {
  const {
    status,
    qrCode,
    qrError,
    qrLoading,
    refreshing,
    qrLastUpdated,
    handleRefresh,
    handleLogout,
    handleStart,
  } = useWhatsAppStore();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);

  const renderConnectionStatus = () => {
    if (qrLoading) {
      return <LoadingIndicator message="Memuat status koneksi..." />;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2 font-medium">Status:</span>
          <StatusBadge 
            status={
              status.connected ? "Terhubung" : 
              status.state === 'CONNECTING' || status.state === 'connecting' ? "Menghubungkan..." :
              status.state === 'RECONNECTING' || status.state === 'reconnecting' ? "Menghubungkan kembali..." :
              status.state === 'ERROR' || status.state === 'error' ? "Error" : "Terputus"
            } 
            variant={
              status.connected ? "success" : 
              status.state === 'CONNECTING' || status.state === 'connecting' ? "info" :
              status.state === 'RECONNECTING' || status.state === 'reconnecting' ? "warning" :
              "danger"
            } 
          />
        </div>
        
        <div>
          <span className="mr-2 font-medium">State:</span>
          <Badge variant="outline" className="capitalize">
            {status.state.toLowerCase()}
          </Badge>
        </div>
        
        {status.message && (
          <div>
            <span className="mr-2 font-medium">Pesan:</span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{status.message}</span>
          </div>
        )}

        {status.message && status.message.includes('Invalid response format') && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Masalah dengan layanan WhatsApp</AlertTitle>
            <AlertDescription>
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
            </AlertDescription>
          </Alert>
        )}

        {(status.state === 'RECONNECTING' || status.state === 'reconnecting') && (
          <Alert className="mt-4">
            <Clock className="h-4 w-4" />
            <AlertTitle>Sedang mencoba menghubungkan kembali</AlertTitle>
            <AlertDescription>
              Sistem sedang mencoba menghubungkan kembali ke WhatsApp. Harap
              tunggu beberapa saat atau klik tombol &quot;Reset Koneksi&quot;
              untuk memulai sesi baru.
            </AlertDescription>
          </Alert>
        )}

        {!status.connected && status.state !== 'RECONNECTING' && status.state !== 'reconnecting' && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>WhatsApp belum terhubung</AlertTitle>
            <AlertDescription>
              Silakan klik tombol &quot;Mulai Sesi&quot; untuk memulai koneksi
              WhatsApp atau pindai QR code jika sudah tersedia.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderQrCode = () => {
    if (status.connected) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-lg font-medium">WhatsApp Terhubung</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Anda sudah terhubung ke WhatsApp. Tidak perlu memindai QR code.
          </p>
        </div>
      );
    }

    if (qrLoading) {
      return <LoadingIndicator message="Memuat QR code..." size="large" />;
    }

    if (qrCode) {
      return (
        <div className="flex flex-col items-center">
          <div className="overflow-hidden rounded-lg border-4 border-blue-100 p-2 shadow-lg dark:border-blue-900/30">
            <img
              src={qrCode}
              alt="WhatsApp QR Code"
              width={300}
              height={300}
              className="aspect-square h-auto w-full max-w-sm object-cover"
            />
          </div>
          <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Pindai QR code ini dengan aplikasi WhatsApp di ponsel Anda
          </p>
        </div>
      );
    }

    if (status.state === 'CONNECTING' || status.state === 'connecting') {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
            <Clock className="h-16 w-16 animate-pulse text-blue-500" />
          </div>
          <h3 className="text-lg font-medium">Menghubungkan...</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {qrError || 'Sedang mempersiapkan QR code. Harap tunggu sebentar...'}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 rounded-full bg-yellow-100 p-4 dark:bg-yellow-900/30">
          <Info className="h-16 w-16 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium">QR Code Tidak Tersedia</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {qrError || 'QR code tidak dapat dimuat. Coba reset koneksi dan mulai sesi baru.'}
        </p>
        <Button
          className="mt-6"
          onClick={() => setShowStartConfirm(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="mr-2 h-4 w-4" />
          )}
          Mulai Sesi Baru
        </Button>
      </div>
    );
  };

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Status Koneksi</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Status koneksi WhatsApp saat ini
          </p>
        </CardHeader>
        <CardContent>
          {renderConnectionStatus()}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowResetConfirm(true)} 
            disabled={refreshing}
            className="flex-1"
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Reset Koneksi
          </Button>
          {status.connected ? (
            <Button
              variant="destructive"
              onClick={() => setShowLogoutConfirm(true)}
              disabled={refreshing}
              className="flex-1"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => setShowStartConfirm(true)}
              disabled={refreshing}
              className="flex-1"
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
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Scan QR code dengan WhatsApp di ponsel untuk menghubungkan
          </p>
        </CardHeader>
        <CardContent className="flex justify-center">
          {renderQrCode()}
        </CardContent>
        {qrCode && (
          <CardFooter className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            <div className="w-full">
              <p>
                QR code akan kedaluwarsa dalam beberapa menit. Jika kedaluwarsa,
                klik tombol Reset Koneksi.
              </p>
              {qrLastUpdated && (
                <p className="mt-2">
                  QR code terakhir diperbarui:{' '}
                  {qrLastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        loading={refreshing}
        title="Logout WhatsApp"
        description="Apakah Anda yakin ingin logout dari sesi WhatsApp? Anda perlu memindai QR code lagi untuk terhubung kembali."
        confirmLabel="Logout"
        cancelLabel="Batal"
        variant="destructive"
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          handleLogout();
          setShowLogoutConfirm(false);
        }}
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        loading={refreshing}
        title="Reset Koneksi WhatsApp"
        description="Apakah Anda yakin ingin mereset koneksi WhatsApp? Ini akan memutus koneksi saat ini dan memulai sesi baru."
        confirmLabel="Reset"
        cancelLabel="Batal"
        variant="default"
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          handleRefresh();
          setShowResetConfirm(false);
        }}
      />

      <ConfirmDialog
        isOpen={showStartConfirm}
        loading={refreshing}
        title="Mulai Sesi WhatsApp"
        description="Apakah Anda yakin ingin memulai sesi WhatsApp baru? Ini akan mempersiapkan QR code untuk dipindai."
        confirmLabel="Mulai"
        cancelLabel="Batal"
        variant="default"
        onClose={() => setShowStartConfirm(false)}
        onConfirm={() => {
          handleStart();
          setShowStartConfirm(false);
        }}
      />
    </div>
  );
} 