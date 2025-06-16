"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { createTransaksi } from "@/lib/api/transaksi";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransaksiFormStore } from "@/lib/store/transaksi-form-store";
import { PenyewaForm } from "@/components/transaksi/penyewa-form";
import { SewaForm } from "@/components/transaksi/sewa-form";
import { FasilitasForm } from "@/components/transaksi/fasilitas-form";

export default function TambahTransaksiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { formData, resetForm } = useTransaksiFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.namaPenyewa || !formData.noWhatsapp || !formData.unitId) {
      toast.error("Mohon lengkapi data wajib");
      return;
    }

    try {
      setIsLoading(true);
      
      await createTransaksi(formData);
      
      toast.success("Transaksi berhasil dibuat");
      resetForm();
      router.push("/dashboard/transaksi");
    } catch (error: any) {
      console.error("Gagal membuat transaksi:", error);
      toast.error(error.message || "Gagal membuat transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tambah Transaksi</h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Tambahkan transaksi rental motor baru
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/transaksi")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informasi Penyewa */}
            <PenyewaForm />

            {/* Informasi Sewa */}
            <SewaForm />

            {/* Fasilitas Tambahan */}
            <FasilitasForm />

            {/* Tombol Submit */}
            <div className="col-span-2 mt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/transaksi")}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Transaksi
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
