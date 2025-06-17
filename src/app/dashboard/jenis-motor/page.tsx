"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JenisMotorCard } from "@/components/jenis-motor/jenis-motor-card";
import { SearchBar } from "@/components/jenis-motor/search-bar";
import { DeleteDialog } from "@/components/jenis-motor/delete-dialog";
import { EmptyState } from "@/components/jenis-motor/empty-state";
import { LoadingState } from "@/components/jenis-motor/loading-state";
import { StatusMessage } from "@/components/jenis-motor/status-message";
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
    router.push(`/dashboard/jenis-motor/edit/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Jenis Motor
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Kelola daftar jenis motor yang tersedia
            </p>
          </div>
          <Button className="hidden sm:flex" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jenis
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Daftar Jenis Motor</CardTitle>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onReset={resetSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <StatusMessage error={error} success={success} />
            
            {loading ? (
              <LoadingState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredData.length > 0 ? (
                  filteredData.map((jenis) => (
                    <JenisMotorCard
                      key={jenis.id}
                      jenis={jenis}
                      onEdit={handleEdit}
                      onDelete={confirmDelete}
                    />
                  ))
                ) : (
                  <EmptyState
                    isSearching={!!searchQuery}
                    onAdd={handleAdd}
                  />
                )}
              </div>
            )}

            <DeleteDialog
              isOpen={showDeleteDialog}
              loading={loading}
              onClose={cancelDelete}
              onConfirm={deleteJenis}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}