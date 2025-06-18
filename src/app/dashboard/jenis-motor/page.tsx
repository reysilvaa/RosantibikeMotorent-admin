"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ImageIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StatusMessage } from "@/components/ui/status-message";
import { ItemCard } from "@/components/ui/item-card";
import { useJenisMotorStore } from "@/lib/store/jenis-motor/jenis-motor-store";

export default function JenisMotorPage() {
  const router = useRouter();
  const {
    loading,
    error,
    success,
    filteredData,
    searchQuery,
    showDeleteDialog,
    jenisToDelete,
    fetchJenisMotor,
    handleSearch,
    setSearchQuery,
    resetSearch,
    confirmDelete,
    cancelDelete,
    deleteJenis
  } = useJenisMotorStore();

  useEffect(() => {
    fetchJenisMotor();
  }, [fetchJenisMotor]);

  const handleAdd = () => {
    router.push("/dashboard/jenis-motor/tambah");
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/jenis-motor/${id}`);
  };

  // Temukan jenis motor yang akan dihapus untuk pesan konfirmasi
  const jenisMotorToDelete = filteredData.find(j => j.id === jenisToDelete);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <PageHeader
          title="Jenis Motor"
          description="Kelola daftar jenis motor yang tersedia"
          actionLabel="Tambah Jenis"
          actionIcon={<Plus className="mr-2 h-4 w-4" />}
          actionHandler={handleAdd}
        />

        <Card>
          <CardHeader className="pb-3 px-4 py-4 md:px-6">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onReset={resetSearch}
              placeholder="Cari merk atau model..."
              title="Daftar Jenis Motor"
              showTitle={true}
            />
          </CardHeader>
          <CardContent className="px-4 pb-4 md:px-6">
            <StatusMessage error={error} success={success} />
            
            {loading ? (
              <LoadingIndicator />
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {filteredData.length > 0 ? (
                  filteredData.map((jenis) => (
                    <ItemCard
                      key={jenis.id}
                      title={`${jenis.merk} ${jenis.model}`}
                      subtitle={`${jenis.cc} CC`}
                      imageSrc={jenis.gambar}
                      imageAlt={`${jenis.merk} ${jenis.model}`}
                      onEdit={() => handleEdit(jenis.id)}
                      onDelete={() => confirmDelete(jenis.id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={ImageIcon}
                    title={searchQuery ? "Tidak ada jenis motor yang sesuai dengan pencarian" : "Belum ada data jenis motor"}
                    description={searchQuery ? "Coba kata kunci lain atau reset pencarian" : "Mulai dengan menambahkan jenis motor baru"}
                    actionLabel={searchQuery ? undefined : "Tambah Jenis Motor"}
                    actionHandler={searchQuery ? undefined : handleAdd}
                    className="col-span-full"
                  />
                )}
              </div>
            )}

            <ConfirmDialog
              isOpen={showDeleteDialog}
              loading={loading}
              title="Konfirmasi Hapus"
              description={jenisMotorToDelete 
                ? `Apakah Anda yakin ingin menghapus ${jenisMotorToDelete.merk} ${jenisMotorToDelete.model}? Tindakan ini tidak dapat dibatalkan.`
                : "Apakah Anda yakin ingin menghapus jenis motor ini? Tindakan ini tidak dapat dibatalkan."
              }
              confirmLabel="Hapus"
              variant="destructive"
              onClose={cancelDelete}
              onConfirm={deleteJenis}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}