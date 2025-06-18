"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AdminForm } from "@/components/admin/admin-form";

export default function TambahAdminPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/dashboard/admin");
  };

  const handleSuccess = () => {
    router.push("/dashboard/admin");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tambah Admin"
          description="Tambahkan admin baru ke sistem"
          showBackButton={true}
          backHref="/dashboard/admin"
        />

        <Card>
          <CardContent className="pt-6">
            <AdminForm onCancel={handleCancel} onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 