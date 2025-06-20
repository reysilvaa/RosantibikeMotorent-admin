'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminEditForm } from '@/components/admin/admin-edit-form';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';

export default function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);

  const handleCancel = () => {
    router.push('/dashboard/admin');
  };

  const handleSuccess = () => {
    router.push('/dashboard/admin');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Edit Admin"
          description="Perbarui data admin"
          showBackButton={true}
          backHref="/dashboard/admin"
        />

        <Card>
          <CardContent className="pt-6">
            <AdminEditForm
              id={id}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
