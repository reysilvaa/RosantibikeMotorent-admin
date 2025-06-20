'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterButtons, FilterOption } from '@/components/ui/filter-buttons';
import { ItemCard } from '@/components/ui/item-card';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search-bar';
import { StatusMessage } from '@/components/ui/status-message';
import { useBlogStore } from '@/lib/store/blog/blog-store';
import { BlogStatus } from '@/lib/types/blog';

export default function BlogListPage() {
  const router = useRouter();
  const {
    data,
    loading,
    error,
    success,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    totalData,
    limit,
    showDeleteDialog,
    blogToDelete,
    fetchBlogs,
    handleSearch,
    setSearchQuery,
    handleStatusFilterChange,
    handlePageChange,
    resetSearch,
    confirmDelete,
    cancelDelete,
    deleteBlog,
  } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filterOptions: FilterOption<BlogStatus | ''>[] = [
    { value: '', label: 'Semua' },
    { value: BlogStatus.PUBLISHED, label: 'Terbit' },
    { value: BlogStatus.DRAFT, label: 'Draft' },
  ];

  const handleAdd = () => {
    router.push('/dashboard/blog/tambah');
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/blog/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/blog/${id}`);
  };

  const blogForDelete = blogToDelete
    ? data.find(blog => blog.id === blogToDelete)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Blog"
          description="Kelola blog untuk website"
          actionLabel="Tambah Blog"
          actionIcon={<Plus className="mr-2 h-4 w-4" />}
          actionHandler={handleAdd}
        />

        <Card>
          <CardHeader className="px-4 py-4 pb-3 md:px-6">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onReset={resetSearch}
              placeholder="Cari judul blog..."
              title="Daftar Blog"
              showTitle={true}
            />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6">
            <FilterButtons
              options={filterOptions}
              currentValue={statusFilter}
              onChange={handleStatusFilterChange}
            />

            <StatusMessage error={error} success={success} />

            {loading ? (
              <LoadingIndicator />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {data.length > 0 ? (
                    data.map(blog => (
                      <ItemCard
                        key={blog.id}
                        title={blog.judul}
                        subtitle={blog.kategori || 'Tanpa kategori'}
                        imageSrc={blog.thumbnail}
                        imageAlt={blog.judul}
                        onEdit={() => handleEdit(blog.id)}
                        onDelete={() => confirmDelete(blog.id)}
                        actionButtons={
                          <div className="flex w-full gap-1 md:gap-2">
                            <button
                              className="flex-1 rounded-md border border-neutral-200 px-2 py-1.5 text-xs hover:bg-neutral-100 md:px-3 md:text-sm dark:border-neutral-800 dark:hover:bg-neutral-800"
                              onClick={() => handleView(blog.id)}
                            >
                              Lihat
                            </button>
                            <button
                              className="flex-1 rounded-md border border-neutral-200 px-2 py-1.5 text-xs hover:bg-neutral-100 md:px-3 md:text-sm dark:border-neutral-800 dark:hover:bg-neutral-800"
                              onClick={() => handleEdit(blog.id)}
                            >
                              Edit
                            </button>
                          </div>
                        }
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={FileText}
                      title={
                        searchQuery
                          ? 'Tidak ada blog yang sesuai dengan pencarian'
                          : 'Belum ada blog yang ditambahkan'
                      }
                      description={
                        searchQuery
                          ? 'Coba kata kunci lain atau reset pencarian'
                          : 'Mulai dengan menambahkan blog baru'
                      }
                      actionLabel={searchQuery ? undefined : 'Tambah Blog'}
                      actionHandler={searchQuery ? undefined : handleAdd}
                      className="col-span-full"
                    />
                  )}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalData={totalData}
                    limit={limit}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}

            <ConfirmDialog
              isOpen={showDeleteDialog}
              title="Hapus Blog"
              description={
                blogForDelete
                  ? `Apakah Anda yakin ingin menghapus blog "${blogForDelete.judul}"? Tindakan ini tidak dapat dibatalkan.`
                  : 'Apakah Anda yakin ingin menghapus blog ini? Tindakan ini tidak dapat dibatalkan.'
              }
              confirmLabel="Hapus"
              cancelLabel="Batal"
              variant="destructive"
              loading={loading}
              onClose={cancelDelete}
              onConfirm={deleteBlog}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
