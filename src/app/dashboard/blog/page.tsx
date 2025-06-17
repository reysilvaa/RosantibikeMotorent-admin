"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useBlogStore } from "@/lib/store/blog/blog-store";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { BlogFilter } from "@/components/blog/blog-filter";
import { BlogCard } from "@/components/blog/blog-card";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusMessage } from "@/components/ui/status-message";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function BlogListPage() {
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
    fetchBlogs,
    handleSearch,
    setSearchQuery,
    handleStatusFilterChange,
    handlePageChange,
    resetSearch,
    confirmDelete,
    cancelDelete,
    deleteBlog
  } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <DashboardLayout>
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Blog"
        description="Kelola blog untuk website"
        actionLabel="Tambah Blog"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionHref="/dashboard/blog/tambah"
      />

      <div className="space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onReset={resetSearch}
          placeholder="Cari judul blog..."
        />

        <BlogFilter
          currentValue={statusFilter}
          onChange={handleStatusFilterChange}
        />

        {error && <StatusMessage error={error} />}
        {success && <StatusMessage success={success} />}

        {loading ? (
          <LoadingIndicator />
        ) : data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  judul={blog.judul}
                  thumbnail={blog.thumbnail}
                  status={blog.status}
                  kategori={blog.kategori}
                  createdAt={blog.createdAt}
                  onEdit={() => {
                    window.location.href = `/dashboard/blog/edit/${blog.id}`;
                  }}
                  onDelete={() => confirmDelete(blog.id)}
                />
              ))}
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
        ) : (
          <EmptyState
            title="Tidak ada blog"
            description="Belum ada blog yang ditambahkan"
            actionLabel="Tambah Blog"
            actionHandler={() => {
              window.location.href = "/dashboard/blog/tambah";
            }}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus Blog"
        description="Apakah Anda yakin ingin menghapus blog ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        loading={loading}
        onClose={cancelDelete}
        onConfirm={deleteBlog}
      />
    </div>
    </DashboardLayout>
  );
} 