'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatusMessage } from '@/components/ui/status-message';
import { UnitMotorEditForm } from '@/components/unit-motor/unit-motor-edit-form';
import { deleteUnitMotor, getUnitMotorDetail } from '@/lib/api/unit-motor';
import { formatRupiah, formatTanggal } from '@/lib/helper';
import { UnitMotor } from '@/lib/types/unit-motor';

export default function DetailUnitMotorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [unitMotor, setUnitMotor] = useState<UnitMotor | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { id } = React.use(params);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUnitMotorDetail(id);
        setUnitMotor(data);
      } catch (error) {
        console.error('Gagal mengambil data unit motor:', error);
        setError('Gagal mengambil data unit motor');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleEdit = () => {
    setEditing(!editing);
    setError(undefined);
    setSuccess(undefined);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteUnitMotor(id);

      router.push('/dashboard/unit-motor');
    } catch (error) {
      console.error('Gagal menghapus unit motor:', error);
      setError('Gagal menghapus unit motor');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingIndicator message="Memuat data unit motor..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Detail Unit Motor"
          description={unitMotor?.platNomor}
          showBackButton={true}
          backHref="/dashboard/unit-motor"
        />

        <StatusMessage error={error} success={success} />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Hapus Unit Motor"
          description="Apakah Anda yakin ingin menghapus unit motor ini? Tindakan ini tidak dapat dibatalkan."
          loading={deleting}
          variant="destructive"
          confirmLabel="Hapus"
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informasi Unit Motor</CardTitle>
            {!editing && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleToggleEdit} size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {editing ? (
              <UnitMotorEditForm
                id={id}
                onCancel={handleToggleEdit}
                onSuccess={() => {
                  setEditing(false);

                  setTimeout(async () => {
                    try {
                      const data = await getUnitMotorDetail(id);
                      setUnitMotor(data);
                      setSuccess('Data berhasil diperbarui');
                    } catch (error) {
                      console.error('Gagal mengambil data unit motor:', error);
                    }
                  }, 1000);
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Plat Nomor
                    </h3>
                    <p className="mt-1 text-lg font-semibold">
                      {unitMotor?.platNomor}
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Status
                    </h3>
                    <p className="mt-1">
                      <StatusBadge
                        status={unitMotor?.status || ''}
                        variant={
                          unitMotor?.status === 'TERSEDIA'
                            ? 'success'
                            : unitMotor?.status === 'DISEWA'
                              ? 'info'
                              : unitMotor?.status === 'DIPESAN'
                                ? 'warning'
                                : 'danger'
                        }
                        size="medium"
                      />
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Jenis Motor
                    </h3>
                    <p className="mt-1 text-lg">
                      {unitMotor?.jenis?.merk} {unitMotor?.jenis?.model} (
                      {unitMotor?.jenis?.cc} CC)
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Tahun Pembuatan
                    </h3>
                    <p className="mt-1 text-lg">{unitMotor?.tahunPembuatan}</p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Harga Sewa
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-500">
                      {formatRupiah(unitMotor?.hargaSewa)} / hari
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Tanggal Dibuat
                    </h3>
                    <p className="mt-1 text-lg">
                      {unitMotor?.createdAt
                        ? formatTanggal(unitMotor.createdAt)
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
