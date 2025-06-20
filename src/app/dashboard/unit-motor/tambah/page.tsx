'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { UnitMotorForm } from '@/components/unit-motor/unit-motor-form';

export default function TambahUnitMotorPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard/unit-motor');
  };

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/dashboard/unit-motor');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tambah Unit Motor"
          description="Tambahkan unit motor baru ke dalam sistem"
          showBackButton={true}
          backHref="/dashboard/unit-motor"
        />

        <Card>
          <CardHeader>
            <CardTitle>Form Unit Motor</CardTitle>
          </CardHeader>
          <CardContent>
            <UnitMotorForm onCancel={handleBack} onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
