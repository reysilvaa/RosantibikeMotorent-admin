'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JenisMotorForm } from '@/components/jenis-motor/jenis-motor-form';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { useJenisMotorFormStore } from '@/lib/store/jenis-motor/jenis-motor-form-store';

export default function TambahJenisMotorPage() {
  const router = useRouter();
  const { success, resetForm } = useJenisMotorFormStore();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/dashboard/jenis-motor');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleCancel = () => {
    router.push('/dashboard/jenis-motor');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tambah Jenis Motor Baru"
          description="Tambahkan jenis motor baru ke dalam sistem"
          showBackButton={true}
          backHref="/dashboard/jenis-motor"
        />

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
