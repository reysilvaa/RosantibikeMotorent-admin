"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Admin } from "@/lib/types/admin";
import { DataTable } from "@/components/ui/data-table";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusMessage } from "@/components/ui/status-message";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/store/admin/admin-store";

export default function AdminPage() {
  const router = useRouter();
  
  const {
    admins,
    currentAdmin,
    loading,
    error,
    success,
    searchQuery,
    showDialog,
    fetchAdmins,
    handleSearch,
    resetSearch,
    confirmDelete,
    cancelDelete,
    deleteAdmin: handleDeleteAdmin,
    setSearchQuery
  } = useAdminStore();

  useEffect(() => {
    fetchAdmins();
    
    // Membersihkan pesan error/success saat komponen unmount
    return () => {
      useAdminStore.getState().clearMessages();
    };
  }, [fetchAdmins]);

  const handleAddAdmin = () => {
    router.push("/dashboard/admin/tambah");
  };

  const handleEditAdmin = (id: string) => {
    router.push(`/dashboard/admin/edit/${id}`);
  };

  const columns = [
    {
      header: "Nama",
      accessorKey: "nama" as keyof Admin,
      cell: (item: Admin) => (
        <div className="font-medium">
          {item.nama}
          {currentAdmin?.id === item.id && (
            <Badge className="ml-2" variant="secondary">Anda</Badge>
          )}
        </div>
      ),
    },
    {
      header: "Username",
      accessorKey: "username" as keyof Admin,
    },
    {
      header: "Tanggal Dibuat",
      cell: (item: Admin) => (
        <span>
          {new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Aksi",
      cell: (item: Admin) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleEditAdmin(item.id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
            onClick={() => confirmDelete(item.id)}
            disabled={currentAdmin?.id === item.id}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          title="Manajemen Admin"
          description="Kelola admin dan hak akses sistem"
          actionLabel="Tambah Admin"
          actionIcon={<Plus className="mr-2 h-4 w-4" />}
          actionHandler={handleAddAdmin}
        />

        <Card>
          <CardHeader>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleFormSearch}
              onReset={resetSearch}
              placeholder="Cari nama atau username..."
              title="Daftar Admin"
              showTitle={true}
            />
          </CardHeader>
          <CardContent>
            {error && <StatusMessage error={error} className="mb-4" />}
            {success && <StatusMessage success={success} className="mb-4" />}
            
            {loading ? (
              <LoadingIndicator message="Memuat data admin..." />
            ) : (
              <DataTable
                data={admins}
                columns={columns}
                keyField="id"
                emptyMessage={searchQuery ? "Tidak ada admin yang sesuai dengan pencarian" : "Belum ada data admin"}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showDialog}
        loading={loading}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="destructive"
        onClose={cancelDelete}
        onConfirm={handleDeleteAdmin}
      />
    </DashboardLayout>
  );
} 