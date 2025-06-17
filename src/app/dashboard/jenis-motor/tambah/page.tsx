"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JenisMotorForm } from "@/components/jenis-motor/jenis-motor-form";
import { useJenisMotorFormStore } from "@/lib/store/jenis-motor/jenis-motor-form-store";

export default function TambahJenisMotorPage() {
  const router = useRouter();
  const { success, resetForm } = useJenisMotorFormStore();

  // Reset form ketika komponen unmount
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // Redirect ke halaman jenis motor setelah sukses
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard/jenis-motor");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleCancel = () => {
    router.push("/dashboard/jenis-motor");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Tambah Jenis Motor Baru
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Tambahkan jenis motor baru ke dalam sistem
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Jenis Motor</CardTitle>
          </CardHeader>
          <CardContent>
            <JenisMotorForm onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 