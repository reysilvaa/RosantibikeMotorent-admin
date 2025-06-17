"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { JenisMotorEditForm } from "@/components/jenis-motor/jenis-motor-edit-form";
import { useJenisMotorEditStore } from "@/lib/store/jenis-motor/jenis-motor-edit-store";

interface EditJenisMotorPageProps {
  params: {
    id: string;
  };
}

export default function EditJenisMotorPage({ params }: EditJenisMotorPageProps) {
  const router = useRouter();
  const { id } = params;
  const { success, resetForm } = useJenisMotorEditStore();

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
        <PageHeader
          title="Edit Jenis Motor"
          description="Perbarui informasi jenis motor"
          showBackButton={true}
          backHref="/dashboard/jenis-motor"
        />

        <Card>
          <CardHeader>
            <CardTitle>Data Jenis Motor</CardTitle>
          </CardHeader>
          <CardContent>
            <JenisMotorEditForm id={id} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 