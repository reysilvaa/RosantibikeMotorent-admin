'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { FilterButtons, FilterOption } from '@/components/ui/filter-buttons';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatusMessage } from '@/components/ui/status-message';
import { deleteUnitMotor, getUnitMotor } from '@/lib/api/unit-motor';
import { formatRupiah } from '@/lib/helper';
import { FilterUnitMotor, UnitMotor } from '@/lib/types/unit-motor';

export default function UnitMotorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unitMotors, setUnitMotors] = useState<UnitMotor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const limit = 10;

  const fetchUnitMotors = async (page = 1, filter: FilterUnitMotor = {}) => {
    try {
      setLoading(true);
      const params: FilterUnitMotor = {
        page,
        limit,
        ...filter,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await getUnitMotor(params);

      if (response && response.data) {
        setUnitMotors(response.data);
      } else {
        setUnitMotors([]);
      }

      if (response && response.meta) {
        setTotalData(response.meta.totalItems || 0);
        setTotalPages(response.meta.totalPages || 1);
      } else {
        setTotalData(0);
        setTotalPages(1);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('Gagal mengambil data unit motor:', error);
      setError('Gagal mengambil data unit motor');
      setUnitMotors([]);
      setTotalData(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitMotors(1);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchUnitMotors(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchUnitMotors(1, { status });
  };

  const handlePageChange = (page: number) => {
    fetchUnitMotors(page);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setStatusFilter('');
    fetchUnitMotors(1, {});
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      setLoading(true);
      await deleteUnitMotor(unitToDelete);
      setSuccess('Unit motor berhasil dihapus');
      fetchUnitMotors(currentPage);
    } catch (error) {
      console.error('Gagal menghapus unit motor:', error);
      setError('Gagal menghapus unit motor');
    } finally {
      setLoading(false);
      setShowDialog(false);
      setUnitToDelete(null);
    }
  };

  const handleDetail = (item: UnitMotor) => {
    router.push(`/dashboard/unit-motor/${item.id}`);
  };

  const filterOptions: FilterOption<string>[] = [
    { value: '', label: 'Semua' },
    { value: 'TERSEDIA', label: 'Tersedia' },
    { value: 'DISEWA', label: 'Disewa' },
    { value: 'DIPESAN', label: 'Dipesan' },
    { value: 'PERBAIKAN', label: 'Perbaikan' },
  ];

  const columns = [
    {
      header: 'Jenis Motor',
      cell: (item: UnitMotor) => (
        <div>
          {item.jenis?.merk || '-'} {item.jenis?.model || ''}
        </div>
      ),
    },
    {
      header: 'Tahun',
      accessorKey: 'tahunPembuatan' as keyof UnitMotor,
    },
    {
      header: 'Harga Sewa',
      cell: (item: UnitMotor) => <span>{formatRupiah(item.hargaSewa)}</span>,
    },
    {
      header: 'Status',
      cell: (item: UnitMotor) => (
        <StatusBadge
          status={item.status}
          variant={
            item.status === 'TERSEDIA'
              ? 'success'
              : item.status === 'DISEWA'
                ? 'info'
                : item.status === 'PERBAIKAN'
                  ? 'danger'
                  : 'warning'
          }
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 overflow-hidden md:space-y-8">
        <PageHeader
          title="Unit Motor"
          description="Kelola semua unit motor yang tersedia"
          actionLabel="Tambah Unit"
          actionIcon={<Plus className="mr-2 h-4 w-4" />}
          actionHref="/dashboard/unit-motor/tambah"
        />

        <ConfirmDialog
          isOpen={showDialog}
          title="Hapus Unit Motor"
          description="Apakah Anda yakin ingin menghapus unit motor ini? Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Hapus"
          variant="destructive"
          onConfirm={handleDelete}
          onClose={() => setShowDialog(false)}
        />

        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-4 pb-3 md:px-5">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onReset={handleResetFilter}
              placeholder="Cari plat atau jenis..."
              title="Unit Motor"
              showTitle={true}
            />
          </CardHeader>
          <CardContent className="px-0 pb-4 md:px-2">
            <div className="px-4 md:px-3">
              <StatusMessage error={error} success={success} />

              <FilterButtons
                options={filterOptions}
                currentValue={statusFilter}
                onChange={handleStatusFilterChange}
                className="mb-3"
              />
            </div>

            {loading ? (
              <div className="px-4 md:px-3">
                <LoadingIndicator />
              </div>
            ) : (
              <>
                <div className="w-full overflow-hidden">
                  <DataTable
                    data={unitMotors}
                    columns={columns}
                    keyField="id"
                    onRowClick={handleDetail}
                    emptyMessage={
                      searchQuery || statusFilter
                        ? 'Tidak ada unit motor yang sesuai dengan filter'
                        : 'Belum ada data unit motor'
                    }
                  />
                </div>

                <div className="mt-4 px-4 md:px-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalData={totalData}
                    limit={limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
