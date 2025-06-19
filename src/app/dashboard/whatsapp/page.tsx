"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  getStatus, 
  getSessionStatus, 
  getQrCode, 
  resetConnection, 
  logoutSession, 
  startAllSessions 
} from "@/lib/whatsapp";
import { CheckCircle, Info, LogOut, MessageSquare, RefreshCcw, XCircle } from "lucide-react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function WhatsappPage() {
  const [status, setStatus] = useState({
    connected: false,
    state: "DISCONNECTED",
    message: "",
  });
  const [qrCode, setQrCode] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      // Ambil status koneksi dari endpoint status
      const statusResponse = await getStatus();
      
      // Ambil status sesi yang lebih detail dari endpoint session-status
      const sessionResponse = await getSessionStatus();
      
      // Gabungkan informasi dari kedua endpoint untuk status yang lebih akurat
      const mergedStatus = {
        connected: statusResponse.connected || 
                  (sessionResponse?.data?.status === 'CONNECTED' || 
                   sessionResponse?.data?.state === 'CONNECTED'),
        state: sessionResponse?.data?.state || statusResponse.state || 'UNKNOWN',
        message: sessionResponse?.data?.message || statusResponse.message || '',
      };
      
      setStatus(mergedStatus);
      if (!mergedStatus.connected) {
        fetchQrCode();
      } else {
        // Jika terhubung, hapus QR code
        setQrCode("");
        setQrError("");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil status WhatsApp",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      setQrLoading(true);
      setQrError("");
      
      const response = await getQrCode();
      if (response && response.qrCode) {
        setQrCode(response.qrCode);
      } else if (response && response.status === "success") {
        setQrCode("");
        setQrError("QR code tidak tersedia. Kemungkinan backend sudah terhubung.");
      } else {
        setQrCode("");
        setQrError("QR code belum siap. Coba lagi dalam beberapa saat.");
      }
    } catch (error: any) {
      console.error("Error fetching QR code:", error);
      setQrCode("");
      
      // Tangani pesan error secara khusus
      if (error.message && error.message.includes("QR code tidak tersedia")) {
        setQrError("QR code tidak tersedia. WhatsApp mungkin sudah terhubung atau sedang mempersiapkan koneksi.");
      } else {
        setQrError("Gagal memuat QR code. Coba reset koneksi atau mulai sesi baru.");
      }
    } finally {
      setQrLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll status setiap 10 detik
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setQrError("");
    
    try {
      await resetConnection();
      toast({
        title: "Berhasil",
        description: "Koneksi WhatsApp sedang di-reset",
      });
      
      // Tunggu sedikit sebelum memeriksa status baru
      setTimeout(() => {
        fetchStatus();
        setRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error("Error resetting connection:", error);
      toast({
        title: "Error",
        description: "Gagal mereset koneksi WhatsApp",
        variant: "destructive",
      });
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Apakah Anda yakin ingin logout dari sesi WhatsApp?")) {
      return;
    }
    
    setRefreshing(true);
    setQrError("");
    
    try {
      await logoutSession();
      toast({
        title: "Berhasil",
        description: "Berhasil logout dari WhatsApp",
      });
      
      setTimeout(() => {
        fetchStatus();
        setRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Gagal logout dari WhatsApp",
        variant: "destructive",
      });
      setRefreshing(false);
    }
  };

  const handleStart = async () => {
    setRefreshing(true);
    setQrError("");
    
    try {
      await startAllSessions();
      toast({
        title: "Berhasil",
        description: "Berhasil memulai sesi WhatsApp",
      });
      
      setTimeout(() => {
        fetchStatus();
        setRefreshing(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error starting session:", error);
      let errorMessage = "Gagal memulai sesi WhatsApp";
      
      // Cek pesan error khusus
      if (error.message && error.message.includes("Invalid response format")) {
        errorMessage = "Format respons dari server WhatsApp tidak valid. Kemungkinan ada masalah dengan layanan WhatsApp. Silakan coba lagi nanti.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setRefreshing(false);
    }
  };

  // Helper untuk menampilkan pesan bantuan berdasarkan state
  const getHelpMessage = () => {
    // Jika ada error spesifik dengan format respons
    if (status.message && status.message.includes("Invalid response format")) {
      return (
        <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
          <h4 className="font-medium">Masalah dengan layanan WhatsApp</h4>
          <p className="mt-1">
            Server WhatsApp mengalami masalah format respons yang tidak valid. 
            Ini biasanya terjadi ketika ada perubahan pada API WhatsApp 
            atau masalah dengan layanan WhatsApp pihak ketiga.
          </p>
          <p className="mt-2">
            Solusi yang dapat dicoba:
          </p>
          <ul className="mt-1 list-disc pl-5">
            <li>Reset koneksi dan coba mulai sesi baru</li>
            <li>Pastikan layanan WhatsApp di server sedang berjalan</li>
            <li>Hubungi administrator sistem untuk memeriksa log backend</li>
          </ul>
        </div>
      );
    }
    
    // Jika status disconnected
    if (!status.connected) {
      return (
        <div className="mt-2 text-sm text-yellow-600">
          <Info className="inline-block h-4 w-4 mr-1" />
          <span>Silakan klik tombol "Mulai Sesi" untuk memulai koneksi WhatsApp</span>
        </div>
      );
    }
    
    return null;
  };

  const getStatusDisplay = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <LoadingIndicator />
          <span>Memuat status...</span>
        </div>
      );
    }

    // Status terhubung
    if (status.connected) {
      return (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="mr-2 font-medium">Status:</span>
            <div className="flex items-center">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-600">Terhubung</span>
            </div>
          </div>
          <div>
            <span className="mr-2 font-medium">State:</span>
            <span>{status.state}</span>
          </div>
          {status.message && (
            <div>
              <span className="mr-2 font-medium">Pesan:</span>
              <span>{status.message}</span>
            </div>
          )}
        </div>
      );
    }

    // Status tidak terhubung
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2 font-medium">Status:</span>
          <div className="flex items-center">
            <XCircle className="mr-1 h-4 w-4 text-red-500" />
            <span className="text-red-600">Terputus</span>
          </div>
        </div>
        <div>
          <span className="mr-2 font-medium">State:</span>
          <span>{status.state}</span>
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
            <CardDescription>
              Status koneksi WhatsApp saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getStatusDisplay()}
          </CardContent>
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
              <Button variant="destructive" onClick={handleLogout} disabled={refreshing}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button variant="default" onClick={handleStart} disabled={refreshing}>
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
            {status.connected ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">WhatsApp Terhubung</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Anda sudah terhubung ke WhatsApp. Tidak perlu memindai QR code.
                </p>
              </div>
            ) : qrLoading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <LoadingIndicator />
                <p className="text-sm text-center">Memuat QR code...</p>
              </div>
            ) : qrCode ? (
              <div className="overflow-hidden rounded-md border p-1">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  width={300}
                  height={300}
                  className="aspect-square h-auto w-full max-w-sm object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Info className="h-16 w-16 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium">QR Code Tidak Tersedia</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {qrError || "QR code tidak dapat dimuat. Coba reset koneksi dan mulai sesi baru."}
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={handleStart}
                  disabled={refreshing}
                >
                  Mulai Sesi Baru
                </Button>
              </div>
            )}
          </CardContent>
          {qrCode && (
            <CardFooter className="text-center text-sm text-muted-foreground">
              QR code akan kedaluwarsa dalam beberapa menit. Jika kedaluwarsa, klik tombol Reset Koneksi.
            </CardFooter>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
} 