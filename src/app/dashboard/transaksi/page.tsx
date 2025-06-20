'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Clock, CreditCard, ShoppingCart, Tag, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  TableViewSelector,
  ViewMode,
} from '@/components/transaksi/table-view-selector';
import TransaksiCalendar from '@/components/transaksi/transaksi-calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { FilterButtons, FilterOption } from '@/components/ui/filter-buttons';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { MobileDataList } from '@/components/ui/mobile-data-list';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { formatRupiah, formatTanggal } from '@/lib/helper';
import { useTransaksiListStore } from '@/lib/store/transaksi/transaksi-store';
import { StatusTransaksi, Transaksi } from '@/lib/transaksi';

export default function TransaksiPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const { isMobile } = useIsMobile();

  useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('card');
    }
  }, [isMobile, viewMode]);

  const {
    transaksi,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    totalData,
    limit,
    loading,
    fetchTransaksi,
    setSearchQuery,
    handleStatusFilterChange,
    handlePageChange,
    handleResetFilter,
  } = useTransaksiListStore();

  useEffect(() => {
    fetchTransaksi(1);
  }, [fetchTransaksi]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransaksi(1);
  };

  const handleDetailClick = (id: string) => {
    router.push(`/dashboard/transaksi/${id}`);
  };

  const filterOptions: FilterOption<StatusTransaksi | ''>[] = [
    { value: '', label: 'Semua' },
    { value: StatusTransaksi.BOOKING, label: 'Booking' },
    { value: StatusTransaksi.AKTIF, label: 'Aktif' },
    { value: StatusTransaksi.SELESAI, label: 'Selesai' },
    { value: StatusTransaksi.BATAL, label: 'Batal' },
    { value: StatusTransaksi.OVERDUE, label: 'Overdue' },
  ];

  const columns = [
    {
      header: 'Penyewa',
      accessorKey: 'namaPenyewa' as const,
      cell: (item: Transaksi) => (
        <div>
          {item.namaPenyewa}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.noWhatsapp}
          </div>
        </div>
      ),
    },
    {
      header: 'Motor',
      cell: (item: Transaksi) => (
        <div>
          {item.unitMotor?.jenis?.merk || '-'}{' '}
          {item.unitMotor?.jenis?.model || ''}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.unitMotor?.platNomor || '-'}
          </div>
        </div>
      ),
    },
    {
      header: 'Mulai',
      cell: (item: Transaksi) => (
        <div>
          {formatTanggal(item.tanggalMulai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.jamMulai}
          </div>
        </div>
      ),
    },
    {
      header: 'Selesai',
      cell: (item: Transaksi) => (
        <div>
          {formatTanggal(item.tanggalSelesai)}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.jamSelesai}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item: Transaksi) => <StatusBadge status={item.status} />,
    },
    {
      header: 'Total',
      cell: (item: Transaksi) => (
        <span className="font-medium">{formatRupiah(item.totalBiaya)}</span>
      ),
    },
  ];

  const mobileColumns = [
    {
      header: 'Penyewa',
      accessorKey: 'namaPenyewa' as const,
      isMainField: true,
      cell: (item: Transaksi) => (
        <div>
          <div className="font-medium">{item.namaPenyewa}</div>
          <div className="text-xs text-neutral-500">{item.noWhatsapp}</div>
        </div>
      ),
      icon: <User className="h-3 w-3" />,
    },
    {
      header: 'Motor',
      cell: (item: Transaksi) => (
        <div>
          <div>
            {item.unitMotor?.jenis?.merk || '-'}{' '}
            {item.unitMotor?.jenis?.model || ''}
          </div>
          <div className="text-xs text-neutral-500">
            {item.unitMotor?.platNomor || '-'}
          </div>
        </div>
      ),
      icon: <Bike className="h-3 w-3" />,
    },
    {
      header: 'Waktu Sewa',
      cell: (item: Transaksi) => (
        <div>
          <div>
            {formatTanggal(item.tanggalMulai)}, {item.jamMulai}
          </div>
          <div className="text-xs text-neutral-500">
            s/d {formatTanggal(item.tanggalSelesai)}, {item.jamSelesai}
          </div>
        </div>
      ),
      icon: <Clock className="h-3 w-3" />,
    },
    {
      header: 'Status',
      cell: (item: Transaksi) => <StatusBadge status={item.status} />,
      icon: <Tag className="h-3 w-3" />,
    },
    {
      header: 'Total',
      cell: (item: Transaksi) => (
        <span className="font-medium">{formatRupiah(item.totalBiaya)}</span>
      ),
      icon: <CreditCard className="h-3 w-3" />,
    },
  ];

  const handleRowClick = (item: Transaksi) => {
    handleDetailClick(item.id);
  };

  const renderContent = () => {
    if (viewMode === 'table') {
      return loading ? (
        <div className="w-full overflow-hidden">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <DataTable
            data={transaksi}
            columns={columns}
            keyField="id"
            onRowClick={handleRowClick}
            emptyMessage={
              searchQuery || statusFilter
                ? 'Tidak ada transaksi yang sesuai dengan filter'
                : 'Belum ada data transaksi'
            }
          />
        </div>
      );
    }

    if (viewMode === 'card') {
      return loading ? (
        <div className="w-full overflow-hidden">
          <LoadingIndicator />
        </div>
      ) : (
        <MobileDataList
          data={transaksi}
          columns={mobileColumns}
          keyField="id"
          onItemClick={handleRowClick}
          emptyMessage={
            searchQuery || statusFilter
              ? 'Tidak ada transaksi yang sesuai dengan filter'
              : 'Belum ada data transaksi'
          }
        />
      );
    }

    if (viewMode === 'calendar') {
      return (
        <div className="w-full overflow-hidden">
          <TransaksiCalendar />
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 overflow-hidden pb-16 md:space-y-8 md:pb-20">
        <PageHeader
          title="Daftar Transaksi"
          description="Kelola semua transaksi rental motor"
          actionLabel="Tambah Transaksi"
          actionIcon={<ShoppingCart className="mr-2 h-4 w-4" />}
          actionHref="/dashboard/transaksi/tambah"
        />

        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-4 pb-3 md:px-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onReset={handleResetFilter}
                placeholder="Cari nama atau nomor HP..."
                title="Transaksi"
                showTitle={true}
              />

              <TableViewSelector
                viewMode={viewMode}
                onChange={setViewMode}
                className="w-auto"
              />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-5">
            <div className="mb-3">
              <FilterButtons
                options={filterOptions}
                currentValue={statusFilter}
                onChange={handleStatusFilterChange}
              />
            </div>

            {}

            {viewMode !== 'calendar' && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalData={totalData}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {renderContent()}
    </DashboardLayout>
  );
}
