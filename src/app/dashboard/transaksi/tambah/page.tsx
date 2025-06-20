'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { TransaksiForm } from '@/components/transaksi/transaksi-form';
import { PageHeader } from '@/components/ui/page-header';

export default function TambahTransaksiPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard/transaksi');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Tambah Transaksi"
          description="Tambahkan transaksi rental motor baru"
          showBackButton={true}
          backHref="/dashboard/transaksi"
        />

        <TransaksiForm onCancel={handleCancel} />
      </div>
    </DashboardLayout>
  );
}
