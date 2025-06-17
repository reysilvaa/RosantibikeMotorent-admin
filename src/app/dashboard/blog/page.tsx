"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogStatus } from "@/lib/blog";
import { formatTanggal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusMessage } from "@/components/ui/status-message";
import { useBlogListStore } from "@/lib/store/blog-store";

export default function BlogPage() {
  const router = useRouter();
  const {
    blogs,
    loading,
    error,
    success,
    filter,
    meta,
    fetchBlogs,
    setFilter,
    resetFilter,
    deleteBlog,
    setPage,
    resetMessages
  } = useBlogListStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [blogToDelete, setBlogToDelete] = React.useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    fetchBlogs();
  };

  const handleConfirmDelete = async () => {
    if (blogToDelete) {
      const success = await deleteBlog(blogToDelete);
      if (success) {
        setShowDeleteConfirm(false);
        setBlogToDelete(null);
      }
    }
  };

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return <Badge className="bg-green-600 border-green-600">Dipublikasi</Badge>;
      case BlogStatus.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const columns = [
    {
      header: "Judul",
      accessorKey: "judul" as keyof typeof blogs[0],
      className: "font-medium"
    },
    {
      header: "Status",
      cell: (blog: typeof blogs[0]) => getStatusBadge(blog.status)
    },
    {
      header: "Tanggal Dibuat",
      cell: (blog: typeof blogs[0]) => formatTanggal(new Date(blog.createdAt))
    }
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Blog"
        description="Kelola artikel blog untuk website Anda"
        actionLabel="Tambah Blog"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionHref="/dashboard/blog/tambah"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Hapus Blog"
        description="Apakah Anda yakin ingin menghapus blog ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>
            Daftar artikel blog yang telah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar
            searchQuery={filter.search || ""}
            setSearchQuery={(search) => setFilter({ search })}
            onSearch={handleSearch}
            onReset={resetFilter}
            placeholder="Cari artikel..."
          />

          <StatusMessage error={error || undefined} success={success || undefined} />

          {loading ? (
            <LoadingIndicator message="Sedang memuat data..." />
          ) : blogs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Tidak ada artikel"
              description="Anda belum memiliki artikel blog. Buat artikel baru sekarang."
              actionLabel="Tambah Blog"
              actionHandler={() => router.push("/dashboard/blog/tambah")}
            />
          ) : (
            <DataTable
              data={blogs}
              columns={columns}
              keyField="id"
              onRowClick={(blog) => router.push(`/dashboard/blog/${blog.id}`)}
            />
          )}
        </CardContent>
        <CardFooter>
          {meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              totalData={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
            />
          )}
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
} 